"use client";

import { RecoveryModal } from "@/components/forms/auth/RecoveryCodeModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { generateUserKeys } from "@/lib/crypto";
import { cn } from "@/lib/utils";
import { setupVaultAction } from "@/server/vault/vault-action";
import { vaultSchemaValidation } from "@/validations/vault-schema-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function SetupVaultForm({
  className,
  user, // Passe l'utilisateur depuis la page serveur
  ...props
}: React.ComponentProps<"div"> & { user: { name: string; email: string } }) {
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof vaultSchemaValidation>>({
    resolver: zodResolver(vaultSchemaValidation),
    defaultValues: {
      passphrase: "",
      confirmPassphrase: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof vaultSchemaValidation>) => {
    setIsLoading(true);
    try {
      // 1. Génération des clés PGP (Zero-Knowledge)
      const cryptoData = await generateUserKeys(
        user.name,
        user.email,
        data.passphrase,
      );

      // 2. Enregistrement en base de données
      const result = await setupVaultAction(cryptoData);

      if (result.success) {
        setGeneratedCode(cryptoData.recoveryCode);
        setShowModal(true);
        toast.success("Coffre-fort généré avec succès !");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur critique lors de la génération des clés.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold italic uppercase tracking-tighter">
            Initialisez votre Vault
          </CardTitle>
          <CardDescription>
            Créez la clé maîtresse qui protégera vos secrets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              {/* PASSPHRASE */}
              <Field>
                <FieldLabel htmlFor="passphrase">Vault Passphrase</FieldLabel>
                <div className="relative">
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Votre phrase secrète..."
                    className="pr-10"
                    {...form.register("passphrase")}
                  />
                  <LockKeyhole className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
                </div>
                {form.formState.errors.passphrase && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {form.formState.errors.passphrase.message}
                  </p>
                )}
              </Field>

              {/* CONFIRMATION */}
              <Field>
                <FieldLabel htmlFor="confirmPassphrase">
                  Confirmez la Passphrase
                </FieldLabel>
                <Input
                  id="confirmPassphrase"
                  type="password"
                  placeholder="Répétez la phrase..."
                  {...form.register("confirmPassphrase")}
                />
                {form.formState.errors.confirmPassphrase && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {form.formState.errors.confirmPassphrase.message}
                  </p>
                )}
              </Field>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-400">
                ⚠️ <strong>Avertissement :</strong> Cette phrase est différente
                de votre mot de passe de connexion. Si vous l&apos;oubliez, vos
                données sont cryptées à jamais.
              </div>

              <Button
                variant="default"
                type="submit"
                className="w-full font-bold h-11"
                disabled={isloading}
              >
                {isloading
                  ? "Génération des clés PGP..."
                  : "Sécuriser mon compte"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* MODALE DE RÉCUPÉRATION */}
      <RecoveryModal
        isOpen={showModal}
        recoveryCode={generatedCode}
        onConfirm={() => router.push("/dashboard")}
      />
    </div>
  );
}
