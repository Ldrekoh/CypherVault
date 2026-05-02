"use client";

import { Button } from "@/components/ui/button";
import { softDeleteFolderAction } from "@/server/folder/folder-action";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteFolderButtonProps {
  folderId: string;
  variant?: "ghost" | "destructive" | "outline";
}

export function DeleteFolderButton({
  folderId,
  variant = "ghost",
}: DeleteFolderButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Supprimer ce dossier ?")) return;

    setIsPending(true);
    try {
      const res = await softDeleteFolderAction(folderId);
      if (res.success) {
        router.refresh();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Delete folder error:", err);
      toast.error("Erreur serveur");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="icon"
      aria-label="Delete folder"
      title="Delete folder"
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
