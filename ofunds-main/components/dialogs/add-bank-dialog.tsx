"use client";

import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Loader2, AlertCircle, Building2, User, CreditCard } from "lucide-react";
import { useGetAllBanks, useAddBank, useVerifyBankAccount } from "@/hooks/useBanks";
import { useGetUserBanks } from "@/hooks/useBanks";

const addBankSchema = z.object({
  bank_code: z.string().min(1, "Please select a bank."),
  account_number: z.string().min(10, "Account number must be at least 10 digits."),
});

type AddBankData = z.infer<typeof addBankSchema>;

interface AddBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onDirectTransfer?: (bankData: AddBankData) => void;
}

export function AddBankDialog({
  open,
  onOpenChange,
  onSuccess,
  onDirectTransfer,
}: AddBankDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedBankName, setSelectedBankName] = useState<string>("");
  const [verifiedAccountName, setVerifiedAccountName] = useState<string>("");

  const { data: banksData, isLoading: banksLoading } = useGetAllBanks();
  const banks = banksData || [];
  
  const { mutate: addBank, isPending: addLoading } = useAddBank();
  const { refetch: refetchUserBanks } = useGetUserBanks();

  const form = useForm<AddBankData>({
    resolver: zodResolver(addBankSchema),
    defaultValues: {
      bank_code: "",
      account_number: "",
    },
  });

  // Bank account verification
  const bankCode = form.watch("bank_code");
  const accountNumber = form.watch("account_number");
  
  const { data: verificationData, isLoading: verificationLoading } = useVerifyBankAccount(
    accountNumber,
    bankCode,
    !!bankCode && !!accountNumber && accountNumber.length >= 10
  );

  // Auto-fill verified account name
  useEffect(() => {
    if (verificationData && typeof verificationData === 'object' && 'status' in verificationData) {
      const verificationResult = verificationData as any;
      if (verificationResult.status && verificationResult.data?.account_name) {
        setVerifiedAccountName(verificationResult.data.account_name);
        setError(null);
      } else if (verificationResult.status === false) {
        setVerifiedAccountName("");
        setError("Account verification failed. Please check the account number.");
      }
    }
  }, [verificationData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.watch("bank_code") || !form.watch("account_number").trim()) {
      setError("Please select a bank and enter account number");
      return;
    }

    if (!verifiedAccountName) {
      setError("Please wait for account verification or check the account number");
      return;
    }

    addBank(
      {
        account_number: form.watch("account_number").trim(),
        bank_code: form.watch("bank_code"),
        bank_name: selectedBankName,
        account_name: verifiedAccountName,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);
          form.reset();
          setVerifiedAccountName("");
        },
        onError: (err: any) => {
          setError(err instanceof Error ? err.message : "Failed to add bank");
        },
      }
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setError(null);
    setVerifiedAccountName("");
  };

  const handleBankSelect = (bankCode: string) => {
    const bank = banks.find((b) => b.code === bankCode);
    setSelectedBankName(bank?.name || "");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {onDirectTransfer ? "Direct Transfer" : "Add Bank Account"}
          </DialogTitle>
          <DialogDescription>
            {onDirectTransfer 
              ? "Enter bank details for a one-time transfer"
              : "Add a new bank account to your profile"
            }
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bank_code" className="font-bold text-xs">
                Select Bank
              </FieldLabel>
              <Select
                value={form.watch("bank_code")}
                onValueChange={(value) => {
                  form.setValue("bank_code", value);
                  handleBankSelect(value);
                }}
              >
                <SelectTrigger className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 text-foreground text-sm">
                  <SelectValue placeholder="Choose a bank..." />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.bank_code && (
                <FieldError>
                  {form.formState.errors.bank_code.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="account_number" className="font-bold text-xs">
                Account Number
              </FieldLabel>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                <Input
                  id="account_number"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter account number"
                  className="pl-11 pr-10 h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                  {...form.register("account_number")}
                  disabled={!bankCode}
                />
                {verificationLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {!bankCode && (
                <p className="text-xs text-muted-foreground mt-1">
                  Please select a bank first
                </p>
              )}
              {form.formState.errors.account_number && (
                <FieldError>
                  {form.formState.errors.account_number.message}
                </FieldError>
              )}
            </Field>

            {verifiedAccountName && (
              <Field>
                <FieldLabel className="font-bold text-xs">
                  Account Name
                </FieldLabel>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  <Input
                    type="text"
                    value={verifiedAccountName}
                    readOnly
                    className="pl-11 h-12 bg-green-50 border-green-200 text-green-800 rounded-xl"
                  />
                </div>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Account verified successfully
                </p>
              </Field>
            )}

            {verificationLoading && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <p className="text-sm text-blue-800">
                  Verifying account number...
                </p>
              </div>
            )}
          </FieldGroup>

          <Button
            type="submit"
            disabled={addLoading || banksLoading}
            className="w-full h-11 rounded-xl font-bold"
          >
            {addLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {onDirectTransfer ? "Continue to Transfer" : "Add Bank Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
