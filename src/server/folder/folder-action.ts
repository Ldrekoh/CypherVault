"use server";

import { db } from "@/db/drizzle";
import { folders } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache"; // N'oublie pas de revalider !
import { getCurrentUser } from "../auth/auth-action";

interface CreateFolderInput {
  name: string;
}

export const createFolderAction = async (data: CreateFolderInput) => {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "User not authenticated" };
    }

    const [newFolder] = await db
      .insert(folders)
      .values({
        name: data.name,
        userId: currentUser.id,
      })
      .returning();

    revalidatePath("/dashboard");

    return {
      success: true,
      createdFolder: newFolder,
      message: `Folder "${data.name}" created successfully!`,
    };
  } catch (error) {
    console.error("Create folder error:", error);
    return {
      success: false,
      message: `An unexpected error occurred`,
    };
  }
};

export const getFoldersAction = async () => {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "User not authenticated" };
    }

    const userFolders = await db.query.folders.findMany({
      where: (folders, { and, eq, isNull }) =>
        and(
          eq(folders.userId, currentUser.id), // Dossiers de l'utilisateur
          isNull(folders.deletedAt), // Qui n'ont PAS de date de suppression
        ),
      // Optionnel : trier par date de création
      orderBy: (folders, { desc }) => [desc(folders.createdAt)],
    });

    return {
      success: true,
      folders: userFolders,
      message: `Folders retrieved successfully!`,
    };
  } catch (error) {
    console.error("Get folders error:", error);
    return {
      success: false,
      message: `An unexpected error occurred`,
    };
  }
};

export const softDeleteFolderAction = async (folderId: string) => {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "Non authentifié" };
    }

    const result = await db
      .update(folders)
      .set({ deletedAt: new Date() })
      .where(and(eq(folders.id, folderId), eq(folders.userId, currentUser.id)))
      .returning();

    if (result.length === 0) {
      return { success: false, message: "Dossier introuvable ou accès refusé" };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Dossier déplacé dans la corbeille`,
    };
  } catch (error) {
    console.error("Soft delete folder error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
};
