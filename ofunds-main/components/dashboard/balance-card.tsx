"use client";

import { Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  balance: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onBankTransfer?: () => void;
  onOfundsTransfer?: () => void;
  onAddBank?: () => void;
}

export function BalanceCard({
  balance,
  isVisible,
  onToggleVisibility,
  onBankTransfer,
  onOfundsTransfer,
  onAddBank,
}: BalanceCardProps) {
  return (
    <div className="w-full rounded-[24px] bg-primary p-8 text-primary-foreground space-y-6 shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="space-y-2 relative z-10">
        <p className="text-lg font-medium opacity-80">Available Balance</p>
        <div className="flex items-center gap-3">
          <p className="text-5xl font-bold tracking-tight">
            {isVisible ? `₦${balance}` : "••••••••"}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVisibility}
            className="h-10 w-10 text-primary-foreground hover:bg-white/20 rounded-full ml-auto"
          >
            {isVisible ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 relative z-10">
        <Button 
          onClick={onOfundsTransfer}
          className="bg-white text-primary hover:bg-white/90 h-14 text-base font-bold rounded-[24px] flex items-center justify-center gap-2 w-full transition-transform active:scale-95"
        >
          <ArrowUpRight className="h-5 w-5" />
          To Ofunds
        </Button>
        <Button 
          onClick={onBankTransfer}
          className="bg-white text-primary hover:bg-white/90 h-14 text-base font-bold rounded-[24px] flex items-center justify-center gap-2 w-full transition-transform active:scale-95"
        >
          <ArrowUpRight className="h-5 w-5" />
          To Bank
        </Button>
      </div>
    </div>
  );
}
