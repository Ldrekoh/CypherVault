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
import { useVault } from "@/context/vault-context";
import { Lock, ShieldAlert, ShieldCheck, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UnlockVaultForm } from "./unlock-vault-form";

export function UnlockVaultModal({ encryptedKey }: { encryptedKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLocked, lockVault, isHydrated } = useVault();

  if (!isHydrated)
    return (
      <div className="h-9 w-32 animate-pulse bg-secondary/50 rounded-xl" />
    );

  // --- ÉTAT : DÉVERROUILLÉ ---
  if (!isLocked) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          lockVault();
          toast.info("Session sécurisée (Clé purgée)");
        }}
        className="group gap-2 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300"
      >
        <ShieldCheck className="h-4 w-4 fill-emerald-500/20" />
        <span>Vault Ouvert</span>
        <Lock className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    );
  }

  // --- ÉTAT : VERROUILLÉ ---
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-lg shadow-destructive/5"
        >
          <ShieldAlert className="h-4 w-4 fill-destructive/10" />
          Vault Scellé
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] p-8 border-white/5 bg-background/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group">
            <Unlock className="h-8 w-8 text-primary animate-in fade-in zoom-in duration-500" />
          </div>

          <div className="space-y-1 text-center">
            <DialogTitle className="italic uppercase tracking-tighter text-2xl font-black">
              Accès <span className="text-primary">Sécurisé</span>
            </DialogTitle>
            <DialogDescription className="text-[11px] font-medium leading-relaxed">
              Votre clé privée est protégée par votre passphrase. Saisissez-la
              pour déchiffrer vos données localement.
            </DialogDescription>
          </div>
        </DialogHeader>

        <UnlockVaultForm
          encryptedKey={encryptedKey}
          onSuccess={() => setIsOpen(false)}
        />

        <div className="mt-4 py-3 border-t border-white/5">
          <p className="text-[9px] text-center text-muted-foreground/50 font-bold uppercase tracking-[0.1em]">
            Zero-Knowledge Encryption • Session volatile
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
