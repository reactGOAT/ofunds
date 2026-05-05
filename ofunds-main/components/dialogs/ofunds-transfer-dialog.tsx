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
import { Loader2, AlertCircle, Search } from "lucide-react";
import {
  useInitOfundsTransfer,
  useProcessOfundsTransfer,
  useVerifyOfundsTransfer,
} from "@/hooks/useTransactions";
import { useSendAgain } from "@/hooks/useSendAgain";

const ofundsTransferSchema = z.object({
  recipient_email: z.string().email("Please enter a valid email address."),
  recipient_id: z.number().optional(),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0",
    ),
  note: z.string().optional(),
  pin: z.string().length(6, "PIN must be exactly 6 digits."),
  otp_code: z.string().min(1, "OTP code is required."),
});

type OfundsTransferFormData = z.infer<typeof ofundsTransferSchema>;

interface OfundsTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = "select" | "process" | "verify";

export function OfundsTransferDialog({
  open,
  onOpenChange,
  onSuccess,
}: OfundsTransferDialogProps) {
  const [step, setStep] = useState<Step>("select");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { addOfundsRecipient } = useSendAgain();

  const form = useForm<OfundsTransferFormData>({
    resolver: zodResolver(ofundsTransferSchema),
    defaultValues: {
      recipient_email: "",
      recipient_id: undefined,
      amount: "",
      note: undefined,
      pin: "",
      otp_code: "",
    },
  });

  const { mutate: initOfunds, isPending: isInitializing } =
    useInitOfundsTransfer();

  const { mutate: processOfunds, isPending: isProcessing } =
    useProcessOfundsTransfer();

  const { mutate: verifyOfunds, isPending: isVerifying } =
    useVerifyOfundsTransfer();

  const onSubmit = (data: OfundsTransferFormData) => {
    setError(null);

    if (step === "select") {
      if (!data.recipient_id) {
        setError("Please select a recipient from the search results.");
        return;
      }
      initOfunds(
        {
          recipient_id: data.recipient_id,
          amount: data.amount,
          note: data.note || "",
        },
        {
          onSuccess: (response: any) => {
            setTransactionHash(response?.hash || null);
            setStep("process");
            setError(null);
          },
          onError: (err: any) => {
            setError(err.message || "Failed to initiate transfer");
          },
        },
      );
    } else if (step === "process" && transactionHash) {
      processOfunds(
        {
          hash: transactionHash,
          pin: data.pin,
        },
        {
          onSuccess: () => {
            setStep("verify");
            setError(null);
          },
          onError: (err: any) => {
            setError(err.message || "Failed to process transfer");
          },
        },
      );
    } else if (step === "verify" && transactionHash) {
      verifyOfunds(
        {
          hash: transactionHash,
          otp_code: data.otp_code,
        },
        {
          onSuccess: () => {
            addOfundsRecipient({
              name: form.getValues("recipient_email"),
              email: form.getValues("recipient_email"),
              amount: parseFloat(form.getValues("amount")),
              recipientId: form.getValues("recipient_id")!,
            });
            form.reset();
            setStep("select");
            setTransactionHash(null);
            setError(null);
            onOpenChange(false);
            onSuccess?.();
          },
          onError: (err: any) => {
            setError(err.message || "Failed to verify transfer");
          },
        },
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setStep("select");
      setTransactionHash(null);
      setError(null);
      setSearchEmail("");
      setSearchResults([]);
    }
    onOpenChange(newOpen);
  };

  const isLoading = isInitializing || isProcessing || isVerifying;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border/50 dark:border-border/30">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Transfer via Ofunds
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "select" && "Send money to any Ofunds user"}
            {step === "process" && "Enter your security PIN"}
            {step === "verify" && "Enter the OTP code from your email"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 dark:border-destructive/30">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {step === "select" && (
            <FieldGroup>
              <Field>
                <FieldLabel className="text-foreground">
                  Recipient Email
                </FieldLabel>
                <div className="relative">
                  <Input
                    placeholder="Enter recipient email"
                    type="email"
                    {...form.register("recipient_email", {
                      onChange: (e) => setSearchEmail(e.target.value),
                    })}
                    className="border-input dark:border-input/50 bg-background dark:bg-background/50 text-foreground pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {searchEmail.length > 2 && searchResults.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-[120px] overflow-y-auto">
                    {searchResults.map((user: any) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          form.setValue("recipient_email", user.email);
                          form.setValue("recipient_id", user.id);
                          setSearchEmail("");
                          setSearchResults([]);
                        }}
                        className="w-full text-left p-2 rounded-md hover:bg-accent text-sm text-foreground transition-colors"
                      >
                        {user.firstname} {user.lastname} ({user.email})
                      </button>
                    ))}
                  </div>
                )}
                {form.formState.errors.recipient_email && (
                  <FieldError className="text-destructive">
                    {form.formState.errors.recipient_email.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-foreground">Amount (₦)</FieldLabel>
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  {...form.register("amount")}
                  className="border-input dark:border-input/50 bg-background dark:bg-background/50 text-foreground"
                />
                {form.formState.errors.amount && (
                  <FieldError className="text-destructive">
                    {form.formState.errors.amount.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-foreground">
                  Note (Optional)
                </FieldLabel>
                <Input
                  placeholder="Add a note..."
                  {...form.register("note")}
                  className="border-input dark:border-input/50 bg-background dark:bg-background/50 text-foreground"
                />
                <FieldDescription className="text-muted-foreground">
                  Message for the recipient
                </FieldDescription>
              </Field>
            </FieldGroup>
          )}

          {step === "process" && (
            <FieldGroup>
              <Field>
                <FieldLabel className="text-foreground">
                  Security PIN
                </FieldLabel>
                <Input
                  placeholder="••••••"
                  type="password"
                  maxLength={6}
                  {...form.register("pin")}
                  className="border-input dark:border-input/50 bg-background dark:bg-background/50 text-foreground"
                />
                <FieldDescription className="text-muted-foreground">
                  Enter your 6-digit PIN
                </FieldDescription>
                {form.formState.errors.pin && (
                  <FieldError className="text-destructive">
                    {form.formState.errors.pin.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          )}

          {step === "verify" && (
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
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === "select" && "Continue"}
              {step === "process" && "Verify PIN"}
              {step === "verify" && "Complete Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
