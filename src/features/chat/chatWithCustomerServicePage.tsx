import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatList } from "./components/ChatList";
import { ChatMessageList } from "./components/ChatMessageList";
import { MessageInput } from "./components/MessageInput";
import { EmptyState } from "./components/EmptyState";
import { useAuthStore } from "../../stores/auth_store";
import { Col, message, Row } from "antd";
import type { ChatMessage, ChatSession } from "../../app/api/chat";
import { fetchChatSessions, fetchMessages } from "../../app/api/chat";
import { useWebSocket } from "../../app/provider/WebSocketContext";
import type { ChatNotification } from "../../app/service/WebSocketService";
import { getVNISOString } from "../../utils/time_stamp";

export const ChatWithCustomerServicePage = () => {
  const [searchParams] = useSearchParams();
  const { loggedInUser } = useAuthStore();
  const {
    isConnected,
    subscribeToRoom,
    sendMessage,
    addMessageHandler,
    removeMessageHandler,
    addNotificationHandler,
    removeNotificationHandler,
  } = useWebSocket();

  const [searchText, setSearchText] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle chat selection
  const handleChatSelect = useCallback(async (chat: ChatSession) => {
    setSelectedChat(chat);

    try {
      const fetchedMessages = await fetchMessages(chat.id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      message.error("Không thể tải lịch sử tin nhắn");
      setMessages([]);
    }

    // Mark as read locally by resetting unread count
    setChatSessions((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  // Update chat list when a new message is received
  const updateChatWithNewMessage = useCallback(
    (newMessage: ChatMessage) => {
      if (!newMessage.roomId) return;

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === newMessage.roomId
            ? {
                ...chat,
                lastMessage: newMessage.content,
                lastMessageTime: newMessage.timestamp,
                unreadCount:
                  selectedChat?.id === newMessage.roomId
                    ? 0
                    : (chat.unreadCount || 0) + 1, // Increment only if not current room
              }
            : chat
        )
      );
    },
    [selectedChat?.id]
  );

  // Message handler function
  const handleNewMessage = useCallback(
    (newMessage: ChatMessage) => {
      console.log("New message received:", newMessage);

      // Add to messages list if from current room
      setMessages((prev) => [...prev, newMessage]);

      // Update chat list with new message info
      updateChatWithNewMessage(newMessage);
    },
    [updateChatWithNewMessage]
  );

  // Notification handler function for messages in other rooms
  const handleNotification = useCallback(
    (notification: ChatNotification) => {
      console.log("Received notification:", notification);

      // Update chat list with notification info and increment unread count
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === notification.roomId
            ? {
                ...chat,
                lastMessage: notification.contentPreview,
                lastMessageTime: notification.timestamp,
                unreadCount:
                  selectedChat?.id === notification.roomId
                    ? 0
                    : (chat.unreadCount || 0) + 1, // Increment only if not current room
              }
            : chat
        )
      );
    },
    [selectedChat?.id]
  );

  // Subscribe to selected room when it changes
  useEffect(() => {
    if (selectedChat?.id) {
      // Subscribe to the room
      subscribeToRoom(selectedChat.id);

      // Add message handler for this room
      addMessageHandler(selectedChat.id, handleNewMessage);

      // Clean up when component unmounts or selected chat changes
      return () => {
        removeMessageHandler(selectedChat.id, handleNewMessage);
      };
    }
  }, [
    selectedChat,
    subscribeToRoom,
    addMessageHandler,
    removeMessageHandler,
    handleNewMessage,
  ]);

  // Set up notification handler for all other rooms
  useEffect(() => {
    // Add notification handler
    addNotificationHandler(handleNotification);

    // Clean up when component unmounts
    return () => {
      removeNotificationHandler(handleNotification);
    };
  }, [addNotificationHandler, removeNotificationHandler, handleNotification]);

  // Load chat sessions
  useEffect(() => {
    const loadChatSessions = async () => {
      try {
        const sessions = await fetchChatSessions();
        setChatSessions(sessions);
      } catch (error) {
        console.error("Failed to fetch chat sessions:", error);
        message.error("Không thể tải danh sách cuộc trò chuyện");
      }
    };

    if (loggedInUser?.email) {
      loadChatSessions();
    }
  }, [loggedInUser]);

  // Auto-select chat from URL parameter
  useEffect(() => {
    const chatIdFromUrl = searchParams.get("chatId");
    if (chatIdFromUrl && chatSessions.length > 0) {
      const chatToSelect = chatSessions.find((c) => c.id === chatIdFromUrl);
      if (chatToSelect && chatToSelect.id !== selectedChat?.id) {
        handleChatSelect(chatToSelect);
      }
    }
  }, [chatSessions, searchParams, handleChatSelect, selectedChat?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat || !loggedInUser?.email) return;

    // Format message for the backend
    const chatMessage = {
      sender: loggedInUser.email,
      content: messageText.trim(),
      type: "CHAT",
      // đổi qua giờ vn
      timestamp: getVNISOString(),
      roomId: selectedChat.id,
    };

    console.log("Sending message:", chatMessage.timestamp);

    // Send to the room-specific endpoint using the context
    sendMessage(selectedChat.id, chatMessage);

    // Clear the input after sending
    setMessageText("");
  };

  // Rest of your component remains the same...
  return (
    <div style={{}}>
      <div
        style={{
          height: "calc(100vh - 160px)",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e8e8e8",
        }}
      >
        <Row style={{ height: "100%" }}>
          <Col xs={24} lg={8} style={{ height: "100%" }}>
            <ChatList
              chatSessions={chatSessions}
              selectedChat={selectedChat}
              searchText={searchText}
              onSearchChange={setSearchText}
              onChatSelect={handleChatSelect}
            />
          </Col>

          <Col
            xs={24}
            lg={16}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "#fff",
            }}
          >
            {selectedChat ? (
              <>
                <ChatMessageList
                  messages={messages}
                  loggedInUser={loggedInUser}
                  customerName={selectedChat.customerName}
                />
                <MessageInput
                  messageText={messageText}
                  onMessageChange={setMessageText}
                  onSendMessage={handleSendMessage}
                  isConnected={isConnected}
                />
              </>
            ) : (
              <EmptyState
                title="Chọn một cuộc trò chuyện"
                description="Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin"
              />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};
