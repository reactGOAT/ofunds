import { z } from "zod";

export const addBankSchema = z.object({
  account_name: z
    .string()
    .min(3, "Account name must be at least 3 characters."),
  account_number: z
    .string()
    .min(10, "Account number must be at least 10 digits.")
    .max(10, "Account number must be 10 digits."),
  bank_code: z.string().min(1, "Please select a bank."),
  bank_name: z.string().min(1, "Bank name is required."),
});

export type AddBankFormData = z.infer<typeof addBankSchema>;

export const verifyBankSchema = z.object({
  account_number: z
    .string()
    .min(10, "Account number must be at least 10 digits.")
    .max(10, "Account number must be 10 digits."),
  bank_code: z.string().min(1, "Please select a bank."),
});

export type VerifyBankFormData = z.infer<typeof verifyBankSchema>;
