"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cpu, Fingerprint } from "lucide-react";
import { SetupVaultForm } from "./setup-vault-form";

interface SetupVaultModalProps {
  user: { name: string; email: string };
  isOpen: boolean;
}

export function SetupVaultModal({ user, isOpen }: SetupVaultModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-white/5 bg-background/95 backdrop-blur-3xl shadow-[0_0_100px_-20px_rgba(var(--primary),0.2)] rounded-[3rem]">
        {/* HEADER SCI-FI */}
        <div className="relative p-8 bg-primary/5 border-b border-white/5">
          <div className="absolute top-4 right-4 opacity-10">
            <Cpu className="h-20 w-20 text-primary rotate-12" />
          </div>

          <div className="relative flex items-center gap-5">
            <div className="relative flex items-center justify-center h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 rotate-[-4deg]">
              <Fingerprint className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Initialisation <span className="text-primary">Vault</span>
              </DialogTitle>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  Instance : {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="p-8">
          <SetupVaultForm user={user} />
        </div>

        {/* FOOTER INFO */}
        <div className="px-8 pb-8 flex items-center justify-between opacity-40">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1 w-4 rounded-full bg-primary/40" />
            ))}
          </div>
          <DialogDescription className="text-[9px] font-bold uppercase tracking-widest">
            Standard OpenPGP v4.8 • AES-GCM
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
