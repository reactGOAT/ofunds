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
