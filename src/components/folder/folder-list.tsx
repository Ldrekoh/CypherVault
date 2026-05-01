import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getFoldersAction } from "@/server/folder/folder-action";
import { Folder, FolderOpen } from "lucide-react";
import { DeleteFolderButton } from "./DeleteFolderButton";

export async function FolderList() {
  const result = await getFoldersAction();

  if (!result.success || !result.folders || result.folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-muted/30 opacity-60">
        <FolderOpen className="h-12 w-12 mb-4 text-muted-foreground" />
        <p className="text-sm font-bold uppercase tracking-widest italic">
          Aucun dossier
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {result.folders.map((folder) => (
        <Card
          key={folder.id}
          className="group relative border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
        >
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Icône Dossier */}
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${folder.color}20` }}
              >
                <Folder
                  className="h-5 w-5"
                  style={{ color: folder.color, fill: folder.color }}
                />
              </div>

              <CardTitle className="text-sm font-bold truncate">
                {folder.name}
              </CardTitle>
            </div>

            {/* Bouton de suppression direct (affiché au hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <DeleteFolderButton folderId={folder.id} variant="ghost" />
            </div>
          </CardHeader>

          {/* Ligne de rappel de couleur en haut */}
          <div
            className="absolute top-0 left-0 w-full h-0.755"
            style={{ backgroundColor: folder.color }}
          />
        </Card>
      ))}
    </div>
  );
}
