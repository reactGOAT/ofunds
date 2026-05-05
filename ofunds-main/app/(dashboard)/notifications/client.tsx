"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ArrowDownLeft, ArrowUpRight, Loader2, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useNotifications, 
  useDeleteNotification, 
  useMarkNotificationAsRead 
} from "@/hooks/useNotifications";
import type { Notification } from "@/services/notifications";

interface SwipeableNotificationProps {
  notification: Notification;
  onDelete: (id: number) => void;
  onRead: (id: number) => void;
}

function SwipeableNotification({ notification, onDelete, onRead }: SwipeableNotificationProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const DELETE_THRESHOLD = -80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    
    if (diff < 0) {
      setTranslateX(Math.max(diff, -100));
      setShowDelete(diff < DELETE_THRESHOLD);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (translateX < DELETE_THRESHOLD) {
      setTranslateX(-80);
      setShowDelete(true);
    } else {
      setTranslateX(0);
      setShowDelete(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX.current;
    
    if (diff < 0) {
      setTranslateX(Math.max(diff, -100));
      setShowDelete(diff < DELETE_THRESHOLD);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    if (translateX < DELETE_THRESHOLD) {
      setTranslateX(-80);
      setShowDelete(true);
    } else {
      setTranslateX(0);
      setShowDelete(false);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleClick = () => {
    if (Math.abs(translateX) < 10 && !notification.is_read) {
      onRead(notification.id);
    }
  };

  const resetSwipe = () => {
    setTranslateX(0);
    setShowDelete(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        resetSwipe();
      }
    };

    if (showDelete) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDelete]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "credit":
        return { 
          bg: "bg-[#dcfce7]", 
          text: "text-[#00a63e]", 
          icon: <ArrowDownLeft className="w-5 h-5" /> 
        };
      case "debit":
        return { 
          bg: "bg-[#ffe2e2]", 
          text: "text-[#fb2c36]", 
          icon: <ArrowUpRight className="w-5 h-5" /> 
        };
      default:
        return { 
          bg: "bg-primary/10", 
          text: "text-primary", 
          icon: <Info className="w-5 h-5" /> 
        };
    }
  };

  const iconStyle = getNotificationIcon(notification.type);
  const isUnread = !notification.is_read;

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden rounded-xl"
    >
      <div 
        className={cn(
          "absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-destructive transition-opacity",
          showDelete ? "opacity-100" : "opacity-0"
        )}
        style={{ width: "80px" }}
      >
        <button
          onClick={() => onDelete(notification.id)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive text-primary-foreground"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div
        className={cn(
          "relative flex items-start gap-4 p-4 bg-card transition-transform cursor-pointer",
          isDragging ? "" : "transition-all duration-200"
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
            iconStyle.bg,
            iconStyle.text
          )}
        >
          {iconStyle.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "text-foreground leading-tight",
              isUnread ? "font-bold" : "font-medium"
            )}>
              {notification.title}
            </h3>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <span className="text-xs text-muted-foreground mt-2 block">
            {new Date(notification.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsClient() {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const handleDelete = (id: number) => {
    deleteNotification(id);
  };

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const groupNotificationsByDate = (items: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    
    items.forEach((notification) => {
      const date = new Date().toDateString() === new Date(notification.created_at).toDateString() 
        ? "Today" 
        : new Date(notification.created_at).toLocaleDateString("en-US", { 
            weekday: "long", 
            month: "short", 
            day: "numeric" 
          });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  };

  const notificationsByDate = groupNotificationsByDate(notifications || []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>

        {notifications && notifications.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Swipe left to delete
          </p>
        )}
      </div>

      <div className="bg-card border border-border rounded-[32px] p-6 sm:p-10 shadow-sm space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              {"You're all caught up!"}
            </p>
          </div>
        ) : (
          notificationsByDate.map((group, groupIdx) => (
            <div key={group.date} className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground px-4">
                {group.date}
              </h2>

              <div className="space-y-2">
                {group.items.map((notification) => (
                  <SwipeableNotification
                    key={notification.id}
                    notification={notification}
                    onDelete={handleDelete}
                    onRead={handleMarkAsRead}
                  />
                ))}
              </div>

              {groupIdx !== notificationsByDate.length - 1 && (
                <div className="w-full h-px bg-border mt-6" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
