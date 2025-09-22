import apiClient from ".";

export interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number; // New field to track unread messages
}

export type ChatMessageType = "CHAT" | "JOIN" | "LEAVE" | "SYSTEM_ASSIGN";

export interface ChatMessage {
  id: number;
  content: string;
  sender: string;
  recipient?: string; // for 1-1 chats
  type: ChatMessageType | string;
  roomId?: string; // for group chats
  timestamp: string; // ISO 8601 datetime string
}

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  const response = await apiClient.get<ChatSession[]>("api/chat/my-rooms");
  return response.data;
};

export const fetchMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const response = await apiClient.get<ChatMessage[]>(
    `api/chat/history/room/${chatId}`
  );
  return response.data;
};
