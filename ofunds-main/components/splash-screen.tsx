"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SPLASH_DURATION = 4000; // 4 seconds
const FADE_DURATION = 300;

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const hasShownSplash = sessionStorage.getItem("splashShown");
    
    if (hasShownSplash) {
      setIsVisible(false);
      return;
    }

    // Show splash for fixed duration
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("splashShown", "true");
      }, FADE_DURATION);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#ff6b00] transition-opacity ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_DURATION}ms` }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2">
          <Image
            src="/ofunds-icon.png"
            alt="Ofunds"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
        </div>
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    </div>
  );
}
