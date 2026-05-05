import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";

interface Transaction {
  id: number;
  name: string;
  amount: string;
  date: string;
  type: "credit" | "debit";
  status: "SUCCESS" | "FAILED";
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
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

export function RecentTransactions({
  transactions,
  isLoading,
}: RecentTransactionsProps) {

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-2xl font-bold text-foreground">
          Recent Transactions
        </h3>
        <Link
          href="/history"
          className="text-primary text-sm font-medium hover:underline"
        >
          View more &gt;
        </Link>
      </div>
      <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col gap-6 w-full shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction, index) => {
            const avatar = getAvatarStyle(transaction.type, transaction.status);

            return (
              <div key={transaction.id} className="flex flex-col w-full">
                <div className="flex items-start justify-between w-full group">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-medium shrink-0 ${avatar.bg} ${avatar.text}`}
                    >
                      {avatar.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-foreground text-lg leading-tight">
                        {transaction.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-normal mt-1">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`font-bold text-lg leading-tight ${
                        transaction.status === "FAILED"
                          ? "text-muted-foreground line-through opacity-50"
                          : transaction.type === "credit"
                          ? "text-[#00a63e]"
                          : "text-foreground"
                      }`}
                    >
                      {transaction.amount}
                    </span>
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        transaction.status === "SUCCESS"
                          ? "bg-[#dcfce7] text-[#00a63e]"
                          : "bg-[#ffe2e2] text-[#fb2c36]"
                      }`}
                    >
                      {transaction.status}
                    </div>
                  </div>
                </div>

                {/* Divider except for last item */}
                {index !== transactions.length - 1 && (
                  <div className="w-full h-px bg-border mt-6" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
