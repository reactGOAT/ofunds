"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Loader2, AlertCircle, Shield, QrCode } from "lucide-react";
import { useEnable2FA, useVerify2FASetup, useDisable2FA } from "@/hooks/useTwoFA";

const twoFAVerificationSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits."),
});

type TwoFAVerificationData = z.infer<typeof twoFAVerificationSchema>;

interface TwoFASetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TwoFASetupDialog({
  open,
  onOpenChange,
  onSuccess,
}: TwoFASetupDialogProps) {
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: enable2FA, isPending: isEnabling } = useEnable2FA();
  const { mutate: verifySetup, isPending: isVerifying } = useVerify2FASetup();
  const { mutate: disable2FA, isPending: isDisabling } = useDisable2FA();

  const form = useForm<TwoFAVerificationData>({
    resolver: zodResolver(twoFAVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleEnable2FA = () => {
    setError(null);
    enable2FA(undefined, {
      onSuccess: (data) => {
        if (data.status && data.data) {
          setQrCode(data.data.qr_code);
          setSecret(data.data.secret);
          setStep("verify");
        }
      },
      onError: (err) => {
        setError(err.message || "Failed to enable 2FA");
      },
    });
  };

  const handleVerify = (data: TwoFAVerificationData) => {
    setError(null);
    verifySetup(
      { code: data.code, secret },
      {
        onSuccess: () => {
          form.reset();
          setStep("setup");
          setQrCode("");
          setSecret("");
          setError(null);
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err) => {
          setError(err.message || "Invalid verification code");
        },
      }
    );
  };

  const handleClose = () => {
    if (step === "verify" && qrCode) {
      // If user cancels during verification, disable 2FA to clean up
      disable2FA();
    }
    form.reset();
    setStep("setup");
    setQrCode("");
    setSecret("");
    setError(null);
    onOpenChange(false);
  };

  const isLoading = isEnabling || isVerifying || isDisabling;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-border/50 dark:border-border/30">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {step === "setup" ? "Enable 2FA" : "Verify 2FA Setup"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "setup" 
              ? "Add an extra layer of security to your account with two-factor authentication."
              : "Scan the QR code with your authenticator app and enter the verification code."
            }
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 dark:border-destructive/30">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {step === "setup" ? (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Set up 2FA Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  We'll generate a QR code for you to scan with your authenticator app
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleEnable2FA}
              disabled={isEnabling}
              className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80"
            >
              {isEnabling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating QR Code...
                </>
              ) : (
                "Generate QR Code"
              )}
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-4">
            {qrCode && (
              <div className="text-center space-y-4">
                <div className="mx-auto w-48 h-48 bg-white p-2 rounded-lg border">
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="2FA QR Code"
                    className="w-full h-full"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Or manually enter this secret: <code className="bg-muted px-1 py-0.5 rounded">{secret}</code>
                  </p>
                </div>
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel className="text-foreground">Verification Code</FieldLabel>
                <Input
                  placeholder="000000"
                  maxLength={6}
                  {...form.register("code")}
                  className="border-input dark:border-input/50 bg-background dark:bg-background/50 text-foreground text-center text-lg tracking-widest"
                />
                <FieldDescription className="text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </FieldDescription>
                {form.formState.errors.code && (
                  <FieldError className="text-destructive">
                    {form.formState.errors.code.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-border/50 dark:border-border/50"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80"
                disabled={isLoading}
              >
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Enable
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
