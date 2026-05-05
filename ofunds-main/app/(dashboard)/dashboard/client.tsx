"use client";

import { useState, useEffect } from "react";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { SendAgain } from "@/components/dashboard/send-again";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BankTransferDialog } from "@/components/dialogs/bank-transfer-dialog";
import { OfundsTransferDialog } from "@/components/dialogs/ofunds-transfer-dialog";
import { SendAgainDialog } from "@/components/dialogs/send-again-dialog";
import PWABanner from "@/components/pwa-banner";
import { useGetUser, useGetAllUsers } from "@/hooks/useUser";
import { useTransactionHistory } from "@/hooks/useTransactions";
import { useGetUserBanks } from "@/hooks/useBanks";
import { useJetsendUserStore } from "@/store/jetsend-user-store";
import { useSendAgain } from "@/hooks/useSendAgain";
import type { Bank } from "@/store/jetsend-user-store";

export default function DashboardClient() {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [bankTransferOpen, setBankTransferOpen] = useState(false);
  const [ofundsTransferOpen, setOfundsTransferOpen] = useState(false);
  const [sendAgainOpen, setSendAgainOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<number | undefined>(undefined);

  const { data: user, isLoading: isLoadingUser } = useGetUser();
  const { data: transactionHistory, isLoading: isLoadingTransactions } =
    useTransactionHistory(5);
  const { isLoading: isLoadingBanks } = useGetUserBanks();
  const { recipients } = useSendAgain();
  const { user: storedUser, balance, transactions, banks } = useJetsendUserStore();

  useEffect(() => {
    if (user) {
      useJetsendUserStore.setState({
        user,
        balance: user.wallet?.balance ?? 0,
      });
    }
  }, [user]);

  useEffect(() => {
    if (transactionHistory?.pages) {
      const allTransactions = transactionHistory.pages.flatMap((page: any) => page.data || []);
      useJetsendUserStore.setState({ transactions: allTransactions });
    }
  }, [transactionHistory]);

  const displayTransactions = transactions.slice(0, 5).map((tx) => ({
    id: tx.id,
    name: tx.title || "Transaction",
    amount: tx.type === 1 ? `+₦${tx.amount.toLocaleString()}` : `-₦${tx.amount.toLocaleString()}`,
    date: new Date(tx.created_at).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: tx.type === 0 ? ("debit" as const) : ("credit" as const),
    status: tx.status === 3 ? ("SUCCESS" as const) : ("FAILED" as const),
  }));

  const contactsFromRecipients = recipients.slice(0, 5).map((recipient) => ({
    id: recipient.id,
    name:
      recipient.name.substring(0, 8) + (recipient.name.length > 8 ? "..." : ""),
    initials: recipient.name.substring(0, 1).toUpperCase(),
    type: recipient.type,
  }));

  const handleSelectRecipient = (contact: any) => {
    if (contact.type === "bank") {
      setBankTransferOpen(true);
    } else if (contact.type === "ofunds") {
      setOfundsTransferOpen(true);
    }
  };

  const displayBalance = storedUser?.wallet?.balance ?? balance ?? 0;
  const formattedBalance = displayBalance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="w-full space-y-6">
      {/* PWA Installation Banner */}
      <PWABanner />
      
      <div className="flex flex-col lg:flex-row gap-16 w-full justify-between items-start">
        {/* Left Column */}
        <div className="dashboard-left w-full lg:max-w-[55%] flex flex-col gap-10">
          <BalanceCard
            balance={formattedBalance}
            isVisible={balanceVisible}
            onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
            onBankTransfer={() => setBankTransferOpen(true)}
            onOfundsTransfer={() => setOfundsTransferOpen(true)}
          />

        <SendAgain
          banks={banks}
          isLoading={isLoadingBanks}
          onSelectBank={(bank) => {
            setBankTransferOpen(true);
            // Set the pre-selected bank ID
            setSelectedBankId(bank.id);
          }}
        />

        <QuickActions
          onAction={() => {
            // Handle debit card request action
            console.log("Request debit card clicked");
          }}
        />
      </div>

      {/* Right Column */}
      <div className="dashboard-right w-full  ">
        <RecentTransactions
          transactions={displayTransactions}
          isLoading={isLoadingTransactions}
        />
      </div>

      {/* Dialogs */}
      <BankTransferDialog
        open={bankTransferOpen}
        onOpenChange={(open) => {
          setBankTransferOpen(open);
          if (!open) setSelectedBankId(undefined); // Reset when closed
        }}
        onSuccess={() => {
          // Refetch data after successful transfer
          setSelectedBankId(undefined);
        }}
        preSelectedBankId={selectedBankId}
      />
      <OfundsTransferDialog
        open={ofundsTransferOpen}
        onOpenChange={setOfundsTransferOpen}
        onSuccess={() => {
          // Refetch data after successful transfer
        }}
      />
      <SendAgainDialog
        open={sendAgainOpen}
        onOpenChange={setSendAgainOpen}
        onSuccess={() => {
          // Refetch data after successful transfer
        }}
      />
      </div>
    </div>
  );
}
