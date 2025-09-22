import { useNotificationStore } from "../stores/notification_store";

// Hook để thêm notification mới
export const useNotificationActions = () => {
  const { addNotification } = useNotificationStore();

  const addSuccessNotification = (
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    addNotification({
      title,
      message,
      type: "success",
      isRead: false,
      actionUrl,
    });
  };

  const addInfoNotification = (
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    addNotification({
      title,
      message,
      type: "info",
      isRead: false,
      actionUrl,
    });
  };

  const addWarningNotification = (
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    addNotification({
      title,
      message,
      type: "warning",
      isRead: false,
      actionUrl,
    });
  };

  const addErrorNotification = (
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    addNotification({
      title,
      message,
      type: "error",
      isRead: false,
      actionUrl,
    });
  };

  return {
    addSuccessNotification,
    addInfoNotification,
    addWarningNotification,
    addErrorNotification,
  };
};
