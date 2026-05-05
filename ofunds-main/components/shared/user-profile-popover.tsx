"use client";

import { LogOut, Settings, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useJetsendUserStore } from "@/store/jetsend-user-store";

export function UserProfilePopover() {
  const router = useRouter();
  const { user, balance } = useJetsendUserStore();
  console.log("users",user)

  const handleLogout = () => {
    // Clear user data from store
    useJetsendUserStore.getState().clearAll();
    
    // Clear any auth tokens/cookies
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "chat_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Redirect to login
    router.push("/login");
  };

  const userInitials = user 
    ? `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase()
    : "U";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="hidden sm:flex items-center space-x-3 pl-4 border-l h-10 hover:bg-muted/50 transition-colors rounded-lg">
          <div className="flex flex-col items-end justify-center">
            <span className="text-sm font-bold leading-tight">
              Hello, {user?.firstname || "User"}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              ₦{balance?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 text-white flex items-center justify-center text-sm font-bold overflow-hidden border-2 border-border shrink-0">
            {user?.picture ? (
              <img src={user.picture} alt="picture" className="w-full h-full object-cover" />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 mr-4" align="end" side="bottom">
        <div className="p-2 border-b">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.picture ? (
                <img src={user.picture} alt="picture" className="w-full h-full object-cover" />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-1">
          <Button
            variant="ghost"
            className="w-full justify-start h-9 px-2"
            onClick={() => router.push("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-9 px-2"
            onClick={() => router.push("/cards")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Cards
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-9 px-2"
            onClick={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        <div className="p-1 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start h-9 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
