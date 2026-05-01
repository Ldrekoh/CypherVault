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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unlockPrivateKey } from "@/lib/crypto";
import { useVaultStore } from "@/store/useVaultStore";
import { Loader2, LockKeyhole, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UnlockVaultDialog({ encryptedKey }: { encryptedKey: string }) {
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const setUnlockedKey = useVaultStore((state) => state.setUnlockedKey);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const unlockedKey = await unlockPrivateKey(encryptedKey, passphrase);
      setUnlockedKey(unlockedKey);

      toast.success("Coffre-fort déverrouillé");
      setIsOpen(false);
    } catch (error) {
      console.error("Erreur de déverrouillage :", error);
      toast.error("Passphrase incorrecte");
    } finally {
      setIsLoading(false);
    }
  };

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
          className="gap-2 border-primary/20 hover:bg-primary/5"
        >
          <LockKeyhole className="h-4 w-4 text-primary" />
          Déverrouiller
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 italic uppercase tracking-tighter">
            <Unlock className="h-5 w-5 text-primary" /> Ouvrir le Vault
          </DialogTitle>
          <DialogDescription>
            Saisissez votre phrase secrète pour accéder à vos données chiffrées.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUnlock} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="pass">Passphrase</Label>
            <Input
              id="pass"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Accéder aux secrets"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
