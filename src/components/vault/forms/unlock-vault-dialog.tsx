"use client";

import { useVault } from "@/components/context/vault-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unlockPrivateKey } from "@/lib/crypto";
import { Loader2, ShieldAlert, ShieldCheck, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UnlockVaultDialog({ encryptedKey }: { encryptedKey: string }) {
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // On récupère l'état et les actions du contexte
  const { setDecryptedKey, isLocked, lockVault, isHydrated } = useVault();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) return;

    setIsLoading(true);

    try {
      const unlockedKey = await unlockPrivateKey(encryptedKey, passphrase);
      setDecryptedKey(unlockedKey);
      setPassphrase("");
      toast.success("Coffre-fort déverrouillé");
      setIsOpen(false);
    } catch (error) {
      setPassphrase("");
      console.error("Erreur de déverrouillage :", error);
      toast.error("Passphrase incorrecte");
    } finally {
      setIsLoading(false);
    }
  };

  // Si on n'a pas encore fini de vérifier le sessionStorage, on affiche un état neutre
  if (!isHydrated)
    return <div className="h-8 w-24 animate-pulse bg-muted rounded-md" />;

  // --- MODE DÉVERROUILLÉ : Bouton pour Verrouiller ---
  if (!isLocked) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          lockVault();
          toast.info("Coffre-fort verrouillé");
        }}
        className="gap-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 text-green-600 dark:text-green-400 h-8 font-bold text-xs uppercase italic transition-all"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Déverrouillé
      </Button>
    );
  }

  // --- MODE VERROUILLÉ : Bouton pour ouvrir la Dialog ---
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setPassphrase("");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-destructive/30 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/50 text-destructive h-8 font-bold text-xs uppercase italic transition-all"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Verrouillé
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 italic uppercase tracking-tighter text-xl">
            <Unlock className="h-5 w-5 text-primary" /> Ouvrir le Vault
          </DialogTitle>
          <DialogDescription>
            Saisissez votre phrase secrète pour charger votre clé privée en
            session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUnlock} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="pass"
              className="text-xs font-bold uppercase tracking-widest opacity-70"
            >
              Vault Passphrase
            </Label>
            <Input
              id="pass"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-black h-11 uppercase italic tracking-tight"
            disabled={isLoading || !passphrase}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Déchiffrement...
              </>
            ) : (
              "Accéder aux secrets"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
