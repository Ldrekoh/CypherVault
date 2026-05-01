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
    console.error("DB Batch Error:", e);
    return {
      success: false,
      message: "Erreur lors de l'enregistrement des clés",
    };
  }
}
