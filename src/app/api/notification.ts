import type {
  NotificationApiResponse,
  NotificationApiItem,
} from "../../types/notification";
import apiClient from "./index";

export class NotificationAPI {
  static async getAllNotifications(): Promise<NotificationApiItem[]> {
    try {
      const response = await apiClient.get<NotificationApiResponse>(
        "api/notifications"
      );

      if (response.data.code !== 200) {
        throw new Error(`API error: ${response.data.message}`);
      }

      return response.data.result;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  static async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await apiClient.put(`api/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  static async markAllNotificationsAsRead(): Promise<void> {
    try {
      await apiClient.put("api/notifications/read-all");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  static async viewPdf(notificationId: number): Promise<void> {
    try {
      const response = await apiClient.get(
        `api/notifications/reports/download/${notificationId}`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing PDF:", error);
      throw error;
    }
  }

  static async deleteNotification(notificationId: number): Promise<void> {
    try {
      await apiClient.delete(`api/notifications/${notificationId}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}
