import { FoldersList } from "@/components/trash/folders-list";
import { getDeletedFoldersAction } from "@/server/folder/folder-action";
import { Trash2 } from "lucide-react";

export default async function TrashPage() {
  const foldersStatus = await getDeletedFoldersAction();
  const folders = foldersStatus.success ? foldersStatus.folders : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* HEADER COHÉRENT */}
      <div className="space-y-2 pb-8 border-b border-border/40">
        <div className="flex items-center gap-2 text-destructive mb-1">
          <Trash2 className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Zone de Sécurité
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
          La <span className="text-destructive">Corbeille</span>
        </h1>
        <p className="text-muted-foreground font-medium italic">
          Gérez vos éléments supprimés.
        </p>
      </div>

      {/* LISTE DES DOSSIERS */}
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
        <FoldersList folders={folders as any} />
      </div>
    </div>
  );
}
