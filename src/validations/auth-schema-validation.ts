import * as z from 'zod';

export const signupSchemaValidation = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters long' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export const signinSchemaValidation = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export type SignupData = z.infer<typeof signupSchemaValidation>;
export type SigninData = z.infer<typeof signinSchemaValidation>;
