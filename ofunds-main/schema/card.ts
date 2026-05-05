import { z } from "zod";

export const requestCardSchema = z.object({
  card_type: z.enum(["sudo", "ofunds"], {
    message: "Please select a card type.",
  }),
});

export type RequestCardFormData = z.infer<typeof requestCardSchema>;

export const cardActivationSchema = z.object({
  card_id: z.number().min(1, "Card ID is required."),
});

export type CardActivationData = z.infer<typeof cardActivationSchema>;

// ATM Card Request Schema
export const requestAtmCardSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9+]+$/, "Phone number must contain only digits"),
  state: z
    .string()
    .min(2, "State is required")
    .max(50, "State name is too long"),
  lga: z
    .string()
    .min(2, "LGA is required")
    .max(100, "LGA name is too long"),
  street: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address is too long"),
});

export type RequestAtmCardFormData = z.infer<typeof requestAtmCardSchema>;
