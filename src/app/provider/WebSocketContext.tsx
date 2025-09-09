import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuthStore } from "../../stores/auth_store";
import type { ChatMessage } from "../api/chat";
import WebSocketService from "../service/WebSocketService";

interface WebSocketContextType {
  isConnected: boolean;
  subscribeToRoom: (roomId: string) => void;
  unsubscribeFromRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: Omit<ChatMessage, "id">) => void;
  addMessageHandler: (
    roomId: string,
    handler: (message: ChatMessage) => void
  ) => void;
  removeMessageHandler: (
    roomId: string,
    handler: (message: ChatMessage) => void
  ) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loggedInUser, accessToken } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const wsService = WebSocketService.getInstance();

  // Handle connection status changes
  useEffect(() => {
    const handleConnectionStatus = (connected: boolean) => {
      setIsConnected(connected);
    };

    wsService.addConnectionStatusHandler(handleConnectionStatus);

    return () => {
      wsService.removeConnectionStatusHandler(handleConnectionStatus);
    };
  }, []);

  // Set credentials and connect when user logs in
  useEffect(() => {
    if (loggedInUser?.email && accessToken) {
      wsService.setCredentials(accessToken, loggedInUser.email);
      wsService.connect();
    }
  }, [loggedInUser, accessToken]);

  // Helper functions that will be exposed through the context
  const subscribeToRoom = useCallback((roomId: string) => {
    wsService.subscribeToRoom(roomId);
  }, []);

  const unsubscribeFromRoom = useCallback((roomId: string) => {
    wsService.unsubscribeFromRoom(roomId);
  }, []);

  const sendMessage = useCallback(
    (roomId: string, message: Omit<ChatMessage, "id">) => {
      wsService.sendMessage(roomId, message);
    },
    []
  );

  const addMessageHandler = useCallback(
    (roomId: string, handler: (message: ChatMessage) => void) => {
      wsService.addMessageHandler(roomId, handler);
    },
    []
  );

  const removeMessageHandler = useCallback(
    (roomId: string, handler: (message: ChatMessage) => void) => {
      wsService.removeMessageHandler(roomId, handler);
    },
    []
  );

  // Expose all the necessary functions and state through the context
  const value = {
    isConnected,
    subscribeToRoom,
    unsubscribeFromRoom,
    sendMessage,
    addMessageHandler,
    removeMessageHandler,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
