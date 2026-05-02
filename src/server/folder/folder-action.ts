"use server";

import { db } from "@/db/drizzle";
import { folders } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
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
        and(eq(folders.userId, currentUser.id), isNull(folders.deletedAt)),
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

export const getDeletedFoldersAction = async () => {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "User not authenticated" };
    }
    const deletedFolders = await db.query.folders.findMany({
      where: (folders, { and, eq, isNotNull }) =>
        and(eq(folders.userId, currentUser.id), isNotNull(folders.deletedAt)),
      orderBy: (folders, { desc }) => [desc(folders.deletedAt)],
    });
    return {
      success: true,
      folders: deletedFolders,
      message: `Deleted folders retrieved successfully!`,
    };
  } catch (error) {
    console.error("Get deleted folders error:", error);
    return {
      success: false,
      message: `An unexpected error occurred`,
    };
  }
};

export const softDeleteFolderAction = async (folderId: string) => {
  try {
    const folderIdCheck = z.string().uuid().safeParse(folderId);
    if (!folderIdCheck.success) {
      return { success: false, message: "Invalid folder id" };
    }

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

export const restoreFolderAction = async (folderId: string) => {
  try {
    const folderIdCheck = z.string().uuid().safeParse(folderId);
    if (!folderIdCheck.success) {
      return { success: false, message: "Invalid folder id" };
    }

    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "Non authentifié" };
    }

    const result = await db
      .update(folders)
      .set({ deletedAt: null })
      .where(and(eq(folders.id, folderId), eq(folders.userId, currentUser.id)))
      .returning();

    if (result.length === 0) {
      return { success: false, message: "Dossier introuvable ou accès refusé" };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Dossier restauré avec succès`,
    };
  } catch (error) {
    console.error("Restore folder error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
};

export const hardDeleteFolderAction = async (folderId: string) => {
  try {
    const folderIdCheck = z.string().uuid().safeParse(folderId);
    if (!folderIdCheck.success) {
      return { success: false, message: "Invalid folder id" };
    }

    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "Non authentifié" };
    }
    const result = await db
      .delete(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, currentUser.id)))
      .returning();
    if (result.length === 0) {
      return { success: false, message: "Dossier introuvable ou accès refusé" };
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      message: `Dossier supprimé définitivement`,
    };
  } catch (error) {
    console.error("Hard delete folder error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
};

export const renameFolderAction = async (folderId: string, newName: string) => {
  try {
    const folderIdCheck = z.string().uuid().safeParse(folderId);
    if (!folderIdCheck.success) {
      return { success: false, message: "Invalid folder id" };
    }

    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "Non authentifié" };
    }

    const result = await db
      .update(folders)
      .set({ name: newName })
      .where(and(eq(folders.id, folderId), eq(folders.userId, currentUser.id)))
      .returning();

    if (result.length === 0) {
      return { success: false, message: "Dossier introuvable ou accès refusé" };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Dossier renommé avec succès`,
    };
  } catch (error) {
    console.error("Rename folder error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
};
