"use server";
import { db } from "@/db/drizzle";
import { userKeys } from "@/db/schema";
import { getCurrentUser } from "../auth/auth-action";

interface CryptoData {
  publicKey: string;
  privateKey: string;
  salt: string;
  recoveryHash: string;
  encryptedPrivateKeyRecovery: string;
}

export async function setupVaultAction(cryptoData: CryptoData) {
  const { currentUser } = await getCurrentUser();
  if (!currentUser) return { success: false, message: "Non autorisé" };

  // Guard: prevent duplicate vault initialization
  const existingPrimary = await db.query.userKeys.findFirst({
    where: (keys, { and, eq }) =>
      and(eq(keys.userId, currentUser.id), eq(keys.keyType, "primary")),
  });
  if (existingPrimary) {
    return { success: false, message: "Vault already initialized" };
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
}
