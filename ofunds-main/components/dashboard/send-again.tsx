import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UserBank {
  id: number;
  account_reference: string;
  user_id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  created_at: string;
  updated_at: string;
}

interface SendAgainProps {
  banks: UserBank[];
  onSelectBank: (bank: UserBank) => void;
  isLoading?: boolean;
}

export function SendAgain({ banks, onSelectBank, isLoading }: SendAgainProps) {
  return (
    <div className="w-full mb-6 flex flex-col gap-4">
      <h3 className="text-2xl font-bold text-foreground">Send again</h3>
      {isLoading ? (
        <div className="flex items-center gap-4 w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="shrink-0 w-[120px] flex flex-col items-center justify-center gap-2 h-auto py-4 px-2 border border-border rounded-2xl bg-card shadow-sm"
            >
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="text-center w-full space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3 w-3/4 mx-auto rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : banks?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No saved banks</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {banks?.map((bank) => (
            <Button
              key={bank.id}
              variant="outline"
              className="shrink-0 w-[120px] flex flex-col items-center justify-center gap-2 h-auto py-4 px-2 border border-border rounded-2xl bg-card hover:bg-muted/50 transition-colors shadow-sm"
              onClick={() => onSelectBank(bank)}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {bank.bank_name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-foreground leading-tight truncate w-full block">
                  {bank.bank_name}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full block">
                  {bank.account_number}
                </span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
