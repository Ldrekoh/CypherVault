"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  Folder,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";

import {
  hardDeleteFolderAction,
  restoreFolderAction,
} from "@/server/folder/folder-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface DeletedFolder {
  id: string;
  name: string;
  deletedAt: Date | null;
}

interface FoldersListProps {
  folders: DeletedFolder[];
}

export const FoldersList = ({ folders }: FoldersListProps) => {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleRestore = async (folderId: string) => {
    setPendingId(folderId);
    const res = await restoreFolderAction(folderId);
    setPendingId(null);
    if (res.success) {
      router.refresh();
      toast.success(res.message);
    } else toast.error(res.message);
  };

  const handleHardDelete = async (folderId: string) => {
    if (!confirm("Supprimer définitivement ce dossier ?")) return;
    setPendingId(folderId);
    const res = await hardDeleteFolderAction(folderId);
    setPendingId(null);
    if (res.success) {
      router.refresh();
      toast.success(res.message);
    } else toast.error(res.message);
  };

  if (folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-[3rem] bg-muted/5 opacity-50">
        <div className="p-6 rounded-full bg-muted/10 mb-4">
          <Trash2 className="h-12 w-12 text-muted-foreground/20" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.2em] italic text-muted-foreground">
          La corbeille est vide
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <Card
          key={folder.id}
          className={cn(
            "group relative border-none bg-card hover:bg-accent/30",
            "transition-all duration-500 ease-out rounded-2xl overflow-hidden",
            "shadow-sm ring-1 ring-border/50 hover:ring-destructive/30",
          )}
        >
          {/* Ligne d'accentuation destructive */}
          <div className="absolute top-0 left-0 w-full h-1 bg-destructive/30 opacity-50" />

          <CardHeader className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-3 rounded-xl bg-muted/50 text-muted-foreground shrink-0 transition-transform group-hover:scale-105">
                  <Folder className="h-6 w-6 opacity-40" />
                </div>

                <div className="flex flex-col overflow-hidden">
                  <CardTitle className="text-sm font-bold uppercase italic tracking-tight truncate">
                    {folder.name}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">
                    <Calendar className="h-3 w-3" />
                    Supprimé le{" "}
                    {folder.deletedAt
                      ? new Date(folder.deletedAt).toLocaleDateString()
                      : "Inconnu"}
                  </div>
                </div>
              </div>

              {/* MENU D'ACTIONS */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl font-bold uppercase text-[10px] italic"
                >
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer focus:text-primary"
                    onClick={() => handleRestore(folder.id)}
                    disabled={pendingId === folder.id}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restaurer le dossier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer focus:text-primary"
                    onClick={() => handleHardDelete(folder.id)}
                    disabled={pendingId === folder.id}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Suppression définitive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          {/* OVERLAY DE RESTAURATION RAPIDE AU HOVER */}
          <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-background/80 to-transparent">
            <Button
              className="w-full h-8 rounded-xl text-[10px] font-black uppercase italic gap-2 transition-all hover:scale-[1.02]"
              onClick={() => handleRestore(folder.id)}
              disabled={pendingId === folder.id}
            >
              <RotateCcw className="h-3 w-3" />
              Récupérer maintenant
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
