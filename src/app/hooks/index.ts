import type { NotificationInstance } from "antd/es/notification/interface";
import { createContext, useContext } from "react";

interface GNotifyContextType {
    notify: NotificationInstance | null;
}

export const GNotifyContext = createContext<GNotifyContextType>({
    notify: null,
});

export const useGNotify = () => {
    const context = useContext(GNotifyContext);
    if (!context) {
        throw new Error("useGNotify must be used within a GNotifyProvider");
    }
    return context;
};

// Re-export auth hooks from the store for convenience
export { useAuth, useAuthActions } from '../../stores/authStore';

