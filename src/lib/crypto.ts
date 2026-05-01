import * as openpgp from "openpgp";

/**
 * Déchiffre une clé privée PGP avec une passphrase
 * Utilisé lors du login ou du déverrouillage du Vault
 */
export const unlockPrivateKey = async (
  armoredKey: string,
  passphrase: string,
) => {
  const privateKey = await openpgp.readPrivateKey({ armoredKey });

  // Cette fonction retourne l'objet PrivateKey déverrouillé en RAM
  return await openpgp.decryptKey({
    privateKey,
    passphrase,
  });
};

/**
 * Génère le trousseau de clés complet pour un nouvel utilisateur
 */
export const generateUserKeys = async (
  name: string,
  email: string,
  passphrase: string,
) => {
  if (typeof window === "undefined") {
    throw new Error("generateUserKeys must be called in a browser context");
  }

  const salt = binToHex(window.crypto.getRandomValues(new Uint8Array(16)));
  const recoveryCode =
    binToHex(window.crypto.getRandomValues(new Uint8Array(16)))
      .match(/.{1,4}/g)
      ?.join("-")
      .toUpperCase() || "";

  // 1. Génération de la paire de clés ECC
  const key = await openpgp.generateKey({
    type: "ecc",
    curve: "curve25519Legacy",
    userIDs: [{ name, email }],
    passphrase,
  });

  // 2. Déchiffrement immédiat pour créer la version de secours
  const privateKeyObj = await unlockPrivateKey(key.privateKey, passphrase);

  // 3. Chiffrement de la clé privée avec le code de secours
  const encryptedPrivateKeyRecovery = (
    await openpgp.encryptKey({
      privateKey: privateKeyObj,
      passphrase: recoveryCode,
    })
  ).armor();

  // 4. Hashage de la passphrase (pour vérification future ou auth)
  const recoveryHash = await deriveKey(passphrase, salt);

  return {
    publicKey: key.publicKey,
    privateKey: key.privateKey,
    encryptedPrivateKeyRecovery,
    recoveryCode,
    salt,
    recoveryHash,
    unlockedKey: privateKeyObj, // Prêt à être injecté dans Zustand
  };
};

/**
 * Chiffre une chaîne de caractères avec une clé publique PGP
 */
export const encryptSecret = async (publicKeyArmored: string, text: string) => {
  // Utilise readKey pour une clé publique
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const message = await openpgp.createMessage({ text });

  return await openpgp.encrypt({
    message,
    encryptionKeys: publicKey,
  });
};

/**
 * Déchiffre un message avec la clé privée déverrouillée (issue du store)
 */
export const decryptSecret = async (
  privateKeyObj: openpgp.PrivateKey,
  encryptedText: string,
) => {
  const message = await openpgp.readMessage({ armoredMessage: encryptedText });

  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKeyObj,
  });

  return decrypted;
};

// --- Helpers ---

const binToHex = (buffer: Uint8Array) =>
  Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const deriveKey = async (
  passphrase: string,
  salt: string,
  iterations = 100000,
) => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return binToHex(new Uint8Array(derivedBits));
};
