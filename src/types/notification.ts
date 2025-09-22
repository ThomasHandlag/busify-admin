// API Response Types
export interface NotificationApiItem {
  id: number;
  title: string;
  message: string;
  type:
    | "MONTHLY_REPORT"
    | "WEEKLY_REPORT"
    | "OPERATOR_REGISTRATION"
    | "REVENUE_MILESTONE"
    | "SYSTEM_ALERT";
  status: "READ" | "UNREAD" | "ARCHIVED";
  userId: number;
  relatedId: string;
  actionUrl: string;
  metadata: string;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationApiResponse {
  code: number;
  message: string;
  result: NotificationApiItem[];
}

// UI Types (transformed from API)
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: string;
  relatedId?: string;
  readAt?: string | null;
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
}

// Helper function to transform API data to UI data
export const transformNotificationFromApi = (
  apiItem: NotificationApiItem
): NotificationItem => {
  // Map API types to UI types
  const getUIType = (
    apiType: NotificationApiItem["type"]
  ): NotificationItem["type"] => {
    switch (apiType) {
      case "MONTHLY_REPORT":
      case "WEEKLY_REPORT":
        return "info";
      case "OPERATOR_REGISTRATION":
      case "REVENUE_MILESTONE":
        return "success";
      case "SYSTEM_ALERT":
        return "warning";
      default:
        return "info";
    }
  };

  return {
    id: apiItem.id.toString(),
    title: apiItem.title,
    message: apiItem.message,
    type: getUIType(apiItem.type),
    isRead: apiItem.status === "READ",
    createdAt: apiItem.createdAt,
    actionUrl: apiItem.actionUrl,
    metadata: apiItem.metadata,
    relatedId: apiItem.relatedId,
    readAt: apiItem.readAt,
  };
};
