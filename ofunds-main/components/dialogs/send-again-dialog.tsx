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
import { Loader2, AlertCircle, ArrowRight, Trash2, Lock } from "lucide-react";
import { useSendAgain } from "@/hooks/useSendAgain";
import {
  useVerifyTransfer,
  useVerifyGifting,
  useVerifyOfundsTransfer,
  useInitTransfer,
  useProcessTransfer,
  useInitGifting,
  useProcessGifting,
  useInitOfundsTransfer,
  useProcessOfundsTransfer,
} from "@/hooks/useTransactions";
import { useJetsendUserStore } from "@/store/jetsend-user-store";

const transactionVerifySchema = z.object({
  hash: z.string().min(1, "Transaction hash is required."),
  otp_code: z.string().min(1, "OTP code is required."),
});

type TransactionVerifyData = z.infer<typeof transactionVerifySchema>;

interface SendAgainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = "select" | "pin" | "otp";

export function SendAgainDialog({
  open,
  onOpenChange,
  onSuccess,
}: SendAgainDialogProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(
    null,
  );
  const [step, setStep] = useState<Step>("select");
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const { recipients, removeRecipient } = useSendAgain();
  const { balance } = useJetsendUserStore();

  const form = useForm<TransactionVerifyData>({
    resolver: zodResolver(transactionVerifySchema),
    defaultValues: {
      hash: "",
      otp_code: "",
    },
  });

  const selectedRecipient = recipients.find(
    (r) => r.id === selectedRecipientId,
  );

  // Transfer hooks
  const { mutate: initTransfer, isPending: isInitTransfer } = useInitTransfer();
  const { mutate: processTransfer, isPending: isProcessTransfer } =
    useProcessTransfer();
  const { mutate: verifyTransfer, isPending: isVerifyTransfer } =
    useVerifyTransfer();

  // Gifting hooks
  const { mutate: initGifting, isPending: isInitGifting } = useInitGifting();
  const { mutate: processGifting, isPending: isProcessGifting } =
    useProcessGifting();
  const { mutate: verifyGifting, isPending: isVerifyGifting } =
    useVerifyGifting();

  // Ofunds hooks
  const { mutate: initOfunds, isPending: isInitOfunds } =
    useInitOfundsTransfer();
  const { mutate: processOfunds, isPending: isProcessOfunds } =
    useProcessOfundsTransfer();
  const { mutate: verifyOfunds, isPending: isVerifyOfunds } =
    useVerifyOfundsTransfer();

  const handleFinalSuccess = () => {
    form.reset();
    setSelectedRecipientId(null);
    setStep("select");
    setTransactionHash(null);
    setError(null);
    setPin("");
    onOpenChange(false);
    onSuccess?.();
  };

  const isLoading =
    isInitTransfer ||
    isProcessTransfer ||
    isVerifyTransfer ||
    isInitGifting ||
    isProcessGifting ||
    isVerifyGifting ||
    isInitOfunds ||
    isProcessOfunds ||
    isVerifyOfunds;

  const handleSelectRecipient = (recipientId: string) => {
    const recipient = recipients.find((r) => r.id === recipientId);
    if (!recipient) return;

    setSelectedRecipientId(recipientId);
    setError(null);

    // Initial step: Initiate transaction based on type
    if (recipient.type === "bank") {
      initTransfer(
        {
          bank_id: parseInt(recipient.bankId || "0", 10),
          amount: recipient.lastAmount.toString(),
          note: "Quick send",
        },
        {
          onSuccess: (data: any) => {
            setTransactionHash(data.hash);
            setStep("pin");
          },
          onError: (err: any) =>
            setError(err.message || "Failed to initiate transfer"),
        },
      );
    } else if (recipient.type === "gifting") {
      initGifting(
        {
          email: recipient.email!,
          amount: recipient.lastAmount.toString(),
          note: "Quick send",
        },
        {
          onSuccess: (data: any) => {
            setTransactionHash(data.hash);
            setStep("pin");
          },
          onError: (err: any) =>
            setError(err.message || "Failed to initiate transfer"),
        },
      );
    } else if (recipient.type === "ofunds") {
      if (!recipient.recipientId) {
        setError("Missing recipient ID for Ofunds transfer.");
        return;
      }
      initOfunds(
        {
          recipient_id: recipient.recipientId,
          amount: recipient.lastAmount.toString(),
          note: "Quick send",
        },
        {
          onSuccess: (data: any) => {
            setTransactionHash(data.hash);
            setStep("pin");
          },
          onError: (err: any) =>
            setError(err.message || "Failed to initiate transfer"),
        },
      );
    }
  };

  const handlePinSubmit = () => {
    if (!selectedRecipient || !transactionHash || !pin) return;
    setError(null);

    const payload = { hash: transactionHash, pin };

    if (selectedRecipient.type === "bank") {
      processTransfer(payload, {
        onSuccess: () => setStep("otp"),
        onError: (err: any) =>
          setError(err.message || "Failed to process transfer"),
      });
    } else if (selectedRecipient.type === "gifting") {
      processGifting(payload, {
        onSuccess: () => setStep("otp"),
        onError: (err: any) =>
          setError(err.message || "Failed to process transfer"),
      });
    } else if (selectedRecipient.type === "ofunds") {
      processOfunds(payload, {
        onSuccess: () => setStep("otp"),
        onError: (err: any) =>
          setError(err.message || "Failed to process transfer"),
      });
    }
  };

  const onSubmit = (data: TransactionVerifyData) => {
    if (!selectedRecipient || !transactionHash) return;
    setError(null);

    const payload = { hash: transactionHash, otp_code: data.otp_code };

    if (selectedRecipient.type === "bank") {
      verifyTransfer(payload, {
        onSuccess: () => handleFinalSuccess(),
        onError: (err: any) =>
          setError(err.message || "Failed to verify transfer"),
      });
    } else if (selectedRecipient.type === "gifting") {
      verifyGifting(payload, {
        onSuccess: () => handleFinalSuccess(),
        onError: (err: any) =>
          setError(err.message || "Failed to verify transfer"),
      });
    } else if (selectedRecipient.type === "ofunds") {
      verifyOfunds(payload, {
        onSuccess: () => handleFinalSuccess(),
        onError: (err: any) =>
          setError(err.message || "Failed to verify transfer"),
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setSelectedRecipientId(null);
      setStep("select");
      setTransactionHash(null);
      setError(null);
      setPin("");
    }
    onOpenChange(newOpen);
  };

  const handleDelete = (recipientId: string) => {
    removeRecipient(recipientId);
    if (selectedRecipientId === recipientId) {
      setSelectedRecipientId(null);
      setStep("select");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border/50 dark:border-border/30">
        <DialogHeader>
          <DialogTitle className="text-foreground">Send Again</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "select" && "Quick send to recent recipients"}
            {step === "pin" && "Enter your security PIN"}
            {step === "otp" && "Verify with OTP"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 dark:border-destructive/30">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {step === "select" ? (
          <div className="space-y-4">
            {recipients.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No recent recipients yet
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 dark:border-border/30 hover:bg-accent/50 dark:hover:bg-accent/20 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {recipient.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {recipient.email || recipient.phone}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last: ₦{recipient.lastAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        disabled={isLoading}
                        onClick={() => handleSelectRecipient(recipient.id)}
                        className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 h-8"
                      >
                        {isLoading && selectedRecipientId === recipient.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(recipient.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 dark:hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="flex-1 border-border/50 dark:border-border/50"
              >
                Close
              </Button>
            </div>
          </div>
        ) : step === "pin" ? (
          <div className="space-y-4">
            {selectedRecipient && (
              <div className="p-3 rounded-lg bg-accent/30 dark:bg-accent/10 border border-accent/50 dark:border-accent/30">
                <p className="text-xs text-muted-foreground">Recipient</p>
                <p className="font-medium text-foreground">
                  {selectedRecipient.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  ₦{selectedRecipient.lastAmount.toLocaleString()}
                </p>
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel className="text-foreground">
                  Security PIN
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="••••••"
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pl-10 border-input dark:border-input/50 bg-background dark:bg-background/50 text-foreground"
                  />
                </div>
                <FieldDescription className="text-muted-foreground">
                  Enter your 6-digit PIN
                </FieldDescription>
              </Field>
            </FieldGroup>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("select")}
                className="flex-1 border-border/50 dark:border-border/50"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handlePinSubmit}
                className="flex-1 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80"
                disabled={isLoading || pin.length < 4}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify PIN
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {selectedRecipient && (
              <div className="p-3 rounded-lg bg-accent/30 dark:bg-accent/10 border border-accent/50 dark:border-accent/30">
                <p className="text-xs text-muted-foreground">Recipient</p>
                <p className="font-medium text-foreground">
                  {selectedRecipient.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  ₦{selectedRecipient.lastAmount.toLocaleString()}
                </p>
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel className="text-foreground">OTP Code</FieldLabel>
                <Input
                  placeholder="000000"
                  maxLength={6}
                  {...form.register("otp_code")}
                  className="border-input dark:border-input/50 bg-background dark:bg-background/50 text-foreground text-center text-lg tracking-widest"
                />
                <FieldDescription className="text-muted-foreground">
                  Check your email for the 6-digit code
                </FieldDescription>
                {form.formState.errors.otp_code && (
                  <FieldError className="text-destructive">
                    {form.formState.errors.otp_code.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("pin")}
                className="flex-1 border-border/50 dark:border-border/50"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
