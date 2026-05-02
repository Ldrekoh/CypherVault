"use client";

import { createFolderAction } from "@/server/folder/folder-action";
import { folderSchemaValidation } from "@/validations/folder-schema-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface CreateFolderFormProps {
  onSuccess?: () => void;
}

export function CreateFolderForm({ onSuccess }: CreateFolderFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof folderSchemaValidation>>({
    resolver: zodResolver(folderSchemaValidation),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: z.infer<typeof folderSchemaValidation>) => {
    setIsLoading(true);
    try {
      const { success, message } = await createFolderAction(data);
      if (success) {
        toast.success(message as string);
        form.reset();
        router.refresh(); // Rafraîchit la page pour afficher le nouveau dossier
        onSuccess?.();
      } else {
        toast.error(message as string);
      }
    } catch (error) {
      console.error("Create folder error:", error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel className="text-xs uppercase font-black">
            Nom du dossier
          </FieldLabel>
          <Input
            placeholder="Ex: Personnel"
            {...form.register("name")}
            className="h-11"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="w-full font-black uppercase italic"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          "Créer le dossier"
        )}
      </Button>
    </form>
  );
}
