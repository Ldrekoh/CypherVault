import * as z from "zod";

export const vaultSchemaValidation = z
  .object({
    passphrase: z.string().min(12, {
      message:
        "Passphrase must be at least 12 characters long for better security",
    }),
    confirmPassphrase: z.string().min(12, {
      message:
        "Confirm Passphrase must be at least 12 characters long for better security",
    }),
  })
  .refine((data) => data.passphrase === data.confirmPassphrase, {
    message: "Passphrases do not match",
    path: ["confirmPassphrase"],
  });

export type VaultData = z.infer<typeof vaultSchemaValidation>;
