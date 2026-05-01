import * as openpgp from "openpgp";

export const generateUserKeys = async (
  name: string,
  email: string,
  passphrase: string,
) => {
  if (typeof window === "undefined") {
    throw new Error("generateUserKeys must be called in a browser context");
  }

  // 1. Salt & Recovery Code aléatoire
  const salt = binToHex(window.crypto.getRandomValues(new Uint8Array(16)));
  // Génère un code de secours type: XXXX-XXXX-XXXX-XXXX
  const recoveryCode =
    binToHex(window.crypto.getRandomValues(new Uint8Array(16)))
      .match(/.{1,4}/g)
      ?.join("-")
      .toUpperCase() || "";

  const key = await openpgp.generateKey({
    type: "ecc",
    curve: "curve25519Legacy",
    userIDs: [{ name, email }],
    passphrase,
  });

  const privateKeyObj = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: key.privateKey }),
    passphrase,
  });

  const encryptedPrivateKeyRecovery = (
    await openpgp.encryptKey({
      privateKey: privateKeyObj,
      passphrase: recoveryCode,
    })
  ).armor();

  const recoveryHash = await deriveKey(passphrase, salt);

  return {
    publicKey: key.publicKey,
    privateKey: key.privateKey,
    encryptedPrivateKeyRecovery: encryptedPrivateKeyRecovery,
    recoveryCode,
    salt,
    recoveryHash,
  };
};

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
