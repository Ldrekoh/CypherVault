"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createFolderAction } from "@/server/folder/folder-action";
import { folderSchemaValidation } from "@/validations/folder-schema-validation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function CreateFolderForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isloading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof folderSchemaValidation>>({
    resolver: zodResolver(folderSchemaValidation),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof folderSchemaValidation>) => {
    setIsLoading(true);
    try {
      const { success, message } = await createFolderAction(data);

      if (success) {
        toast.success(message as string);
        form.reset();
      } else {
        toast.error(message as string);
      }
    } catch (error) {
      console.error("Create folder     error:", error);
      toast.error(
        `An unexpected error occurred ${error instanceof Error ? error.message : ""}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create a new folder</h1>+{" "}
                <p className="text-sm text-balance text-muted-foreground">
                  + Organize your secrets by creating folders +{" "}
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Folder Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter folder name"
                  {...form.register("name")}
                />
                {form.formState.errors.name ? (
                  <p className="text-xs font-medium text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                ) : (
                  <FieldDescription>
                    Enter a descriptive name for your folder.{" "}
                  </FieldDescription>
                )}
              </Field>

              <Button
                variant="default"
                type="submit"
                className="w-full"
                disabled={isloading}
              >
                {isloading ? "Creating..." : "Create Folder"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
