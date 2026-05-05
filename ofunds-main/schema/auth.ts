import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters."),
    lastname: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    passwordConfirm: z.string().min(8, "Password confirmation is required."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const pinLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  security_pin: z.string().length(6, "PIN must be exactly 6 digits."),
});

export type PinLoginFormData = z.infer<typeof pinLoginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    verify_code: z.string().min(1, "Verification code is required."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    passwordConfirm: z.string().min(8, "Password confirmation is required."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Password confirmation is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  verify_code: z.string().min(1, "OTP code is required."),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
