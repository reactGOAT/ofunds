import HistoryClient from "./client";

export const metadata = {
  title: "History - Ofunds",
  description: "View your transaction history on Ofunds.",
};

export default function HistoryPage() {
  return <HistoryClient />;
}
