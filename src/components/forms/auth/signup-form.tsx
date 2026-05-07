"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signUpAction } from "@/server/auth/auth-action";
import { signupSchemaValidation } from "@/validations/auth-schema-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchemaValidation>>({
    resolver: zodResolver(signupSchemaValidation),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchemaValidation>) => {
    setIsLoading(true);
    try {
      const { success, message } = await signUpAction(
        data.name,
        data.email,
        data.password,
      );

      if (success) {
        toast.success(message as string, {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });
        form.reset();
        router.push("/dashboard");
      } else {
        toast.error(message as string);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full max-w-[500px] mx-auto",
        className,
      )}
      {...props}
    >
      {/* Badge de confiance discret - Très 2026 */}
      <div className="flex justify-center animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary uppercase tracking-tighter">
          <ShieldCheck className="w-3 h-3" />
          Bank-grade security enabled
        </div>
      </div>

      <Card className="relative overflow-hidden border border-border/50 shadow-2xl bg-gradient-to-b from-background to-background/80 backdrop-blur-2xl">
        {/* Décoration subtile en arrière-plan */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

        <CardContent className="p-8 lg:p-10">
          <form
            className="flex flex-col space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create account
              </h1>
              <p className="text-sm text-muted-foreground">
                Join our platform to start managing your assets.
              </p>
            </div>

            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  Full Name
                </FieldLabel>
                <div className="relative group">
                  <Input
                    placeholder="John Doe"
                    className={cn(
                      "h-12 bg-muted/30 border-muted-foreground/20 transition-all focus:bg-background",
                      form.formState.errors.name &&
                        "border-destructive/50 focus-visible:ring-destructive/20",
                    )}
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <AlertCircle className="absolute right-3 top-3.5 h-5 w-5 text-destructive animate-in zoom-in" />
                  )}
                </div>
                <ErrorMessage message={form.formState.errors.name?.message} />
              </Field>

              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  Email Address
                </FieldLabel>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="h-12 bg-muted/30 border-muted-foreground/20 transition-all focus:bg-background"
                  {...form.register("email")}
                />
                <ErrorMessage message={form.formState.errors.email?.message} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    Password
                  </FieldLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-muted/30 border-muted-foreground/20 transition-all focus:bg-background"
                    {...form.register("password")}
                  />
                  <ErrorMessage
                    message={form.formState.errors.password?.message}
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    Confirm
                  </FieldLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-muted/30 border-muted-foreground/20 transition-all focus:bg-background"
                    {...form.register("confirmPassword")}
                  />
                  <ErrorMessage
                    message={form.formState.errors.confirmPassword?.message}
                  />
                </Field>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </FieldGroup>

            <div className="pt-2 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/sign-in"
                  className="text-foreground font-semibold hover:underline underline-offset-4 transition-colors"
                >
                  Log in
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <footer className="text-center space-y-4">
        <p className="px-8 text-[11px] text-muted-foreground/60 leading-relaxed italic">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="hover:text-primary underline transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="hover:text-primary underline transition-colors"
          >
            Privacy
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[10px] font-semibold text-destructive mt-1.5 flex items-center gap-1 animate-in slide-in-from-left-2 duration-300">
      <span className="w-1 h-1 rounded-full bg-destructive" />
      {message}
    </p>
  );
}
