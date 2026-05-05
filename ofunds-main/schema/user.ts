import { z } from "zod";

export const userSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters."),
  lastname: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
});

export type UpdateUserFormData = z.infer<typeof userSchema>;

export const updateEmailSchema = z.object({
  new_email: z.string().email("Please enter a valid email address."),
});

export type UpdateEmailFormData = z.infer<typeof updateEmailSchema>;

export const updatePinSchema = z
  .object({
    pin: z.string().length(6, "PIN must be exactly 6 digits."),
    pin_confirmation: z
      .string()
      .length(6, "PIN confirmation must be exactly 6 digits."),
  })
  .refine((data) => data.pin === data.pin_confirmation, {
    message: "PINs don't match",
    path: ["pin_confirmation"],
  });

export type UpdatePinFormData = z.infer<typeof updatePinSchema>;
