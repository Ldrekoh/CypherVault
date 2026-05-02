"use client";

import { useVault } from "@/components/context/vault-context";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getFoldersAction } from "@/server/folder/folder-action";
import { Folder, FolderOpen, LayoutGrid, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteFolderButton } from "./DeleteFolderButton";
import { CreateFolderDialog } from "./create-folder-dialog";

interface FolderData {
  id: string;
  name: string;
  color: string;
}

export const FolderList = () => {
  const { isLocked, isHydrated } = useVault();
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFolders() {
      if (!isLocked && isHydrated) {
        setLoading(true);
        setError(null);
        try {
          const result = await getFoldersAction();
          if (result.success && result.folders) {
            setFolders(result.folders as FolderData[]);
          } else {
            setError(result.message || "Erreur lors du chargement");
          }
        } catch (err) {
          setError("Erreur serveur");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchFolders();
  }, [isLocked, isHydrated]);

  // --- ÉTATS DE TRANSITION (UX SKELETONS) ---
  if (!isHydrated || loading) {
    return (
      <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[100px] w-full animate-pulse bg-muted/50 rounded-2xl border-2 border-dashed"
          />
        ))}
      </div>
    );
  }

  // --- ÉTAT VERROUILLÉ (UI EMPATHIQUE) ---
  if (isLocked) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-[2.5rem] bg-gradient-to-b from-muted/20 to-transparent">
        <div className="p-6 rounded-full bg-destructive/10 mb-6 ring-8 ring-destructive/5">
          <Lock className="h-10 w-10 text-destructive animate-bounce" />
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">
          Accès Restreint
        </h3>
        <p className="text-sm text-muted-foreground font-medium max-w-[250px] text-center mt-2">
          Le contenu de votre coffre-fort est chiffré. Veuillez le
          déverrouiller.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* HEADER DE SECTION OPTIONNEL */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            Mes Répertoires
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded-full uppercase text-muted-foreground">
          {folders.length} Dossier{folders.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ACTION CARD : Toujours en première position */}
        <CreateFolderDialog />

        {/* LISTE DES DOSSIERS */}
        {folders.length > 0 ? (
          folders.map((folder) => (
            <Card
              key={folder.id}
              className={cn(
                "group relative border-none bg-card hover:bg-accent/50",
                "transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]",
                "rounded-2xl overflow-hidden shadow-sm ring-1 ring-border/50",
              )}
            >
              {/* Accent de couleur sur le côté ou le haut */}
              <div
                className="absolute top-0 left-0 w-full h-1 opacity-80"
                style={{ backgroundColor: folder.color }}
              />

              <CardHeader className="p-5 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div
                    className="p-3 rounded-xl shrink-0 transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `${folder.color}15` }}
                  >
                    <Folder
                      className="h-6 w-6"
                      style={{ color: folder.color, fill: `${folder.color}40` }}
                    />
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <CardTitle className="text-sm font-bold truncate tracking-tight uppercase italic">
                      {folder.name}
                    </CardTitle>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                      Données chiffrées
                    </span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <DeleteFolderButton folderId={folder.id} variant="ghost" />
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          /* PLACEHOLDER QUAND VIDE */
          <div className="col-span-full lg:col-span-3 flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-muted/10">
            <FolderOpen className="h-8 w-8 mb-3 text-muted-foreground/40" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Prêt pour votre premier secret
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
