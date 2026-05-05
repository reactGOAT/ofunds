import axiosInstance from "./axios-instance";

export interface Notification {
  id: number;
  user_id: number;
  type: "credit" | "debit" | "info" | "alert";
  title: string;
  message: string;
  is_read: boolean | number;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  statusCode: number;
  message: string;
  data: Notification[];
}

export interface UnreadCountResponse {
  statusCode: number;
  message: string;
  data: number;
}

export interface NotificationActionResponse {
  statusCode: number;
  message: string;
  data: Notification | null;
}

export class NotificationService {
  /**
   * Get all notifications for the current user
   */
  static async getNotifications(): Promise<NotificationsResponse> {
    const response = await axiosInstance.get("/alerts");
    return response.data;
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await axiosInstance.get("/alerts/unread/count");
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: number): Promise<NotificationActionResponse> {
    const response = await axiosInstance.get(`/alerts/${notificationId}/read`);
    return response.data;
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: number): Promise<NotificationActionResponse> {
    const response = await axiosInstance.delete(`/alerts/${notificationId}`);
    return response.data;
  }

  /**
   * Get flyers/promotional content
   */
  static async getFlyers(): Promise<{
    statusCode: number;
    message: string;
    data: Array<{ name: string; image: string }>;
  }> {
    const response = await axiosInstance.get("/alerts/flyer");
    return response.data;
  }
}
