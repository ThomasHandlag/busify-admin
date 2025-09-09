import { useState, useRef, useEffect } from "react";
import { ChatList } from "./components/ChatList";
import { ChatMessageList } from "./components/ChatMessageList";
import { MessageInput } from "./components/MessageInput";
import { EmptyState } from "./components/EmptyState";
import { useAuthStore } from "../../stores/auth_store";
import { Col, message, Row } from "antd";
import type { ChatMessage, ChatSession } from "../../app/api/chat";
import { fetchChatSessions, fetchMessages } from "../../app/api/chat";
import { useWebSocket } from "../../stores/WebSocketContext";

export const ChatWithCustomerServicePage = () => {
  const { loggedInUser } = useAuthStore();
  const {
    isConnected,
    subscribeToRoom,
    sendMessage,
    addMessageHandler,
    removeMessageHandler,
  } = useWebSocket();

  const [searchText, setSearchText] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update chat list when a new message is received
  const updateChatWithNewMessage = (newMessage: ChatMessage) => {
    if (!newMessage.roomId) return;

    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === newMessage.roomId
          ? {
              ...chat,
              lastMessage: newMessage.content,
              lastMessageTime: newMessage.timestamp,
            }
          : chat
      )
    );
  };

  // Message handler function
  const handleNewMessage = (newMessage: ChatMessage) => {
    console.log("New message received:", newMessage);

    // Add to messages list if from current room
    setMessages((prev) => [...prev, newMessage]);

    // Update chat list with new message info
    updateChatWithNewMessage(newMessage);
  };

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
  }, [selectedChat, subscribeToRoom, addMessageHandler, removeMessageHandler]);

  // Load chat sessions
  useEffect(() => {
    const loadChatSessions = async () => {
      try {
        const sessions = await fetchChatSessions();
        console.log("Fetched chat sessions:", sessions);
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle chat selection
  const handleChatSelect = async (chat: ChatSession) => {
    setSelectedChat(chat);

    try {
      const fetchedMessages = await fetchMessages(chat.id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      message.error("Không thể tải lịch sử tin nhắn");
      setMessages([]);
    }

    // Mark as read locally
    setChatSessions((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat || !loggedInUser?.email) return;

    // Format message for the backend
    const chatMessage = {
      sender: loggedInUser.email,
      content: messageText.trim(),
      type: "CHAT",
      timestamp: new Date().toISOString(),
      roomId: selectedChat.id,
    };

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
