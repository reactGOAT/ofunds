"use client";

import { useEffect, useState } from "react";
import { Download, X, ChevronUp, Share, PlusSquare } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export default function PWAFloatingButton() {
  const { isInstalled, canInstall, isIOS, isStandalone, promptInstall, deferredPrompt } = usePWA();
  const [showButton, setShowButton] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if button was dismissed
    const wasDismissed = localStorage.getItem("pwa-fab-dismissed");
    if (wasDismissed) {
      return;
    }

    // Show button after a delay if can install
    if (canInstall && !isInstalled && !isStandalone) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled, isStandalone]);

  // Show tooltip on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowTooltip(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    const success = await promptInstall();
    if (success) {
      setShowButton(false);
    }
  };

  const handleDismiss = () => {
    setShowButton(false);
    setShowIOSInstructions(false);
    localStorage.setItem("pwa-fab-dismissed", "true");
  };

  if (isInstalled || isStandalone || !showButton) {
    return null;
  }

  // iOS instructions popup
  if (showIOSInstructions) {
    return (
      <div className="fixed bottom-20 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in-0 duration-300">
        <div className="bg-background border border-border rounded-xl shadow-xl p-4 w-[280px]">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Install on iOS</h4>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Share className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-muted-foreground">1. Tap Share button</span>
            </div>
            <div className="flex items-center gap-2">
              <PlusSquare className="w-4 h-4 text-foreground flex-shrink-0" />
              <span className="text-muted-foreground">2. &quot;Add to Home Screen&quot;</span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full mt-3 bg-muted text-muted-foreground px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 max-w-[200px] animate-in slide-in-from-bottom-2 fade-in-0 duration-300">
          <p className="text-sm font-medium text-foreground mb-1">Install App</p>
          <p className="text-xs text-muted-foreground">
            Add Ofunds to your home screen for quick access!
          </p>
        </div>
      )}
      
      {/* Floating Action Button */}
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
        
        <button
          onClick={handleInstallClick}
          disabled={!isIOS && !deferredPrompt}
          className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group disabled:opacity-50"
        >
          <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></div>
        </button>
        
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-muted border border-border rounded-full p-1 hover:bg-muted/80 transition-colors"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      
      {/* Install hint */}
      <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground animate-bounce">
        <div className="flex items-center gap-1">
          <ChevronUp className="w-3 h-3" />
          <span>Tap to install</span>
        </div>
      </div>
    </div>
  );
}
