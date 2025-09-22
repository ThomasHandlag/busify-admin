import { useEffect, useRef } from "react";
import { useNotificationStore } from "../stores/notification_store";

export const useNotificationPolling = (intervalMs: number = 30000) => {
  const { fetchNotifications } = useNotificationStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start polling
    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, intervalMs);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNotifications, intervalMs]);

  // Stop polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Start polling
  const startPolling = () => {
    stopPolling(); // Clear existing interval
    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, intervalMs);
  };

  return { startPolling, stopPolling };
};
