"use client";

import { RecoveryModal } from "@/components/forms/auth/RecoveryCodeModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateUserKeys } from "@/lib/crypto";
import { cn } from "@/lib/utils";
import { setupVaultAction } from "@/server/vault/vault-action";
import { setupVaultSchemaValidation } from "@/validations/vault-schema-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function SetupVaultForm({
  className,
  user,
  ...props
}: React.ComponentProps<"div"> & { user: { name: string; email: string } }) {
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof setupVaultSchemaValidation>>({
    resolver: zodResolver(setupVaultSchemaValidation),
    defaultValues: {
      passphrase: "",
      confirmPassphrase: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof setupVaultSchemaValidation>) => {
    setIsLoading(true);
    try {
      // Simulation de latence pour l'effet "Calcul"
      const cryptoData = await generateUserKeys(
        user.name,
        user.email,
        data.passphrase,
      );

      const result = await setupVaultAction(cryptoData);

      if (result.success) {
        setGeneratedCode(cryptoData.recoveryCode);
        setShowModal(true);
        toast.success("Architecture Zero-Knowledge déployée.");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erreur de génération des clés.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4">
            {/* PASSPHRASE */}
            <div className="space-y-2">
              <Label
                htmlFor="passphrase"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                Maître Passphrase
              </Label>
              <div className="relative group">
                <Input
                  id="passphrase"
                  type="password"
                  placeholder="Minimum 12 caractères..."
                  className="h-12 bg-secondary/30 border-white/5 rounded-xl pr-10 focus:ring-primary/20 transition-all"
                  {...form.register("passphrase")}
                />
                <KeyRound className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary/50 transition-colors" />
              </div>
              {form.formState.errors.passphrase && (
                <p className="text-[10px] font-bold text-destructive uppercase tracking-tight ml-1">
                  {form.formState.errors.passphrase.message}
                </p>
              )}
            </div>

            {/* CONFIRMATION */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassphrase"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                Vérification du secret
              </Label>
              <Input
                id="confirmPassphrase"
                type="password"
                placeholder="Répétez la phrase..."
                className="h-12 bg-secondary/30 border-white/5 rounded-xl focus:ring-primary/20"
                {...form.register("confirmPassphrase")}
              />
              {form.formState.errors.confirmPassphrase && (
                <p className="text-[10px] font-bold text-destructive uppercase tracking-tight ml-1">
                  {form.formState.errors.confirmPassphrase.message}
                </p>
              )}
            </div>
          </div>

          {/* WARNING BOX DESIGN 2026 */}
          <div className="relative overflow-hidden rounded-2xl bg-amber-500/5 border border-amber-500/10 p-4">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40" />
            <div className="flex gap-3">
              <LockKeyhole className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400/80 font-medium">
                <strong>SÉCURITÉ CRITIQUE :</strong> Cette phrase chiffre vos
                clés privées localement. Aucune réinitialisation n&apos;est
                possible via nos serveurs.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full h-14 rounded-2xl font-black uppercase italic tracking-tighter transition-all duration-500",
              isloading
                ? "bg-muted"
                : "shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)]",
            )}
            disabled={isloading}
          >
            {isloading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Génération RSA-4096...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Activer le Coffre-Fort</span>
              </div>
            )}
          </Button>
        </form>
      </div>

      <RecoveryModal
        isOpen={showModal}
        recoveryCode={generatedCode}
        onConfirm={() => router.push("/dashboard")}
      />
    </div>
  );
}
