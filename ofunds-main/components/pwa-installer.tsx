"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Wifi, Zap, Star, Share, PlusSquare, Menu, MoreVertical } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export default function PWAInstaller() {
  const { 
    isInstalled, 
    isStandalone, 
    isIOS, 
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    isDesktop,
    isMobile,
    isTablet,
    promptInstall, 
    dismissPrompt, 
    deferredPrompt,
    getInstallInstructions 
  } = usePWA();
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user previously dismissed the install prompt
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = localStorage.getItem("pwa-install-dismissed-time");
    
    // If dismissed more than 3 days ago, show again
    if (wasDismissed && dismissedTime) {
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      if (parseInt(dismissedTime) < threeDaysAgo) {
        localStorage.removeItem("pwa-install-dismissed");
        localStorage.removeItem("pwa-install-dismissed-time");
      } else {
        setDismissed(true);
        return;
      }
    } else if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Always show after a delay if not installed
    if (!isInstalled && !isStandalone) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstalled, isStandalone]);

  const handleInstallClick = async () => {
    // For browsers with native install prompt
    if (deferredPrompt) {
      const success = await promptInstall();
      if (success) {
        setShowInstallPrompt(false);
      }
      return;
    }
    // For iOS/manual install, the instructions are already shown
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    dismissPrompt();
    localStorage.setItem("pwa-install-dismissed", "true");
    localStorage.setItem("pwa-install-dismissed-time", Date.now().toString());
  };

  // Don't render on server or if already installed
  if (!mounted || isInstalled || isStandalone || dismissed || !showInstallPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();
  const showNativeInstall = !!deferredPrompt;

  // iOS Safari install instructions
  if (isIOS && isSafari) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-500">
        <div className="bg-background border border-border rounded-2xl shadow-2xl p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">O</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-foreground">
                  Install Ofunds
                </h3>
                <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">iOS</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Add to your home screen for the best experience
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* iOS Installation Steps */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">How to install:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">1</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Tap</span>
                  <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded">
                    <Share className="w-4 h-4" />
                    <span className="font-medium text-xs">Share</span>
                  </div>
                  <span className="text-muted-foreground">below</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">2</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Tap</span>
                  <div className="flex items-center gap-1 bg-muted text-foreground px-2 py-1 rounded border">
                    <PlusSquare className="w-4 h-4" />
                    <span className="font-medium text-xs">Add to Home Screen</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">3</span>
                </div>
                <span className="text-sm text-muted-foreground">Tap <strong className="text-foreground">Add</strong> to confirm</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full bg-muted text-muted-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // iOS Chrome - Suggest Safari
  if (isIOS && !isSafari) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-500">
        <div className="bg-background border border-border rounded-2xl shadow-2xl p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xl">O</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1">Install Ofunds</h3>
              <p className="text-sm text-muted-foreground">
                Open this page in Safari to add Ofunds to your home screen
              </p>
            </div>
            <button onClick={handleDismiss} className="p-2 rounded-lg hover:bg-muted/50">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full bg-muted text-muted-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  // Firefox Android
  if (isAndroid && isFirefox) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-500">
        <div className="bg-background border border-border rounded-2xl shadow-2xl p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xl">O</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1">Install Ofunds</h3>
              <p className="text-sm text-muted-foreground">Get quick access from your home screen</p>
            </div>
            <button onClick={handleDismiss} className="p-2 rounded-lg hover:bg-muted/50">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">1</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Tap</span>
                <div className="bg-muted text-foreground px-2 py-1 rounded border">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground">menu</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">2</span>
              </div>
              <span className="text-sm text-muted-foreground">Tap <strong className="text-foreground">Install</strong></span>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="w-full bg-muted text-muted-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // Desktop Firefox
  if (isDesktop && isFirefox) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-500">
        <div className="bg-background border border-border rounded-2xl shadow-2xl p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xl">O</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1">Install Ofunds App</h3>
              <p className="text-sm text-muted-foreground">
                For the best experience, open this page in Chrome or Edge to install
              </p>
            </div>
            <button onClick={handleDismiss} className="p-2 rounded-lg hover:bg-muted/50">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full bg-muted text-muted-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  // Android/Chrome/Desktop with native install prompt OR manual instructions
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-500">
      <div className="bg-background border border-border rounded-2xl shadow-2xl p-5 space-y-4">
        {/* Header with app icon */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 relative">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">O</span>
            </div>
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground">
                Install Ofunds
              </h3>
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 text-green-600 dark:text-green-400 fill-current" />
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">FREE</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {showNativeInstall 
                ? "Install for faster access, offline support, and a native app experience."
                : "Add to your home screen for quick access anytime."
              }
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Benefits - only show for native install */}
        {showNativeInstall && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs font-medium text-foreground">Native Feel</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs font-medium text-foreground">Works Offline</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-xs font-medium text-foreground">Super Fast</p>
            </div>
          </div>
        )}

        {/* Manual instructions for non-native browsers */}
        {!showNativeInstall && (
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">How to install:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">1</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Open browser menu</span>
                  <Menu className="w-4 h-4 text-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">2</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Look for <strong className="text-foreground">&quot;Install&quot;</strong> or <strong className="text-foreground">&quot;Add to Home Screen&quot;</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {showNativeInstall ? (
            <>
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 bg-muted text-muted-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Maybe Later
              </button>
            </>
          ) : (
            <button
              onClick={handleDismiss}
              className="w-full bg-muted text-muted-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
