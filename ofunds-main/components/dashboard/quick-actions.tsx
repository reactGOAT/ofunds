import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAction: () => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="bg-card border border-border rounded-[32px] p-2 flex flex-col sm:flex-row gap-2 w-full shadow-sm">
      {/* Instant Section */}
      <div className="flex-1 p-6 space-y-3 flex flex-col justify-center">
        <div className="inline-flex items-center px-2.5 py-1 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold w-fit">
          New
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">Instant</h3>
          <p className="text-base text-muted-foreground leading-tight">
            Check out our latest instant offers
          </p>
        </div>
      </div>

      {/* Debit Card Offer */}
      <div className="flex-1 relative overflow-hidden rounded-[24px] bg-gradient-to-r from-primary to-[#ff9900] p-6 text-primary-foreground space-y-4 shadow-sm flex flex-col justify-center">
        <div className="absolute -bottom-14 -right-14 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative space-y-1 z-10">
          <h3 className="text-lg font-bold leading-tight max-w-[180px]">
            Get your Ofunds Debit Card for free
          </h3>
          <p className="text-xs text-primary-foreground/80 leading-tight max-w-[180px]">
            Simple, secure, and ready for your everyday payments.
          </p>
        </div>
        <div className="relative z-10 pt-2">
          <Button
            onClick={onAction}
            className="bg-white text-primary hover:bg-white/90 font-bold h-9 px-4 rounded-2xl text-xs shadow-md transition-transform active:scale-95"
          >
            Request Your Card Now
          </Button>
        </div>
      </div>
    </div>
  );
}
