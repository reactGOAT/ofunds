"use client";

import { useCallback, useEffect, useState } from "react";

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission | "default";
  subscription: PushSubscription | null;
  isSubscribing: boolean;
  error: string | null;
}

// VAPID public key - In production, this should come from environment variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: "default",
    subscription: null,
    isSubscribing: false,
    error: null,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = 
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      let permission: NotificationPermission = "default";
      let subscription: PushSubscription | null = null;

      if (isSupported) {
        permission = Notification.permission;

        try {
          const registration = await navigator.serviceWorker.ready;
          subscription = await registration.pushManager.getSubscription();
        } catch (err) {
          console.error("Error checking push subscription:", err);
        }
      }

      setState((prev) => ({
        ...prev,
        isSupported,
        permission,
        subscription,
      }));
    };

    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, error: "Push notifications are not supported" }));
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      setState((prev) => ({ ...prev, permission, error: null }));
      return permission;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to request permission";
      setState((prev) => ({ ...prev, error }));
      return "denied";
    }
  }, [state.isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, error: "Push notifications are not supported" }));
      return null;
    }

    setState((prev) => ({ ...prev, isSubscribing: true, error: null }));

    try {
      // Request permission if not granted
      let permission = state.permission;
      if (permission !== "granted") {
        permission = await requestPermission();
        if (permission !== "granted") {
          setState((prev) => ({ 
            ...prev, 
            isSubscribing: false, 
            error: "Notification permission denied" 
          }));
          return null;
        }
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription && VAPID_PUBLIC_KEY) {
        // Create new subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      setState((prev) => ({
        ...prev,
        subscription,
        isSubscribing: false,
        error: null,
      }));

      return subscription;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to subscribe";
      setState((prev) => ({ ...prev, isSubscribing: false, error }));
      return null;
    }
  }, [state.isSupported, state.permission, requestPermission]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      return true;
    }

    try {
      await state.subscription.unsubscribe();
      setState((prev) => ({ ...prev, subscription: null, error: null }));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to unsubscribe";
      setState((prev) => ({ ...prev, error }));
      return false;
    }
  }, [state.subscription]);

  // Show a local notification (for testing)
  const showLocalNotification = useCallback(
    async (title: string, options?: NotificationOptions): Promise<void> => {
      if (!state.isSupported || state.permission !== "granted") {
        console.warn("Cannot show notification: not supported or permission not granted");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-96x96.png",
          vibrate: [100, 50, 100],
          tag: "local-notification",
          ...options,
        });
      } catch (err) {
        console.error("Error showing notification:", err);
      }
    },
    [state.isSupported, state.permission]
  );

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    showLocalNotification,
    isEnabled: state.permission === "granted" && state.subscription !== null,
  };
}
