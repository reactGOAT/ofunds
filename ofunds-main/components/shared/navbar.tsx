"use client";

import {
  Home,
  Clock,
  CreditCard,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserProfilePopover } from "@/components/shared/user-profile-popover";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
  { href: "/cards", label: "Cards", icon: CreditCard },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 h-20">
      <div className="h-full dashboard-container">
        <div className="h-full flex items-center justify-between">
          
          {/* Left Side: Logo & Navigation */}
          <div className="flex items-center gap-10 h-full">
            {/* Logo */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                O
              </div>
              <span className="text-xl font-bold">Ofunds</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 h-full pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === "/" && pathname === "/dashboard");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-1 h-full font-bold transition-colors relative",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-destructive text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                58
              </span>
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Profile */}
            <UserProfilePopover />
          </div>
          
        </div>
      </div>
    </header>
  );
}
