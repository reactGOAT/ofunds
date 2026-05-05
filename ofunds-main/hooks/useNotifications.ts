"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService, type Notification } from "@/services/notifications";
import { toast } from "sonner";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

/**
 * Hook to fetch all notifications
 */
export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const response = await NotificationService.getNotifications();
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook to fetch unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await NotificationService.getUnreadCount();
      return response.data || 0;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => 
      NotificationService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      await queryClient.cancelQueries({ queryKey: notificationKeys.unreadCount() });

      // Snapshot the previous values
      const previousNotifications = queryClient.getQueryData<Notification[]>(notificationKeys.list());
      const previousCount = queryClient.getQueryData<number>(notificationKeys.unreadCount());

      // Optimistically update the notifications
      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          notificationKeys.list(),
          previousNotifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
      }

      // Optimistically update the count
      if (typeof previousCount === "number" && previousCount > 0) {
        queryClient.setQueryData<number>(notificationKeys.unreadCount(), previousCount - 1);
      }

      return { previousNotifications, previousCount };
    },
    onError: (_err, _notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.list(), context.previousNotifications);
      }
      if (typeof context?.previousCount === "number") {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => 
      NotificationService.deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      await queryClient.cancelQueries({ queryKey: notificationKeys.unreadCount() });

      const previousNotifications = queryClient.getQueryData<Notification[]>(notificationKeys.list());
      const previousCount = queryClient.getQueryData<number>(notificationKeys.unreadCount());

      // Get the notification being deleted to check if it's unread
      const notificationToDelete = previousNotifications?.find((n) => n.id === notificationId);
      const isUnread = notificationToDelete && !notificationToDelete.is_read;

      // Optimistically remove the notification
      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          notificationKeys.list(),
          previousNotifications.filter((n) => n.id !== notificationId)
        );
      }

      // Update count if notification was unread
      if (isUnread && typeof previousCount === "number" && previousCount > 0) {
        queryClient.setQueryData<number>(notificationKeys.unreadCount(), previousCount - 1);
      }

      return { previousNotifications, previousCount };
    },
    onSuccess: () => {
      toast.success("Notification deleted");
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.list(), context.previousNotifications);
      }
      if (typeof context?.previousCount === "number") {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.previousCount);
      }
      toast.error("Failed to delete notification");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
