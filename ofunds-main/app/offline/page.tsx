"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw, Home, Signal, Clock } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);
    
    // Get last online time from localStorage
    const stored = localStorage.getItem("last-online-time");
    if (stored) {
      const date = new Date(parseInt(stored));
      setLastOnline(date.toLocaleString());
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically reload when back online
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    
    // Try to fetch to check connection
    try {
      await fetch("/api/health", { cache: "no-store" });
      window.location.reload();
    } catch {
      // Still offline
      setRetrying(false);
    }
  };

  // If we're back online, show a reconnecting state
  if (isOnline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Signal className="w-12 h-12 text-green-600 dark:text-green-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Back Online!
            </h1>
            <p className="text-muted-foreground">
              Reconnecting...
            </p>
          </div>
          <div className="flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Offline Icon */}
        <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center relative">
          <WifiOff className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-background">
            <span className="text-primary-foreground font-bold text-xs">O</span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            You&apos;re Offline
          </h1>
          <p className="text-muted-foreground">
            Don&apos;t worry! Some features are still available while you&apos;re offline.
            Your data will sync when you reconnect.
          </p>
        </div>

        {/* Last online time */}
        {lastOnline && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last online: {lastOnline}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
            {retrying ? "Checking..." : "Try Again"}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground px-6 py-3 rounded-xl font-medium hover:bg-muted/80 transition-colors"
          >
            <Home className="w-4 h-4" />
            View Cached Data
          </Link>
        </div>

        {/* Available Offline Features */}
        <div className="bg-muted/50 rounded-xl p-4 text-left">
          <p className="text-sm font-semibold text-foreground mb-3">
            Available offline:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              View your dashboard (cached)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              View saved transactions
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Access card information
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              New transactions will queue
            </li>
          </ul>
        </div>

        {/* Connection Tips */}
        <details className="text-left">
          <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors">
            Troubleshooting tips
          </summary>
          <ul className="mt-3 text-sm text-muted-foreground space-y-1 pl-4">
            <li>- Check your Wi-Fi or mobile data</li>
            <li>- Move closer to your router</li>
            <li>- Turn airplane mode off</li>
            <li>- Restart your device</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
