import { z } from "zod";

export const transferSchema = z.object({
  bank_id: z.number().min(1, "Please select a bank account."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0",
    ),
  note: z.string().optional().default(""),
  pin: z.string().length(6, "PIN must be exactly 6 digits."),
  otp_code: z.string().min(1, "OTP code is required."),
});

export type TransferFormData = z.infer<typeof transferSchema>;

export const bankTransferInitSchema = z.object({
  bank_id: z.number().min(1, "Please select a bank account."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0",
    ),
  note: z.string().optional(),
});

export type BankTransferInitData = z.infer<typeof bankTransferInitSchema>;

export const giftingSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0",
    ),
  note: z.string().optional().default(""),
  pin: z.string().length(6, "PIN must be exactly 6 digits."),
  otp_code: z.string().min(1, "OTP code is required."),
});

export type GiftingFormData = z.infer<typeof giftingSchema>;

export const ofundsTransferSchema = z.object({
  recipient_email: z.string().email("Please enter a valid email address."),
  recipient_id: z.number().optional(),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0",
    ),
  note: z.string().optional().default(""),
  pin: z.string().length(6, "PIN must be exactly 6 digits."),
  otp_code: z.string().min(1, "OTP code is required."),
});

export type OfundsTransferFormData = z.infer<typeof ofundsTransferSchema>;

export const transactionProcessSchema = z.object({
  hash: z.string().min(1, "Transaction hash is required."),
  pin: z.string().length(6, "PIN must be exactly 6 digits."),
});

export type TransactionProcessData = z.infer<typeof transactionProcessSchema>;

export const transactionVerifySchema = z.object({
  hash: z.string().min(1, "Transaction hash is required."),
  otp_code: z.string().min(1, "OTP code is required."),
});

export type TransactionVerifyData = z.infer<typeof transactionVerifySchema>;
