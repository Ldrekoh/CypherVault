"use client";

import { SignOutButton } from "@/components/forms/auth/signout";
import { Button } from "@/components/ui/button";
import { useVaultStore } from "@/store/useVaultStore"; // Vérifie bien le nom du fichier (useVaultStore vs use-vault-store)
import { LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle";
import { VaultHeader } from "../vault/forms/vault-header";

interface NavbarProps {
  userName?: string | null;
  encryptedKey: string; // Ajoute ceci pour le passer au VaultHeader
}

export function Navbar({ userName, encryptedKey }: NavbarProps) {
  const { isUnlocked, lockVault } = useVaultStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-md text-primary-foreground group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tighter italic">
              CYPHER<span className="text-primary">VAULT</span>
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* 1. Indicateur & Bouton Unlock */}
          {/* On passe la vraie clé ici pour que le dialogue de déchiffrement fonctionne */}
          <VaultHeader encryptedKey={encryptedKey} />

          {/* 2. Bouton "Lock" rapide si déverrouillé */}
          {isUnlocked && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => lockVault()}
              className="text-muted-foreground hover:text-destructive gap-2 h-8"
            >
              <LockKeyhole className="h-4 w-4" />
              <span className="hidden sm:inline">Verrouiller</span>
            </Button>
          )}

          <div className="h-4 w-px bg-border mx-1" />

          <div className="flex items-center gap-2">
            <DarkModeToggle />

            <div className="flex items-center gap-3 pl-2 border-l border-border/50">
              <div className="hidden lg:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold truncate max-w-30">
                  {userName || "User"}
                </span>
                <span className="text-[9px] text-primary font-bold uppercase tracking-tighter italic leading-none">
                  Encrypted Session
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
