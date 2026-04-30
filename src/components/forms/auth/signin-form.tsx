'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { signinSchemaValidation } from '@/validations/auth-schema-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signInAction } from '@/server/auth/auth-action';
import z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SignInForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchemaValidation>>({
    resolver: zodResolver(signinSchemaValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchemaValidation>) => {
    setIsLoading(true);
    try {
      const { success, message } = await signInAction(data.email, data.password);

      if (success) {
        toast.success(message as string);
        router.push('/dashboard');
      } else {
        toast.error(message as string);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      toast.error(`An unexpected error occurred ${error instanceof Error ? error.message : ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign in to your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your details below to sign in to your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register('email')}
                />
                {form.formState.errors.email ? (
                  <p className="text-xs font-medium text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                ) : (
                  <FieldDescription>
                    We&apos;ll never share your email with anyone else.
                  </FieldDescription>
                )}
              </Field>

              {/* CHAMPS : PASSWORDS */}
              <div className="grid p-0 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" {...form.register('password')} />
                  {form.formState.errors.password && (
                    <p className="text-xs font-medium text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </Field>
              </div>

              <Button variant="default" type="submit" className="w-full" disabled={isloading}>
                {isloading ? 'Signing In...' : 'Sign In'}
              </Button>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <a href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/assets/images/signup-image.jpg"
              alt="Signup Image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{' '}
        <a href="/terms" className="underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
