"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setJustCameOnline(true);
      setShowBanner(true);
      
      // Store last online time
      localStorage.setItem("last-online-time", Date.now().toString());
      
      // Hide "back online" banner after 3 seconds
      setTimeout(() => {
        setShowBanner(false);
        setJustCameOnline(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Store online time periodically
    const interval = setInterval(() => {
      if (navigator.onLine) {
        localStorage.setItem("last-online-time", Date.now().toString());
      }
    }, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) return null;

  // Don't show anything when online and not just reconnected
  if (isOnline && !showBanner) return null;

  // Back online banner
  if (isOnline && justCameOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top-full duration-300">
        <div className="bg-green-500 text-white py-2 px-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Wifi className="w-4 h-4" />
            <span>Back online! Your data is syncing...</span>
            <RefreshCw className="w-4 h-4 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Offline banner
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top-full duration-300">
        <div className="bg-orange-500 text-white py-2 px-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            <span>You&apos;re offline. Some features may be limited.</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
