"use client";

import { useState } from "react";
import { Home, Clock, CreditCard, ArrowUpRight, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SendTypeDialog } from "@/components/dialogs/send-type-dialog";
import { BankTransferDialog } from "@/components/dialogs/bank-transfer-dialog";
import { OfundsTransferDialog } from "@/components/dialogs/ofunds-transfer-dialog";
import { useLogout } from "@/hooks/useAuth";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [sendTypeDialogOpen, setSendTypeDialogOpen] = useState(false);
  const [bankTransferOpen, setBankTransferOpen] = useState(false);
  const [ofundsTransferOpen, setOfundsTransferOpen] = useState(false);
  const logoutMutation = useLogout();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t pb-safe">
      <div className="flex items-center justify-around h-20 px-4 relative">
        {/* Left Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-16 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Send Button */}
        <div className="flex flex-col items-center justify-start -mt-8">
          <button
            onClick={() => setSendTypeDialogOpen(true)}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform border-4 border-background z-10"
          >
            <ArrowUpRight className="h-7 w-7" />
          </button>
          <span className="text-[10px] font-bold text-primary mt-1">
            Send
          </span>
        </div>

        {/* Right Items */}
        <Link
          href="/cards"
          className={cn(
            "flex flex-col items-center justify-center space-y-1 w-16 h-full transition-colors",
            pathname === "/cards" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CreditCard className="h-6 w-6" />
          <span className="text-[10px] font-bold">Cards</span>
        </Link>

        {/* More Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex flex-col items-center justify-center space-y-1 w-16 h-full transition-colors text-muted-foreground hover:text-foreground outline-none"
            >
              <span className="text-2xl font-bold leading-[0.5] mb-2">...</span>
              <span className="text-[10px] font-bold">More</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2 mb-2" align="center" side="top">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => logoutMutation.mutate(undefined, {
                onSuccess: () => router.push("/login")
              })}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </PopoverContent>
        </Popover>

        {/* Send Type Selection Dialog */}
        <SendTypeDialog
          open={sendTypeDialogOpen}
          onOpenChange={setSendTypeDialogOpen}
          onOfundsTransfer={() => setOfundsTransferOpen(true)}
          onBankTransfer={() => setBankTransferOpen(true)}
        />

        {/* Transfer Dialogs */}
        <BankTransferDialog
          open={bankTransferOpen}
          onOpenChange={setBankTransferOpen}
        />

        <OfundsTransferDialog
          open={ofundsTransferOpen}
          onOpenChange={setOfundsTransferOpen}
        />
      </div>
    </nav>
  );
}
