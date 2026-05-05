"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactionHistory } from "@/hooks/useTransactions";

type TabType = "All" | "In" | "Out";

interface Transaction {
  id: string;
  name: string;
  time: string;
  category: string;
  amount: string;
  type: "credit" | "debit";
  status: "SUCCESS" | "FAILED";
  created_at: string;
}

const getAvatarStyle = (type: "credit" | "debit", status: "SUCCESS" | "FAILED") => {
  if (status === "FAILED") {
    return { bg: "bg-muted", text: "text-muted-foreground", icon: <ArrowUpRight className="w-5 h-5" /> };
  }
  if (type === "credit") {
    return { bg: "bg-[#dcfce7]", text: "text-[#00a63e]", icon: <ArrowDownLeft className="w-5 h-5" /> };
  }
  return { bg: "bg-[#ffe2e2]", text: "text-[#fb2c36]", icon: <ArrowUpRight className="w-5 h-5" /> };
};

export default function HistoryClient() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const { data: transactionHistory, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransactionHistory(15);

  // Transform API data to component format
  const transformTransactions = (apiData: any[]): Transaction[] => {
    return apiData.map((tx) => ({
      id: tx.id.toString(),
      name: tx.title || tx.description || "Transaction",
      time: new Date(tx.created_at).toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
      category: tx.description || "Transfer",
      amount: tx.type === 1 ? `+₦${tx.amount.toLocaleString()}` : `-₦${tx.amount.toLocaleString()}`,
      type: tx.type === 1 ? "credit" : "debit",
      status: tx.status === 3 ? "SUCCESS" : "FAILED",
      created_at: tx.created_at,
    }));
  };

  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach((tx) => {
      const date = new Date().toDateString() === new Date(tx.created_at).toDateString() 
        ? "Today" 
        : new Date(tx.created_at).toLocaleDateString("en-US", { 
            weekday: "long", 
            month: "short", 
            day: "numeric" 
          });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(tx);
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  };

  // Get all transactions from all pages
  const allTransactions = transactionHistory?.pages?.flatMap((page: any) => page.data || []) || [];
  const transactions = transformTransactions(allTransactions);
  const transactionsByDate = groupTransactionsByDate(transactions);

  // Filter transactions based on active tab
  const filteredTransactionsByDate = transactionsByDate.map(group => ({
    ...group,
    items: group.items.filter(tx => {
      if (activeTab === "All") return true;
      if (activeTab === "In") return tx.type === "credit";
      if (activeTab === "Out") return tx.type === "debit";
      return true;
    })
  })).filter(group => group.items.length > 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Transactions</h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card border border-border rounded-full p-1">
            {(["All", "In", "Out"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-1.5 rounded-full text-sm font-bold transition-all",
                  activeTab === tab
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card hover:bg-muted transition-colors text-foreground">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transaction List Card */}
      <div className="bg-card border border-border rounded-[32px] p-6 sm:p-10 shadow-sm space-y-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : filteredTransactionsByDate.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No {activeTab.toLowerCase()} transactions found</p>
          </div>
        ) : (
          filteredTransactionsByDate.map((group, groupIdx) => (
            <div key={group.date} className="space-y-6">
              <h2 className="text-sm font-bold text-muted-foreground">
                {group.date}
              </h2>

              <div className="space-y-6">
                {group.items.map((tx) => {
                  const avatar = getAvatarStyle(tx.type, tx.status);
                  
                  return (
                    <div key={tx.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center font-medium shrink-0",
                            avatar.bg,
                            avatar.text
                          )}
                        >
                          {avatar.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-lg leading-tight">
                            {tx.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {tx.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={cn(
                            "font-bold text-lg leading-tight",
                            tx.status === "FAILED"
                              ? "text-muted-foreground line-through opacity-50"
                              : tx.type === "credit"
                              ? "text-[#00a63e]"
                              : "text-foreground"
                          )}
                        >
                          {tx.amount}
                        </span>
                        <div
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            tx.status === "SUCCESS"
                              ? "bg-[#dcfce7] text-[#00a63e]"
                              : "bg-[#ffe2e2] text-[#fb2c36]"
                          )}
                        >
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Divider between days */}
              {groupIdx !== filteredTransactionsByDate.length - 1 && (
                <div className="w-full h-px bg-border mt-8" />
              )}
            </div>
          ))
        )}

        {!isLoading && transactions.length > 0 && hasNextPage && (
          <div className="pt-8 w-full flex justify-center">
            <button 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-primary font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
              Load More Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
