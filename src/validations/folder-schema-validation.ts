import * as z from "zod";

export const folderSchemaValidation = z.object({
  name: z.string().min(1, { message: "Folder name is required" }),
});

export type FolderData = z.infer<typeof folderSchemaValidation>;
