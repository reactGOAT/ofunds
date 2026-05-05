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
import { Loader2, AlertCircle, Lock, FileText } from "lucide-react";
import { useGetUserBanks, useGetAllBanks, useAddBank } from "@/hooks/useBanks";
import { UserBank, WithdrawalBank } from "@/services/banks";
import {
  useInitTransfer,
  useProcessTransfer,
  useVerifyTransfer,
} from "@/hooks/useTransactions";
import { useSendAgain } from "@/hooks/useSendAgain";
import { useJetsendUserStore } from "@/store/jetsend-user-store";
import {
  bankTransferInitSchema,
  transactionProcessSchema,
  transactionVerifySchema,
  type BankTransferInitData,
  type TransactionProcessData,
  type TransactionVerifyData,
} from "@/schema/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BankTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  directBankData?: {
    bank_code: string;
    account_number: string;
    account_name: string;
  };
  preSelectedBankId?: number;
}

type Step = "amount" | "pin" | "otp";
type TransferMode = "saved" | "direct";

export function BankTransferDialog({
  open,
  onOpenChange,
  onSuccess,
  directBankData,
  preSelectedBankId,
}: BankTransferDialogProps) {
  const [step, setStep] = useState<Step>("amount");
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferMode, setTransferMode] = useState<TransferMode>(
    directBankData ? "direct" : "saved"
  );
  const [directBankDetails, setDirectBankDetails] = useState<{
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
  } | null>(null);
  
  const { data: userBanksData, isLoading: userBanksLoading, refetch: refetchUserBanks } = useGetUserBanks();
  const { data: allBanksData, isLoading: allBanksLoading } = useGetAllBanks();
  
  const userBanks: UserBank[] = userBanksData?.data?.data || [];
  const allBanks: WithdrawalBank[] = allBanksData || [];
  
  const banksLoading = transferMode === "saved" ? userBanksLoading : allBanksLoading;
  const { mutate: initTransfer, isPending: initLoading } = useInitTransfer();
  const { mutate: processTransfer, isPending: processLoading } =
    useProcessTransfer();
  const { mutate: verifyTransfer, isPending: verifyLoading } =
    useVerifyTransfer();
  const { addTransferRecipient } = useSendAgain();
  const { balance } = useJetsendUserStore();

  const amountForm = useForm<BankTransferInitData>({
    resolver: zodResolver(bankTransferInitSchema),
    defaultValues: { 
      bank_id: transferMode === "direct" ? undefined : 0, 
      amount: "", 
      note: undefined 
    },
  });

  // Update form default values when transfer mode changes
  useEffect(() => {
    amountForm.setValue("bank_id", transferMode === "direct" ? 0 : 0);
  }, [transferMode, amountForm]);

  // Update form when pre-selected bank changes
  useEffect(() => {
    if (preSelectedBankId) {
      amountForm.setValue("bank_id", preSelectedBankId);
      setTransferMode("saved");
    }
  }, [preSelectedBankId, amountForm]);

  const { mutate: addBankForVerification, isPending: verificationLoading } = useAddBank();

  // Auto-add bank and get account name when account number is entered
  useEffect(() => {
    if (transferMode === "direct" && directBankDetails?.bank_code && directBankDetails?.account_number && directBankDetails.account_number.length >= 10) {
      addBankForVerification(
        {
          bank_code: directBankDetails.bank_code,
          bank_name: directBankDetails.bank_name,
          account_number: directBankDetails.account_number,
        },
        {
          onSuccess: (response) => {
            if (response.status && response.data?.data) {
              // Find the newly added bank in the response
              const newBank = response.data.data.find((bank: UserBank) => 
                bank.account_number === directBankDetails.account_number && 
                bank.bank_code === directBankDetails.bank_code
              );
              if (newBank) {
                setDirectBankDetails(prev => prev ? {
                  ...prev,
                  account_name: newBank.account_name
                } : null);
                setError(null);
                // Refresh user banks to get the latest list
                refetchUserBanks();
              }
            }
          },
          onError: (err: any) => {
            setDirectBankDetails(prev => prev ? {
              ...prev,
              account_name: ""
            } : null);
            setError(err instanceof Error ? err.message : "Account verification failed. Please check the account number.");
          }
        }
      );
    }
  }, [directBankDetails?.bank_code, directBankDetails?.account_number, transferMode, addBankForVerification, refetchUserBanks]);

  const pinForm = useForm<TransactionProcessData>({
    resolver: zodResolver(transactionProcessSchema),
    defaultValues: { hash: "", pin: "" },
  });

  const otpForm = useForm<TransactionVerifyData>({
    resolver: zodResolver(transactionVerifySchema),
    defaultValues: { hash: "", otp_code: "" },
  });

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const amount = amountForm.getValues("amount");
    const note = amountForm.getValues("note");
    
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    setTransferAmount(amount);

    // For direct transfers, validate account details first
    if (transferMode === "direct") {
      if (!directBankDetails?.account_number || !directBankDetails?.account_name) {
        setError("Please enter and verify account number for direct transfer");
        return;
      }
      
      // For direct transfers, the bank was already added during verification
      // Find the newly added bank in userBanks
      const newlyAddedBank = userBanks.find((bank) => 
        bank.account_number === directBankDetails.account_number && 
        bank.bank_code === directBankDetails.bank_code
      );
      
      if (newlyAddedBank) {
        setSelectedBankId(newlyAddedBank.id);
      } else {
        // If bank not found, refresh user banks and try again
        refetchUserBanks().then(() => {
          const refreshedBank = userBanks.find((bank) => 
            bank.account_number === directBankDetails.account_number && 
            bank.bank_code === directBankDetails.bank_code
          );
          if (refreshedBank) {
            setSelectedBankId(refreshedBank.id);
            // Retry transfer initiation
            const transferData = {
              bank_id: refreshedBank.id,
              amount: amount,
              note: note || "",
            };
            initTransfer(transferData, {
              onSuccess: (response) => {
                setTransactionHash(response.hash);
                setStep("pin");
              },
              onError: (err) => {
                setError(
                  err instanceof Error ? err.message : "Failed to initiate transfer",
                );
              },
            });
          } else {
            setError("Bank not found after adding. Please try again.");
          }
        });
        return;
      }
    } else {
      const bankId = amountForm.getValues("bank_id");
      if (!bankId || bankId <= 0) {
        setError("Please select a bank account");
        return;
      }
      setSelectedBankId(bankId);
    }

    const transferData = {
      bank_id: transferMode === "direct" ? (userBanks.find((bank) => 
        bank.account_number === directBankDetails?.account_number && 
        bank.bank_code === directBankDetails?.bank_code
      )?.id || 0) : amountForm.getValues("bank_id"),
      amount: amount,
      note: note || "",
    };

    initTransfer(transferData, {
      onSuccess: (response) => {
        setTransactionHash(response.hash);
        setStep("pin");
      },
      onError: (err) => {
        setError(
          err instanceof Error ? err.message : "Failed to initiate transfer",
        );
      },
    });
  };

  const handlePinSubmit = pinForm.handleSubmit((data) => {
    if (!transactionHash) return;
    setError(null);

    processTransfer(
      { ...data, hash: transactionHash },
      {
        onSuccess: () => {
          setStep("otp");
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err.message : "Failed to process transfer",
          );
        },
      },
    );
  });

  const handleOtpSubmit = otpForm.handleSubmit((data) => {
    if (!transactionHash) return;
    setError(null);

    verifyTransfer(
      { ...data, hash: transactionHash },
      {
        onSuccess: () => {
          if (transferMode === "saved") {
            const selectedBank = userBanks.find((b) => b.id === selectedBankId);
            if (selectedBank) {
              addTransferRecipient({
                name: selectedBank.bank_name,
                amount: parseFloat(transferAmount),
                bankId: selectedBank.id.toString(),
                accountNumber: selectedBank.account_number,
                accountName: selectedBank.account_name,
                bankName: selectedBank.bank_name,
              });
            }
          } else if (transferMode === "direct" && directBankDetails) {
            // For direct transfers, add to send again with direct bank details
            addTransferRecipient({
              name: directBankDetails.bank_name,
              amount: parseFloat(transferAmount),
              bankId: directBankDetails.bank_code,
              accountNumber: directBankDetails.account_number,
              accountName: directBankDetails.account_name,
              bankName: directBankDetails.bank_name,
            });
          }
          onOpenChange(false);
          onSuccess?.();
          resetForm();
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err.message : "Failed to verify transfer",
          );
        },
      },
    );
  });

  const resetForm = () => {
    setStep("amount");
    setTransactionHash(null);
    setSelectedBankId(null);
    setTransferAmount("");
    amountForm.reset();
    pinForm.reset();
    otpForm.reset();
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Transfer to Bank
          </DialogTitle>
          <DialogDescription>
            {step === "amount" && "Select a saved bank account and enter the amount"}
            {step === "pin" && "Enter your 6-digit PIN to confirm"}
            {step === "otp" && "Enter the OTP code sent to your email"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Step 1: Amount Selection */}
        {step === "amount" && (
          <form onSubmit={handleAmountSubmit} className="space-y-5">
            {!directBankData && (
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={transferMode === "saved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTransferMode("saved");
                    setDirectBankDetails(null);
                    amountForm.setValue("bank_id", 0);
                  }}
                  className="flex-1"
                >
                  Saved Banks
                </Button>
                <Button
                  type="button"
                  variant={transferMode === "direct" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTransferMode("direct");
                    amountForm.setValue("bank_id", 0);
                  }}
                  className="flex-1"
                >
                  Direct Transfer
                </Button>
              </div>
            )}
            
            <FieldGroup>
              {directBankData ? (
                <Field>
                  <FieldLabel className="font-bold text-xs">
                    Transfer To
                  </FieldLabel>
                  <div className="p-3 bg-muted/30 rounded-xl border border-transparent">
                    <p className="font-medium text-sm">{directBankData.account_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {directBankData.bank_code} - {directBankData.account_number}
                    </p>
                  </div>
                </Field>
              ) : (
                <Field>
                  <FieldLabel htmlFor="bank_id" className="font-bold text-xs">
                    {transferMode === "saved" ? "Select Saved Bank" : "Select Bank"}
                  </FieldLabel>
                  <Select
                    value={transferMode === "direct" ? directBankDetails?.bank_code || "" : amountForm.watch("bank_id")?.toString() || ""}
                    onValueChange={(value) => {
                      if (transferMode === "direct") {
                        // For direct transfer, set bank details directly
                        const selectedBank = allBanks.find(bank => bank.code === value);
                        if (selectedBank) {
                          setDirectBankDetails({
                            bank_code: selectedBank.code,
                            bank_name: selectedBank.name || selectedBank.bankName,
                            account_number: "",
                            account_name: ""
                          });
                        }
                      } else {
                        // For saved banks, use form value
                        amountForm.setValue("bank_id", value ? parseInt(value, 10) : 0);
                      }
                    }}
                  >
                    <SelectTrigger className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 text-foreground text-sm">
                      <SelectValue placeholder={transferMode === "saved" ? "Choose a saved bank..." : "Choose a bank..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {transferMode === "saved" 
                        ? userBanks.map((bank) => (
                            <SelectItem 
                              key={bank.id} 
                              value={bank.id.toString()}
                              className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <span className="block w-full">{bank.bank_name} - {bank.account_number}</span>
                            </SelectItem>
                          ))
                        : allBanks.map((bank) => (
                            <SelectItem 
                              key={bank.code} 
                              value={bank.code}
                              className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <span className="block w-full">{bank.name || bank.bankName}</span>
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                  {amountForm.formState.errors.bank_id && (
                    <FieldError>
                      {amountForm.formState.errors.bank_id.message}
                    </FieldError>
                  )}
                </Field>
              )}

              {transferMode === "direct" && (
                <>
                  <Field>
                    <FieldLabel htmlFor="account_number" className="font-bold text-xs">
                      Account Number
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="account_number"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter account number"
                        className="h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl pr-10"
                        value={directBankDetails?.account_number || ""}
                        onChange={(e) => setDirectBankDetails(prev => prev ? {...prev, account_number: e.target.value} : null)}
                        disabled={!directBankDetails?.bank_code}
                      />
                      {verificationLoading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    {!directBankDetails?.bank_code && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Please select a bank first
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="account_name" className="font-bold text-xs">
                      Account Name
                    </FieldLabel>
                    <Input
                      id="account_name"
                      type="text"
                      placeholder="Account name will be auto-filled"
                      className="h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                      value={directBankDetails?.account_name || ""}
                      readOnly
                    />
                    {verificationLoading && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Adding bank and verifying account...
                      </p>
                    )}
                  </Field>

                  {directBankDetails?.account_name && !verificationLoading && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                      <p className="text-sm text-green-800">
                        ✓ Account verified: {directBankDetails.account_name}
                      </p>
                    </div>
                  )}
                </>
              )}

              <Field>
                <FieldLabel htmlFor="amount" className="font-bold text-xs">
                  Amount
                </FieldLabel>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none font-bold">₦</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-11 h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                    {...amountForm.register("amount")}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: ₦{balance?.toLocaleString()}
                </p>
                {amountForm.formState.errors.amount && (
                  <FieldError>
                    {amountForm.formState.errors.amount.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="note" className="font-bold text-xs">
                  Note (Optional)
                </FieldLabel>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-muted-foreground w-5 h-5 pointer-events-none" />
                  <textarea
                    id="note"
                    placeholder="Add a note..."
                    rows={2}
                    className="pl-11 p-3 rounded-xl bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 text-sm resize-none w-full"
                    {...amountForm.register("note")}
                  />
                </div>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={initLoading || banksLoading}
              className="w-full h-11 rounded-xl font-bold"
            >
              {initLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Continue to PIN
            </Button>
          </form>
        )}

        {/* Step 2: PIN Verification */}
        {step === "pin" && (
          <form onSubmit={handlePinSubmit} className="space-y-5">
            <Field>
              <FieldLabel className="font-bold text-xs">
                Transfer Details
              </FieldLabel>
              <div className="p-3 bg-muted/30 rounded-xl border border-transparent">
                {transferMode === "direct" && directBankDetails ? (
                  <>
                    <p className="font-medium text-sm">{directBankDetails.account_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {directBankDetails.bank_name} - {directBankDetails.account_number}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-sm">
                      {userBanks.find((b) => b.id === selectedBankId)?.account_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userBanks.find((b) => b.id === selectedBankId)?.bank_name} -{" "}
                      {userBanks.find((b) => b.id === selectedBankId)?.account_number}
                    </p>
                  </>
                )}
                <p className="text-lg font-bold text-primary mt-2">
                  ₦{parseFloat(transferAmount).toLocaleString()}
                </p>
              </div>
            </Field>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="pin" className="font-bold text-xs">
                  6-Digit PIN
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  <Input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    className="pl-11 h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl tracking-widest text-center"
                    {...pinForm.register("pin")}
                  />
                </div>
                {pinForm.formState.errors.pin && (
                  <FieldError>
                    {pinForm.formState.errors.pin.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("amount")}
                className="flex-1 h-11 rounded-xl font-bold"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={processLoading}
                className="flex-1 h-11 rounded-xl font-bold"
              >
                {processLoading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Verify PIN
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a 6-digit code to your registered email
              </p>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="otp_code" className="font-bold text-xs">
                  OTP Code
                </FieldLabel>
                <Input
                  id="otp_code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  className="h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl tracking-widest text-center text-lg"
                  {...otpForm.register("otp_code")}
                />
                {otpForm.formState.errors.otp_code && (
                  <FieldError>
                    {otpForm.formState.errors.otp_code.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("pin")}
                className="flex-1 h-11 rounded-xl font-bold"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={verifyLoading}
                className="flex-1 h-11 rounded-xl font-bold"
              >
                {verifyLoading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Complete Transfer
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
