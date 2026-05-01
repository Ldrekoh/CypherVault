"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Copy, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RecoveryModalProps {
  isOpen: boolean;
  recoveryCode: string | null;
  onConfirm: () => void;
}

export function RecoveryModal({
  isOpen,
  recoveryCode,
  onConfirm,
}: RecoveryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!recoveryCode) return;
    navigator.clipboard.writeText(recoveryCode);
    setCopied(true);
    toast.success("Code copié dans le presse-papier");
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard
      .writeText(recoveryCode)
      .then(() => {
        setCopied(true);
        toast.success("Code copié dans le presse-papier");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Impossible de copier le code");
      });
  };

  const downloadRecoveryCode = () => {
    if (!recoveryCode) return;
    const element = document.createElement("a");
    const file = new Blob(
      [
        `MON CODE DE RÉCUPÉRATION SECURE VAULT : ${recoveryCode}\n\nGardez ce code précieusement. Sans lui, vos données sont perdues en cas d'oubli de mot de passe.`,
      ],
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = "recovery-code-vault.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
    toast.success("Fichier de récupération téléchargé");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      {/* onOpenChange vide pour empêcher la fermeture en cliquant à côté */}
      <DialogContent className="sm:max-w-md border-2 border-primary/20">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-xl text-center">
            Action Requise : Sauvegardez votre accès
          </DialogTitle>
          <DialogDescription className="text-center">
            Voici votre <strong>Code de Récupération</strong>. C&apos;est
            l&apos;unique moyen de restaurer vos données si vous oubliez votre
            mot de passe.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <div className="flex items-center justify-center p-6 bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20 font-mono text-2xl font-bold tracking-[0.2em] text-primary">
            {recoveryCode}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 hover:bg-primary/10"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-2 mt-4 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg text-center italic">
          <p>
            ⚠️ Nous ne stockons pas ce code. Si vous le perdez, nous ne pourrons
            pas vous aider.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={downloadRecoveryCode}
          >
            <Download className="h-4 w-4" /> Télécharger (.txt)
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={onConfirm}
            disabled={!recoveryCode}
          >
            J'ai sauvegardé le code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
