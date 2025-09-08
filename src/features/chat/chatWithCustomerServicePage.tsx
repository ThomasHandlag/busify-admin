import { useState, useRef, useEffect, useCallback } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { ChatList } from "./components/ChatList";
import { ChatMessageList } from "./components/ChatMessageList";
import { MessageInput } from "./components/MessageInput";
import { EmptyState } from "./components/EmptyState";
import { useAuthStore } from "../../stores/auth_store";
import { Col, message, Row } from "antd";

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

interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive: boolean;
  priority: "high" | "medium" | "low";
  tags: string[];
}

export const ChatWithCustomerServicePage = () => {
  const { loggedInUser, accessToken } = useAuthStore(); // Thay đổi từ useAuth sang useAuthStore và lấy loggedInUser, accessToken
  const [searchText, setSearchText] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]); // State cho danh sách hội thoại
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State cho WebSocket
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Hàm kết nối WebSocket
  const connect = useCallback(() => {
    if (!loggedInUser || stompClient?.connected) return; // Thay user thành loggedInUser

    try {
      const socket = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);
      const client = Stomp.over(socket);
      // Tắt log debug của STOMP
      client.debug = () => {};

      client.connect(
        { Authorization: `Bearer ${accessToken}` }, // Thay localStorage.getItem("accessToken") thành accessToken từ store
        () => {
          setIsConnected(true);
          message.success("Kết nối chat thành công!");

          // Lắng nghe tin nhắn riêng tư gửi đến CSKH
          client.subscribe(
            `/user/${loggedInUser.email}/queue/private`, // Thay user.username thành loggedInUser.email
            (payload) => {
              const newMessage: ChatMessage = JSON.parse(payload.body);
              // TODO: Cập nhật UI khi có tin nhắn mới
              // 1. Hiển thị notification
              // 2. Cập nhật danh sách hội thoại (lastMessage, unreadCount)
              // 3. Nếu đang mở đúng chat, thêm tin nhắn vào `messages`
              console.log("Received private message:", newMessage);
            }
          );

          setStompClient(client);
        },
        (error) => {
          console.error("Lỗi kết nối WebSocket:", error);
          setIsConnected(false);
          // Thử kết nối lại sau 5 giây
          setTimeout(connect, 5000);
        }
      );
    } catch (error) {
      console.error("Không thể khởi tạo SockJS:", error);
      setIsConnected(false);
      setTimeout(connect, 5000);
    }
  }, [loggedInUser, stompClient, accessToken]); // Cập nhật dependencies

  // Effect để kết nối và ngắt kết nối
  useEffect(() => {
    if (loggedInUser?.email) {
      // Thay user?.username thành loggedInUser?.email
      connect();
    }

    return () => {
      stompClient?.disconnect(() => {
        setIsConnected(false);
        console.log("Đã ngắt kết nối WebSocket.");
      });
    };
  }, [loggedInUser, connect, stompClient]); // Cập nhật dependencies

  // TODO: Effect để fetch danh sách hội thoại ban đầu từ API
  useEffect(() => {
    // fetchChatSessions();
    // Tạm thời dùng mock data để hiển thị
    setChatSessions([
      {
        id: "chat_001",
        customerName: "Nguyễn Thị Lan",
        customerEmail: "lan.nguyen@email.com",
        customerPhone: "0901234567",
        status: "online",
        lastMessage: "Tôi muốn đổi vé sang ngày mai được không ạ?",
        lastMessageTime: "2024-12-10T14:30:00",
        unreadCount: 3,
        isActive: true,
        priority: "high",
        tags: ["Đổi vé", "Khẩn cấp"],
      },
    ]);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter chat sessions based on search
  const filteredChats = chatSessions.filter(
    (chat) =>
      chat.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChatSelect = async (chat: ChatSession) => {
    setSelectedChat(chat);
    // TODO: Gọi API để lấy lịch sử tin nhắn
    // const history = await getChatHistory(user.username, chat.customerName);
    // setMessages(history);

    // Dùng tạm mock data
    setMessages([
      {
        id: "msg_001",
        senderId: "customer_001",
        senderName: "Nguyễn Thị Lan",
        content: "Chào anh/chị, tôi cần hỗ trợ về vé xe bus ạ",
        timestamp: "2024-12-10T14:20:00",
        type: "text",
        isAgent: false,
      },
    ]);

    // Mark as read
    const updatedChat = { ...chat, unreadCount: 0 };
    // In real app, update the chat in the list
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat || !stompClient || !loggedInUser)
      return; // Thay user thành loggedInUser

    const chatMessage = {
      sender: loggedInUser.email, // Thay user.username thành loggedInUser.email
      recipient: selectedChat.customerName, // Tên đăng nhập của khách hàng
      content: messageText.trim(),
      type: "CHAT",
    };

    // Gửi tin nhắn qua WebSocket
    stompClient.send("/app/chat.private", {}, JSON.stringify(chatMessage));

    // Hiển thị tin nhắn ngay lập tức trên UI của CSKH
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: loggedInUser.userId.toString(), // Thay user.id thành loggedInUser.userId (và chuyển sang string nếu cần)
      senderName: "Nhân viên CSKH", // Vì loggedInUser không có fullName, dùng giá trị mặc định
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      isAgent: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
    // Không cần message.success ở đây vì nó sẽ tạo cảm giác chậm trễ
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#52c41a";
      case "away":
        return "#faad14";
      case "offline":
        return "#8c8c8c";
      default:
        return "#8c8c8c";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ff4d4f";
      case "medium":
        return "#fa8c16";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
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
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
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
