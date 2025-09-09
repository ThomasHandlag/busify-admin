/* eslint-disable @typescript-eslint/no-explicit-any */
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import type { ChatMessage } from "../api/chat";

type MessageHandler = (message: ChatMessage) => void;
type ConnectionStatusHandler = (connected: boolean) => void;

class WebSocketService {
  private client: Stomp.Client | null = null;
  private connected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private roomSubscriptions: Record<string, Stomp.Subscription> = {};
  private messageHandlers: Record<string, Set<MessageHandler>> = {};
  private connectionStatusHandlers = new Set<ConnectionStatusHandler>();
  private accessToken: string | null = null;
  private userEmail: string | null = null;

  // Singleton instance
  private static instance: WebSocketService | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public setCredentials(accessToken: string, userEmail: string): void {
    this.accessToken = accessToken;
    this.userEmail = userEmail;

    // Nếu đã có thông tin đăng nhập và chưa kết nối, thử kết nối
    if (!this.connected && this.accessToken && this.userEmail) {
      this.connect();
    }
  }

  public connect(): void {
    if (this.client?.connected || !this.accessToken || !this.userEmail) return;

    try {
      // Clear any existing reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      // Create a new SockJS connection
      const socket = new SockJS(`http://localhost:8080/ws`);
      this.client = Stomp.over(socket);

      // Disable debug logging
      this.client.debug = () => {};

      // Connect to the WebSocket server
      this.client.connect(
        { Authorization: `Bearer ${this.accessToken}` },
        this.onConnected.bind(this),
        this.onError.bind(this)
      );
    } catch (error) {
      console.error("Failed to initialize WebSocket connection:", error);
      this.setConnected(false);
      this.scheduleReconnect();
    }
  }

  private onConnected(): void {
    if (!this.client) return;

    this.setConnected(true);
    console.log("WebSocket connected successfully");

    // Resubscribe to all previous room subscriptions
    Object.keys(this.roomSubscriptions).forEach((roomId) => {
      this.subscribeToRoom(roomId);
    });
  }

  private onError(error: any): void {
    console.error("WebSocket connection error:", error);
    this.setConnected(false);
    this.scheduleReconnect();
  }

  private setConnected(status: boolean): void {
    this.connected = status;
    // Notify all connection status handlers
    this.connectionStatusHandlers.forEach((handler) => handler(status));
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Attempt to reconnect after 5 seconds
    this.reconnectTimeout = setTimeout(() => {
      console.log("Attempting to reconnect WebSocket...");
      this.connect();
    }, 5000);
  }

  public disconnect(): void {
    if (!this.client) return;

    // Unsubscribe from all rooms
    Object.values(this.roomSubscriptions).forEach((subscription) => {
      try {
        if (subscription) subscription.unsubscribe();
      } catch (err) {
        console.error("Error unsubscribing:", err);
      }
    });

    // Clear subscriptions record
    this.roomSubscriptions = {};

    // Disconnect the client
    try {
      this.client.disconnect(() => {
        this.setConnected(false);
        console.log("WebSocket disconnected");
      });
    } catch (err) {
      console.error("Error disconnecting WebSocket:", err);
      this.setConnected(false);
    }
  }

  public subscribeToRoom(roomId: string): void {
    if (!this.client || !this.connected) {
      // Keep track of rooms we want to subscribe to when we connect
      this.roomSubscriptions[roomId] = null as unknown as Stomp.Subscription;
      return;
    }

    // Unsubscribe if already subscribed
    if (this.roomSubscriptions[roomId]) {
      try {
        this.roomSubscriptions[roomId].unsubscribe();
      } catch (err) {
        console.error(`Error unsubscribing from room ${roomId}:`, err);
      }
    }

    // Subscribe to the room topic
    const subscription = this.client.subscribe(
      `/topic/public/${roomId}`,
      (payload) => {
        try {
          const message = JSON.parse(payload.body) as ChatMessage;
          console.log(`Received message in room ${roomId}:`, message);

          // Notify all handlers for this room
          this.notifyMessageHandlers(roomId, message);
        } catch (error) {
          console.error(`Error processing message in room ${roomId}:`, error);
        }
      }
    );

    // Store the subscription
    this.roomSubscriptions[roomId] = subscription;
  }

  public unsubscribeFromRoom(roomId: string): void {
    const subscription = this.roomSubscriptions[roomId];
    if (subscription) {
      try {
        subscription.unsubscribe();
      } catch (err) {
        console.error(`Error unsubscribing from room ${roomId}:`, err);
      }
      delete this.roomSubscriptions[roomId];
    }
  }

  public sendMessage(roomId: string, message: Omit<ChatMessage, "id">): void {
    if (!this.client || !this.connected) {
      console.error("Cannot send message: WebSocket not connected");
      return;
    }

    this.client.send(
      `/app/chat.sendMessage/${roomId}`,
      {},
      JSON.stringify(message)
    );
  }

  // Register a handler for messages in a specific room
  public addMessageHandler(roomId: string, handler: MessageHandler): void {
    if (!this.messageHandlers[roomId]) {
      this.messageHandlers[roomId] = new Set();
    }
    this.messageHandlers[roomId].add(handler);
  }

  // Remove a handler for messages in a specific room
  public removeMessageHandler(roomId: string, handler: MessageHandler): void {
    if (this.messageHandlers[roomId]) {
      this.messageHandlers[roomId].delete(handler);
    }
  }

  // Register a connection status handler
  public addConnectionStatusHandler(handler: ConnectionStatusHandler): void {
    this.connectionStatusHandlers.add(handler);
    // Immediately notify with current status
    handler(this.connected);
  }

  // Remove a connection status handler
  public removeConnectionStatusHandler(handler: ConnectionStatusHandler): void {
    this.connectionStatusHandlers.delete(handler);
  }

  // Notify all handlers for a specific room
  private notifyMessageHandlers(roomId: string, message: ChatMessage): void {
    if (this.messageHandlers[roomId]) {
      this.messageHandlers[roomId].forEach((handler) => handler(message));
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}

export default WebSocketService;
