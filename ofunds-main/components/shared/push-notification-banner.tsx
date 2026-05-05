"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

export function PushNotificationBanner() {
  const {
    permission,
    isSupported,
    isEnabled,
    isSubscribing,
    subscribe,
  } = usePushNotifications();

  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem("push-banner-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("push-banner-dismissed", "true");
  };

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      setIsDismissed(true);
    }
  };

  // Don't show if not mounted (SSR), not supported, already subscribed, denied, or dismissed
  if (
    !mounted ||
    !isSupported ||
    isSubscribed ||
    permission === "denied" ||
    permission === "granted" ||
    isDismissed
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm",
        "bg-card border border-border rounded-2xl p-4 shadow-lg z-50",
        "animate-in slide-in-from-bottom-5 duration-300"
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-foreground text-sm">
            Enable Notifications
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Get instant alerts for transactions, offers, and important updates.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDismiss}
          className="flex-1 text-xs"
        >
          Not Now
        </Button>
        <Button
          size="sm"
          onClick={handleEnable}
          disabled={isLoading}
          className="flex-1 text-xs bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Enabling..." : "Enable"}
        </Button>
      </div>
    </div>
  );
}
