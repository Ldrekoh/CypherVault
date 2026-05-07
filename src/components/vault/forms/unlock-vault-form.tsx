"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVault } from "@/context/vault-context";
import { unlockPrivateKey } from "@/lib/crypto";
import { cn } from "@/lib/utils";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UnlockVaultFormProps {
  encryptedKey: string;
  onSuccess: () => void;
}

export function UnlockVaultForm({
  encryptedKey,
  onSuccess,
}: UnlockVaultFormProps) {
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { setDecryptedKey } = useVault();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) return;

    setIsLoading(true);
    setIsError(false);

    try {
      // Le déchiffrement PGP local
      const unlockedKey = await unlockPrivateKey(encryptedKey, passphrase);

      setDecryptedKey(unlockedKey);
      setPassphrase("");
      toast.success("Accès autorisé. Clé chargée en session.");
      onSuccess();
    } catch (error) {
      setPassphrase("");
      setIsError(true);
      toast.error("Échec de l'authentification : Passphrase invalide");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-3">
        <Label
          htmlFor="pass"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1"
        >
          Master Passphrase
        </Label>
        <div className="relative group">
          <Input
            id="pass"
            type="password"
            value={passphrase}
            onChange={(e) => {
              setPassphrase(e.target.value);
              if (isError) setIsError(false);
            }}
            placeholder="Saisissez votre secret..."
            autoFocus
            className={cn(
              "h-14 bg-secondary/20 border-white/5 rounded-2xl pr-12 transition-all duration-300 focus:ring-primary/20",
              isError && "border-destructive/50 bg-destructive/5 animate-shake",
            )}
          />
          <div className="absolute right-4 top-4 text-muted-foreground/20 group-focus-within:text-primary/40 transition-colors">
            <KeyRound className="h-6 w-6" />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className={cn(
          "w-full h-14 font-black uppercase italic tracking-tighter rounded-2xl transition-all duration-500",
          !isLoading && "shadow-[0_15px_30px_-10px_rgba(var(--primary),0.3)]",
        )}
        disabled={isLoading || !passphrase}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Déchiffrement RSA...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Déverrouiller</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>
    </form>
  );
}
