"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, Building2 } from "lucide-react";

interface SendTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOfundsTransfer: () => void;
  onBankTransfer: () => void;
}

export function SendTypeDialog({
  open,
  onOpenChange,
  onOfundsTransfer,
  onBankTransfer,
}: SendTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Transfer Type
          </DialogTitle>
          <DialogDescription className="text-center">
            How would you like to send money?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Button
            onClick={() => {
              onOfundsTransfer();
              onOpenChange(false);
            }}
            className="w-full h-16 rounded-xl flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold">Send to Ofunds User</div>
                <div className="text-sm opacity-80">Transfer to another Ofunds user</div>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => {
              onBankTransfer();
              onOpenChange(false);
            }}
            className="w-full h-16 rounded-xl flex items-center justify-between p-4 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold">Send to Bank Account</div>
                <div className="text-sm opacity-80">Transfer to any bank account</div>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
