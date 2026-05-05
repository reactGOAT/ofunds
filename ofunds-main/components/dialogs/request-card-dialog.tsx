"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Loader2, AlertCircle, CheckCircle2, CreditCard, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestAtmCardSchema, type RequestAtmCardFormData } from "@/schema/card";
import { useRequestAtmCard, useGetAtmCardCharge } from "@/hooks/useCards";
import { toast } from "sonner";

interface RequestCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = "form" | "success";

export function RequestCardDialog({
  open,
  onOpenChange,
  onSuccess,
}: RequestCardDialogProps) {
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);

  const { data: cardCharge, isLoading: chargeLoading } = useGetAtmCardCharge();
  const { mutate: requestCard, isPending: isSubmitting } = useRequestAtmCard();

  const form = useForm<RequestAtmCardFormData>({
    resolver: zodResolver(requestAtmCardSchema),
    defaultValues: {
      phone: "",
      state: "",
      lga: "",
      street: "",
    },
  });

  const formatAmount = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num.toLocaleString("en-NG");
  };

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    
    requestCard(data, {
      onSuccess: (response) => {
        if (response.status) {
          setStep("success");
          toast.success("Card request submitted successfully!");
          onSuccess?.();
        } else {
          setError("Failed to submit card request. Please try again.");
        }
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Failed to submit card request");
      },
    });
  });

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setStep("form");
      setError(null);
      form.reset();
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Request Ofunds ATM Card
              </DialogTitle>
              <DialogDescription>
                Fill in your delivery details to receive your card
              </DialogDescription>
            </DialogHeader>

            {/* Card Charge Info */}
            {!chargeLoading && cardCharge && (
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Card Fee</p>
                  <p className="font-bold text-lg text-foreground">
                    N{formatAmount(cardCharge)}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FieldGroup>
                {/* Phone Number */}
                <Field>
                  <FieldLabel htmlFor="phone" className="font-bold text-xs">
                    Phone Number
                  </FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="Enter your phone number"
                      className="h-12 pl-11 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                      {...form.register("phone")}
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <FieldError>{form.formState.errors.phone.message}</FieldError>
                  )}
                </Field>

                {/* State */}
                <Field>
                  <FieldLabel htmlFor="state" className="font-bold text-xs">
                    State
                  </FieldLabel>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="state"
                      type="text"
                      placeholder="e.g. Lagos, Akwa Ibom"
                      className="h-12 pl-11 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                      {...form.register("state")}
                    />
                  </div>
                  {form.formState.errors.state && (
                    <FieldError>{form.formState.errors.state.message}</FieldError>
                  )}
                </Field>

                {/* LGA */}
                <Field>
                  <FieldLabel htmlFor="lga" className="font-bold text-xs">
                    Local Government Area (LGA)
                  </FieldLabel>
                  <Input
                    id="lga"
                    type="text"
                    placeholder="e.g. Ikeja, Uyo"
                    className="h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                    {...form.register("lga")}
                  />
                  {form.formState.errors.lga && (
                    <FieldError>{form.formState.errors.lga.message}</FieldError>
                  )}
                </Field>

                {/* Street Address */}
                <Field>
                  <FieldLabel htmlFor="street" className="font-bold text-xs">
                    Street Address
                  </FieldLabel>
                  <Input
                    id="street"
                    type="text"
                    placeholder="Enter your full street address"
                    className="h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                    {...form.register("street")}
                  />
                  {form.formState.errors.street && (
                    <FieldError>{form.formState.errors.street.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold rounded-[20px] shadow-[0_10px_15px_-3px_rgba(255,106,0,0.3)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#00a63e]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Request Submitted!
              </h2>
              <p className="text-muted-foreground">
                Your Ofunds ATM card request has been submitted successfully. 
                Your card will be delivered within 3-5 business days.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full h-14 text-lg font-bold rounded-[20px]"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
