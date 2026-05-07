"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { CreateFolderForm } from "./create-folder-form"; 

export function CreateFolderDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-bold uppercase italic tracking-tighter">
          <FolderPlus className="h-4 w-4" />
          Nouveau Dossier
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="italic uppercase tracking-tighter text-2xl">
            Nouveau Dossier
          </DialogTitle>
          <DialogDescription>
            Ajoutez un dossier pour organiser vos secrets.
          </DialogDescription>
        </DialogHeader>

        {/* APPEL DU COMPOSANT FORMULAIRE */}
        <div className="pt-4">
          <CreateFolderForm onSuccess={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
