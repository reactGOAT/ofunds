"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Wifi, Zap, Info, ChevronRight } from "lucide-react";

export default function PWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if banner was dismissed
    const wasDismissed = localStorage.getItem("pwa-banner-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (isInstalled || dismissed || !showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto mb-6">
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Info */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-foreground">
                  Install Ofunds App
                </h3>
                <div className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Info className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-700 dark:text-green-300 font-medium">Recommended</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Get the full experience with offline access and faster performance
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleInstallClick}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              Install Now
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
