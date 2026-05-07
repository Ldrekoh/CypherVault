import * as openpgp from "openpgp";

// ─── Constante partagée ────────────────────────────────────────────────────────
export const SESSION_KEY = "cyphervault_session_key";

// ─── Helpers internes ─────────────────────────────────────────────────────────

const binToHex = (buffer: Uint8Array): string =>
  Array.from(buffer, (b) => b.toString(16).padStart(2, "0")).join("");

const deriveKey = async (
  passphrase: string,
  salt: string,
  iterations = 100_000,
): Promise<string> => {
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations, hash: "SHA-256" },
    keyMaterial,
    256,
  );

  return binToHex(new Uint8Array(derivedBits));
};

// ─── Session storage ──────────────────────────────────────────────────────────

/** Persiste la clé privée déverrouillée en sessionStorage (format armored). */
export const saveKeyToSession = (key: openpgp.PrivateKey | null): void => {
  if (key) sessionStorage.setItem(SESSION_KEY, key.armor());
  else sessionStorage.removeItem(SESSION_KEY);
};

/**
 * Tente de restaurer la clé privée depuis sessionStorage.
 * Retourne `null` si absente ou invalide.
 */
export const loadKeyFromSession =
  async (): Promise<openpgp.PrivateKey | null> => {
    const armored = sessionStorage.getItem(SESSION_KEY);
    if (!armored) return null;

    try {
      return await openpgp.readPrivateKey({ armoredKey: armored });
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  };

// ─── Clés ─────────────────────────────────────────────────────────────────────

/** Déchiffre une clé privée armored avec sa passphrase. */
export const unlockPrivateKey = async (
  armoredKey: string,
  passphrase: string,
): Promise<openpgp.PrivateKey> => {
  const privateKey = await openpgp.readPrivateKey({ armoredKey });
  return openpgp.decryptKey({ privateKey, passphrase });
};

/**
 * Génère le trousseau complet pour un nouvel utilisateur :
 * - paire de clés ECC Curve25519
 * - version de secours chiffrée avec un code de récupération
 * - hash PBKDF2 de la passphrase
 */
export const generateUserKeys = async (
  name: string,
  email: string,
  passphrase: string,
) => {
  if (typeof window === "undefined") {
    throw new Error("generateUserKeys must be called in a browser context");
  }

  const salt = binToHex(crypto.getRandomValues(new Uint8Array(16)));

  const recoveryCode =
    binToHex(crypto.getRandomValues(new Uint8Array(16)))
      .match(/.{1,4}/g)
      ?.join("-")
      .toUpperCase() ?? "";

  // 1. Génération de la paire ECC
  const { publicKey, privateKey: armoredPrivateKey } =
    await openpgp.generateKey({
      type: "ecc",
      curve: "curve25519Legacy",
      userIDs: [{ name, email }],
      passphrase,
    });

  // 2. Déverrouillage nécessaire pour pouvoir re-chiffrer avec le code de secours
  const unlockedKey = await unlockPrivateKey(armoredPrivateKey, passphrase);

  // 3. Version de secours : re-chiffrée avec le code de récupération
  const encryptedPrivateKeyRecovery = (
    await openpgp.encryptKey({
      privateKey: unlockedKey,
      passphrase: recoveryCode,
    })
  ).armor();

  // 4. Hash PBKDF2 de la passphrase (vérification / auth future)
  const recoveryHash = await deriveKey(passphrase, salt);

  return {
    publicKey,
    privateKey: armoredPrivateKey,
    encryptedPrivateKeyRecovery,
    recoveryCode,
    salt,
    recoveryHash,
    unlockedKey, // Prêt à être injecté dans le VaultContext
  };
};

// ─── Chiffrement / Déchiffrement ──────────────────────────────────────────────

/** Chiffre un texte avec une clé publique PGP. */
export const encryptSecret = async (
  publicKeyArmored: string,
  text: string,
): Promise<string> => {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const message = await openpgp.createMessage({ text });
  return (await openpgp.encrypt({
    message,
    encryptionKeys: publicKey,
    format: "armored",
  })) as string;
};

/** Déchiffre un message avec la clé privée déverrouillée (issue du VaultContext). */
export const decryptSecret = async (
  privateKeyObj: openpgp.PrivateKey,
  encryptedText: string,
): Promise<string> => {
  const message = await openpgp.readMessage({ armoredMessage: encryptedText });
  const { data } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKeyObj,
  });
  return data as string;
};
