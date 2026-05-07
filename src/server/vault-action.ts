"use server";
import { db } from "@/db/drizzle";
import { userKeys } from "@/db/schema";
import { getCurrentUser } from "./auth-action";

interface CryptoData {
  publicKey: string;
  privateKey: string;
  salt: string;
  recoveryHash: string;
  encryptedPrivateKeyRecovery: string;
}

const getExistingKeys = async (
  userId: string,
  type: "primary" | "recovery",
) => {
  return await db.query.userKeys.findFirst({
    where: (keys, { and, eq }) =>
      and(eq(keys.userId, userId), eq(keys.keyType, type)),
  });
};

export const setupVaultAction = async (cryptoData: CryptoData) => {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) return { success: false, message: "Non autorisé" };

  const existingPrimaryKey = await getExistingKeys(currentUser.id, "primary");

  if (existingPrimaryKey) {
    return {
      success: false,
      message: "Une clé primaire existe déjà pour cet utilisateur",
    };
  }

  try {
    // db.batch prend un tableau de requêtes
    await db.batch([
      db.insert(userKeys).values({
        userId: currentUser.id,
        publicKey: cryptoData.publicKey,
        encryptedPrivateKey: cryptoData.privateKey,
        salt: cryptoData.salt,
        recoveryHash: cryptoData.recoveryHash,
        keyType: "primary",
      }),
      db.insert(userKeys).values({
        userId: currentUser.id,
        publicKey: cryptoData.publicKey,
        encryptedPrivateKey: cryptoData.encryptedPrivateKeyRecovery,
        salt: cryptoData.salt,
        recoveryHash: "RECOVERY_MODE",
        keyType: "recovery",
      }),
    ]);

    return { success: true };
  } catch (e) {
    console.error("Vault setup DB error", {
      userId: currentUser.id,
      error: e instanceof Error ? e.message : "unknown",
    });
    return {
      success: false,
      message: "Erreur lors de l'enregistrement des clés",
    };
  }
};

export const keysExistAction = async () => {
  const { currentUser } = await getCurrentUser();
  if (!currentUser) return { success: false, message: "Non autorisé" };

  try {
    const keys = await getExistingKeys(currentUser.id, "primary");

    if (keys) {
      return {
        success: true,
        hasKeys: true,
        encryptedPrivateKey: keys.encryptedPrivateKey,
      };
    }
    return { success: true, hasKeys: false };
  } catch (e) {
    console.error("Error checking keys existence", {
      userId: currentUser.id,
      error: e instanceof Error ? e.message : "unknown",
    });
    return {
      success: false,
      message: "Erreur lors de la vérification des clés",
    };
  }
};
