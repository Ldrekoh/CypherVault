"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";
import { SetupVaultForm } from "./setup-vault-form";

interface SetupVaultModalProps {
  user: { name: string; email: string };
  isOpen: boolean;
}

export function SetupVaultModal({ user, isOpen }: SetupVaultModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary p-6 text-primary-foreground flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <ShieldAlert className="h-8 w-8 text-white" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight uppercase italic">
              Action Requise
            </DialogTitle>
            <p className="text-primary-foreground/80 text-sm">
              Sécurisation de votre espace personnel
            </p>
          </div>
        </div>

        <div className="p-6">
          <SetupVaultForm user={user} />
        </div>

        <div className="px-6 pb-6 text-center">
          <DialogDescription className="text-xs text-muted-foreground">
            Chiffrement de bout en bout activé (AES-256 + OpenPGP)
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
