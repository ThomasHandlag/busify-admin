import { useState, useRef, useEffect, useCallback } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { ChatList } from "./components/ChatList";
import { ChatMessageList } from "./components/ChatMessageList";
import { MessageInput } from "./components/MessageInput";
import { EmptyState } from "./components/EmptyState";
import { useAuthStore } from "../../stores/auth_store";
import { Col, message, Row } from "antd";
import type { ChatSession } from "../../app/api/chat";
import { fetchChatSessions, fetchMessages } from "../../app/api/chat"; // Thêm fetchMessages vào import

// Mock data interfaces
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isAgent: boolean;
}

export const ChatWithCustomerServicePage = () => {
  const { loggedInUser, accessToken } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!loggedInUser || stompClient?.connected) return;

    try {
      const socket = new SockJS(`http://localhost:8080/ws`);
      const client = Stomp.over(socket);
      client.debug = () => {};

      client.connect(
        { Authorization: `Bearer ${accessToken}` },
        () => {
          setIsConnected(true);
          message.success("Kết nối chat thành công!");

          client.subscribe(
            `/user/${loggedInUser.email}/queue/private`,
            (payload) => {
              const newMessage: ChatMessage = JSON.parse(payload.body);
              console.log("Received private message:", newMessage);
              // Update UI: update messages if relevant, update chatSessions -> lastMessage / unreadCount
              // Minimal behavior: append to messages if chatting with sender email matches selectedChat
              setMessages((prev) => [...prev, newMessage]);
            }
          );

          setStompClient(client);
        },
        (error) => {
          console.error("Lỗi kết nối WebSocket:", error);
          setIsConnected(false);
          setTimeout(connect, 5000);
        }
      );
    } catch (error) {
      console.error("Không thể khởi tạo SockJS:", error);
      setIsConnected(false);
      setTimeout(connect, 5000);
    }
  }, [loggedInUser, stompClient, accessToken]);

  useEffect(() => {
    if (loggedInUser?.email) {
      connect();
    }

    return () => {
      try {
        stompClient?.disconnect(() => {
          setIsConnected(false);
          console.log("Đã ngắt kết nối WebSocket.");
        });
      } catch (err) {
        console.error("Lỗi khi ngắt kết nối WebSocket:", err);
      }
    };
  }, [loggedInUser, connect, stompClient]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatSelect = async (chat: ChatSession) => {
    setSelectedChat(chat);

    try {
      // Gọi API để lấy lịch sử tin nhắn
      const fetchedMessages = await fetchMessages(chat.id);

      // Map dữ liệu từ API sang interface ChatMessage trong component
      const mappedMessages: ChatMessage[] = fetchedMessages.map((msg) => ({
        id: msg.id.toString(),
        senderId: msg.sender,
        senderName:
          msg.sender === loggedInUser?.email
            ? loggedInUser.email || "Nhân viên CSKH" // Tên agent nếu khớp email
            : chat.customerName, // Tên customer nếu không khớp
        content: msg.content,
        timestamp: msg.timestamp,
        type: "text", // Mặc định là text; mở rộng nếu cần
        isAgent: msg.sender === loggedInUser?.email, // Xác định agent dựa trên sender
      }));

      setMessages(mappedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      message.error("Không thể tải lịch sử tin nhắn");
      // Fallback: Set mock data hoặc danh sách trống
      setMessages([
        {
          id: "msg_001",
          senderId: "customer_001",
          senderName: chat.customerName,
          content: "Chào anh/chị, tôi cần hỗ trợ về vé xe bus ạ",
          timestamp: "2024-12-10T14:20:00",
          type: "text",
          isAgent: false,
        },
      ]);
    }

    // Mark as read locally
    setChatSessions((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat || !stompClient || !loggedInUser)
      return;

    const chatMessage = {
      sender: loggedInUser.email,
      recipient: selectedChat.customerEmail,
      content: messageText.trim(),
      type: "CHAT",
    };

    stompClient.send("/app/chat.private", {}, JSON.stringify(chatMessage));

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: loggedInUser.userId?.toString() || "agent",
      senderName: "Nhân viên CSKH",
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      isAgent: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");

    // Update last message in chat list
    setChatSessions((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id
          ? {
              ...c,
              lastMessage: newMessage.content,
              lastMessageTime: newMessage.timestamp,
            }
          : c
      )
    );
  };

  return (
    <div style={{}}>
      <div
        style={{
          height: "calc(100vh - 160px)",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
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
                <ChatMessageList messages={messages} />
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
