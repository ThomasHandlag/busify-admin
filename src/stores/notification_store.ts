import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  NotificationItem,
  NotificationState,
} from "../types/notification";
import { transformNotificationFromApi } from "../types/notification";
import { NotificationAPI } from "../app/api/notification";

interface NotificationStore extends NotificationState {
  // State
  loading: boolean;
  error: string | null;

  // API Actions
  fetchNotifications: () => Promise<void>;

  // Local Actions
  addNotification: (
    notification: Omit<NotificationItem, "id" | "createdAt">
  ) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // State management
  setNotifications: (notifications: NotificationItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,

        // API Actions
        fetchNotifications: async () => {
          set({ loading: true, error: null });
          try {
            const apiNotifications =
              await NotificationAPI.getAllNotifications();
            const transformedNotifications = apiNotifications.map(
              transformNotificationFromApi
            );

            set({
              notifications: transformedNotifications,
              unreadCount: transformedNotifications.filter((n) => !n.isRead)
                .length,
              loading: false,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Lỗi khi tải thông báo",
              loading: false,
            });
          }
        },

        setNotifications: (notifications) => {
          set({
            notifications,
            unreadCount: notifications.filter((n) => !n.isRead).length,
          });
        },

        // Local Actions
        addNotification: (notification) =>
          set((state) => {
            const newNotification: NotificationItem = {
              ...notification,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            };
            const newNotifications = [newNotification, ...state.notifications];
            return {
              notifications: newNotifications,
              unreadCount: newNotifications.filter((n) => !n.isRead).length,
            };
          }),

        markAsRead: async (id) => {
          const state = get();
          const notification = state.notifications.find((n) => n.id === id);

          if (!notification || notification.isRead) return;

          try {
            // Call API to mark as read
            await NotificationAPI.markNotificationAsRead(parseInt(id));

            // Update local state
            set((state) => {
              const newNotifications = state.notifications.map((notification) =>
                notification.id === id
                  ? {
                      ...notification,
                      isRead: true,
                      readAt: new Date().toISOString(),
                    }
                  : notification
              );
              return {
                notifications: newNotifications,
                unreadCount: newNotifications.filter((n) => !n.isRead).length,
                error: null,
              };
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Lỗi khi đánh dấu đã đọc",
            });
          }
        },

        markAllAsRead: async () => {
          try {
            // Call API to mark all as read
            await NotificationAPI.markAllNotificationsAsRead();

            // Update local state
            const now = new Date().toISOString();
            set((state) => {
              const newNotifications = state.notifications.map(
                (notification) => ({
                  ...notification,
                  isRead: true,
                  readAt: now,
                })
              );
              return {
                notifications: newNotifications,
                unreadCount: 0,
                error: null,
              };
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Lỗi khi đánh dấu tất cả đã đọc",
            });
          }
        },

        removeNotification: async (id) => {
          try {
            await NotificationAPI.deleteNotification(parseInt(id));
            set((state) => {
              const newNotifications = state.notifications.filter(
                (n) => n.id !== id
              );
              return {
                notifications: newNotifications,
                unreadCount: newNotifications.filter((n) => !n.isRead).length,
              };
            });
          } catch (error) {
            console.error("Error deleting notification:", error);
          }
        },

        clearAllNotifications: () =>
          set(() => ({
            notifications: [],
            unreadCount: 0,
          })),

        // State management
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "notification-storage",
        version: 1,
        partialize: (state) => ({
          notifications: state.notifications,
          unreadCount: state.unreadCount,
        }),
      }
    ),
    {
      name: "notification-store",
    }
  )
);
