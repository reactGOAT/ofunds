import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ff6b00" },
    { media: "(prefers-color-scheme: dark)", color: "#ff6b00" },
  ],
  colorScheme: "light dark",
};
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ProvidersClient from "@/utils/providers/client";
import PWAInstaller from "@/components/pwa-installer";
import PWAFloatingButton from "@/components/pwa-fab";
import NetworkStatus from "@/components/network-status";
import SplashScreen from "@/components/splash-screen";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ofunds - Digital Wallet",
    template: "%s | Ofunds",
  },
  description: "Your money, your rules. Fast, secure, and bold digital banking.",
  keywords: ["digital wallet", "banking", "finance", "payments", "transfers", "cards", "fintech", "mobile money"],
  authors: [{ name: "Ofunds Team", url: "https://ofunds.com" }],
  creator: "Ofunds Team",
  publisher: "Ofunds",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ofunds.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ofunds",
    title: "Ofunds - Digital Wallet",
    description: "Your money, your rules. Fast, secure, and bold digital banking.",
    images: [
      {
        url: "/icons/og-image-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Ofunds Digital Wallet",
        type: "image/png",
      },
      {
        url: "/icons/og-image-1200x1200.png",
        width: 1200,
        height: 1200,
        alt: "Ofunds Digital Wallet",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ofunds - Digital Wallet",
    description: "Your money, your rules. Fast, secure, and bold digital banking.",
    images: ["/icons/og-image-1200x630.png"],
    creator: "@ofunds",
    site: "@ofunds",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  icons: {
    icon: [
      { url: "/ofunds-icon.png", sizes: "192x192", type: "image/png" },
      { url: "/ofunds-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/ofunds-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/manifest.json" },
      { rel: "apple-touch-icon", url: "/ofunds-icon.png" },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#ff6b00",
    "msapplication-config": "/browserconfig.xml",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ofunds",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.className} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col overflow-x-hidden" suppressHydrationWarning>
        <ProvidersClient >
          <SplashScreen />
          <NetworkStatus />
          <PWAInstaller />
          <PWAFloatingButton />
          {children}
        </ProvidersClient>
      </body>
    </html>
  );
}
