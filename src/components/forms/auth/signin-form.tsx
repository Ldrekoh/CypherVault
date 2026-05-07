"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signInAction } from "@/server/auth/auth-action";
import { signinSchemaValidation } from "@/validations/auth-schema-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, KeyRound, Loader2, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchemaValidation>>({
    resolver: zodResolver(signinSchemaValidation),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchemaValidation>) => {
    setIsLoading(true);
    try {
      const { success, message } = await signInAction(
        data.email,
        data.password,
      );

      if (success) {
        toast.success("Welcome back!", {
          description: message as string,
        });
        router.push("/dashboard");
      } else {
        toast.error(message as string);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full max-w-[450px] mx-auto",
        className,
      )}
      {...props}
    >
      <Card className="border border-border/40 shadow-xl bg-background/60 backdrop-blur-xl overflow-hidden">
        {/* Barre de progression subtile au-dessus du card quand ça charge */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary animate-pulse" />
        )}

        <CardContent className="p-8">
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground italic">
                Enter your credentials to access your workspace
              </p>
            </div>

            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                  Email Address
                </FieldLabel>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    className="h-11 pl-10 bg-muted/20 border-border/50 focus:bg-background transition-all"
                    {...form.register("email")}
                  />
                </div>
                <ErrorMessage message={form.formState.errors.email?.message} />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                    Password
                  </FieldLabel>
                  <a
                    href="/forgot-password"
                    className="text-[10px] font-bold uppercase text-primary hover:underline transition-all"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 pl-10 bg-muted/20 border-border/50 focus:bg-background transition-all"
                    {...form.register("password")}
                  />
                </div>
                <ErrorMessage
                  message={form.formState.errors.password?.message}
                />
              </Field>

              <Button
                variant="default"
                type="submit"
                className="w-full h-11 font-bold mt-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </FieldGroup>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                New here?{" "}
                <a
                  href="/sign-up"
                  className="text-foreground font-bold hover:text-primary transition-colors"
                >
                  Create an account
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <footer className="flex flex-col gap-4 px-4">
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-border/40" />
          <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            Protected by AES-256
          </span>
          <div className="h-[1px] flex-1 bg-border/40" />
        </div>

        <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed">
          <a href="/terms" className="hover:underline">
            Terms
          </a>
          <span className="mx-2">•</span>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
        </p>
      </footer>
    </div>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[10px] font-semibold text-destructive mt-1.5 flex items-center gap-1 animate-in slide-in-from-left-2">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}
