"use client";

import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  isSamsung: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  canInstall: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isEdge: false,
    isSamsung: false,
    isStandalone: false,
    isOnline: true,
    canInstall: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    // Detect platform and browser
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios|edgios|opr/.test(userAgent);
    const isChrome = /chrome|crios/.test(userAgent) && !/edg|opr|samsung/.test(userAgent);
    const isFirefox = /firefox|fxios/.test(userAgent);
    const isEdge = /edg/.test(userAgent);
    const isSamsung = /samsungbrowser/.test(userAgent);
    
    // Detect device type
    const isMobile = /mobile|android|iphone|ipod/.test(userAgent) && !/ipad/.test(userAgent);
    const isTablet = /ipad/.test(userAgent) || (/android/.test(userAgent) && !/mobile/.test(userAgent));
    const isDesktop = !isMobile && !isTablet;
    
    // Check if running as standalone (installed PWA)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    // Check online status
    const isOnline = navigator.onLine;

    // Determine if installation is possible
    // For browsers that support beforeinstallprompt, we'll wait for the event
    // For iOS Safari, manual installation is always possible
    // For other browsers, show instructions
    const supportsInstallPrompt = isChrome || isEdge || isSamsung || (isAndroid && !isFirefox);
    const canShowIOSInstall = isIOS && isSafari;
    const canShowManualInstall = !supportsInstallPrompt && !canShowIOSInstall;

    setState(prev => ({
      ...prev,
      isIOS,
      isAndroid,
      isSafari,
      isChrome,
      isFirefox,
      isEdge,
      isSamsung,
      isStandalone,
      isInstalled: isStandalone,
      isOnline,
      isMobile,
      isTablet,
      isDesktop,
      // For iOS Safari, we can always show install (manual process)
      // For others, we'll update canInstall when beforeinstallprompt fires
      canInstall: canShowIOSInstall && !isStandalone,
    }));

    // Listen for online/offline events
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for beforeinstallprompt event (Chrome, Edge, Samsung Browser)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState(prev => ({ ...prev, isInstallable: true, canInstall: true }));
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        canInstall: false,
        isStandalone: true,
      }));
      // Clear any dismissed state when installed
      localStorage.removeItem("pwa-install-dismissed");
      localStorage.removeItem("pwa-fab-dismissed");
      localStorage.removeItem("pwa-banner-dismissed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setState(prev => ({ ...prev, isInstallable: false, canInstall: false }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error prompting install:", error);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setDeferredPrompt(null);
  }, []);

  // Get install instructions based on browser/platform
  const getInstallInstructions = useCallback(() => {
    if (state.isIOS && state.isSafari) {
      return {
        type: "ios-safari" as const,
        steps: [
          "Tap the Share button at the bottom of Safari",
          "Scroll down and tap 'Add to Home Screen'",
          "Tap 'Add' to confirm",
        ],
      };
    }
    if (state.isIOS && state.isChrome) {
      return {
        type: "ios-chrome" as const,
        steps: [
          "Open this page in Safari",
          "Tap the Share button",
          "Tap 'Add to Home Screen'",
        ],
      };
    }
    if (state.isFirefox && state.isAndroid) {
      return {
        type: "android-firefox" as const,
        steps: [
          "Tap the menu button (three dots)",
          "Tap 'Install'",
        ],
      };
    }
    if (state.isFirefox && state.isDesktop) {
      return {
        type: "desktop-firefox" as const,
        steps: [
          "Firefox doesn't support PWA installation directly",
          "Try using Chrome or Edge for the best experience",
        ],
      };
    }
    if (state.isDesktop && (state.isChrome || state.isEdge)) {
      return {
        type: "desktop-chromium" as const,
        steps: [
          "Click the install icon in the address bar",
          "Or click the menu (three dots) and select 'Install Ofunds'",
        ],
      };
    }
    return {
      type: "generic" as const,
      steps: [
        "Look for an install option in your browser menu",
        "Or add this page to your home screen",
      ],
    };
  }, [state]);

  return {
    ...state,
    promptInstall,
    dismissPrompt,
    deferredPrompt,
    getInstallInstructions,
  };
}
