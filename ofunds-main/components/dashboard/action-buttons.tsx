import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSend: () => void;
  onReceive: () => void;
}

export function ActionButtons({ onSend, onReceive }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        onClick={onSend}
        className="h-14 flex flex-col items-center space-y-1"
        variant="outline"
      >
        <ArrowUp className="h-5 w-5" />
        <span className="text-sm">Send</span>
      </Button>
      <Button
        onClick={onReceive}
        className="h-14 flex flex-col items-center space-y-1"
        variant="outline"
      >
        <ArrowDown className="h-5 w-5" />
        <span className="text-sm">Receive</span>
      </Button>
    </div>
  );
}
