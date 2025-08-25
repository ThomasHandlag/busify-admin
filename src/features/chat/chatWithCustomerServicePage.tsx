import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Avatar,
  Typography,
  Space,
  Badge,
  Empty,
  Tag,
  Tooltip,
  message,
  Divider,
} from "antd";
import {
  SearchOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  PaperClipOutlined,
  SmileOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

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

// Mock data
const mockChatSessions: ChatSession[] = [
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
  {
    id: "chat_002",
    customerName: "Trần Văn Khải",
    customerEmail: "khai.tran@email.com",
    customerPhone: "0912345678",
    status: "online",
    lastMessage: "Xe có wifi không ạ?",
    lastMessageTime: "2024-12-10T14:15:00",
    unreadCount: 1,
    isActive: false,
    priority: "medium",
    tags: ["Tiện ích"],
  },
  {
    id: "chat_003",
    customerName: "Lê Thị Mai",
    customerEmail: "mai.le@email.com",
    customerPhone: "0923456789",
    status: "away",
    lastMessage: "Cảm ơn bạn đã hỗ trợ!",
    lastMessageTime: "2024-12-10T13:45:00",
    unreadCount: 0,
    isActive: false,
    priority: "low",
    tags: ["Hoàn thành"],
  },
  {
    id: "chat_004",
    customerName: "Phạm Văn Nam",
    customerEmail: "nam.pham@email.com",
    customerPhone: "0934567890",
    status: "offline",
    lastMessage: "Tôi cần hủy vé đặt hôm qua",
    lastMessageTime: "2024-12-10T12:20:00",
    unreadCount: 2,
    isActive: false,
    priority: "high",
    tags: ["Hủy vé"],
  },
  {
    id: "chat_005",
    customerName: "Hoàng Thị Thu",
    customerEmail: "thu.hoang@email.com",
    customerPhone: "0945678901",
    status: "online",
    lastMessage: "Xe khởi hành lúc mấy giờ vậy ạ?",
    lastMessageTime: "2024-12-10T11:30:00",
    unreadCount: 0,
    isActive: false,
    priority: "medium",
    tags: ["Thông tin"],
  },
];

const mockMessages: { [key: string]: ChatMessage[] } = {
  chat_001: [
    {
      id: "msg_001",
      senderId: "customer_001",
      senderName: "Nguyễn Thị Lan",
      content: "Chào anh/chị, tôi cần hỗ trợ về vé xe bus ạ",
      timestamp: "2024-12-10T14:20:00",
      type: "text",
      isAgent: false,
    },
    {
      id: "msg_002",
      senderId: "agent_001",
      senderName: "Nhân viên CSKH",
      content:
        "Chào chị! Tôi là nhân viên chăm sóc khách hàng. Chị cần hỗ trợ gì ạ?",
      timestamp: "2024-12-10T14:21:00",
      type: "text",
      isAgent: true,
    },
    {
      id: "msg_003",
      senderId: "customer_001",
      senderName: "Nguyễn Thị Lan",
      content:
        "Tôi muốn đổi vé từ ngày hôm nay sang ngày mai được không ạ? Mã vé của tôi là BUS12345",
      timestamp: "2024-12-10T14:25:00",
      type: "text",
      isAgent: false,
    },
    {
      id: "msg_004",
      senderId: "agent_001",
      senderName: "Nhân viên CSKH",
      content:
        "Để tôi kiểm tra mã vé BUS12345 cho chị nhé. Vui lòng chờ trong giây lát...",
      timestamp: "2024-12-10T14:26:00",
      type: "text",
      isAgent: true,
    },
    {
      id: "msg_005",
      senderId: "customer_001",
      senderName: "Nguyễn Thị Lan",
      content: "Tôi muốn đổi vé sang ngày mai được không ạ?",
      timestamp: "2024-12-10T14:30:00",
      type: "text",
      isAgent: false,
    },
  ],
};

export const ChatWithCustomerServicePage = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(
    mockChatSessions[0]
  );
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(
    mockMessages.chat_001 || []
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter chat sessions based on search
  const filteredChats = mockChatSessions.filter(
    (chat) =>
      chat.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChatSelect = (chat: ChatSession) => {
    setSelectedChat(chat);
    setMessages(mockMessages[chat.id] || []);

    // Mark as read
    const updatedChat = { ...chat, unreadCount: 0 };
    // In real app, update the chat in the list
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: "agent_001",
      senderName: "Nhân viên CSKH",
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      isAgent: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
    message.success("Tin nhắn đã được gửi");
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
      {/* <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "Chăm sóc khách hàng" }, { title: "Chat hỗ trợ" }]}
      />

      <Title level={2} style={{ marginBottom: "24px", color: "#262626" }}>
        <MessageOutlined style={{ color: "#1890ff" }} /> Chat hỗ trợ khách hàng
      </Title> */}

      {/* Fixed Layout Container */}
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
          {/* Left Sidebar - Chat List */}
          <Col
            xs={24}
            lg={8}
            style={{
              height: "100%",
              borderRight: "1px solid #e8e8e8",
              background: "#fafafa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Sidebar Header */}
            <div
              style={{
                padding: "20px",
                background: "#fff",
                borderBottom: "1px solid #e8e8e8",
              }}
            >
              <Title
                level={4}
                style={{ margin: "0 0 16px 0", color: "#262626" }}
              >
                Tin nhắn
              </Title>
              <Input
                placeholder="Tìm kiếm cuộc trò chuyện..."
                prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  borderRadius: "20px",
                  background: "#f5f5f5",
                  border: "1px solid #e8e8e8",
                }}
              />
            </div>

            {/* Chat List Header */}
            <div
              style={{
                padding: "16px 20px 8px",
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong style={{ color: "#595959", fontSize: "13px" }}>
                  CUỘC TRÒ CHUYỆN ({filteredChats.length})
                </Text>
                <Badge
                  count={filteredChats.filter((c) => c.unreadCount > 0).length}
                  style={{
                    backgroundColor: "#ff4d4f",
                    borderRadius: "10px",
                    fontSize: "11px",
                    minWidth: "18px",
                    height: "18px",
                    lineHeight: "18px",
                  }}
                />
              </div>
            </div>

            {/* Chat List */}
            <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
              {filteredChats.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <Empty
                    description="Không tìm thấy cuộc trò chuyện"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid #f5f5f5",
                      cursor: "pointer",
                      background:
                        selectedChat?.id === chat.id ? "#e6f7ff" : "#fff",
                      borderLeft:
                        selectedChat?.id === chat.id
                          ? "3px solid #1890ff"
                          : "3px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleChatSelect(chat)}
                    onMouseEnter={(e) => {
                      if (selectedChat?.id !== chat.id) {
                        e.currentTarget.style.background = "#f8f9fa";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedChat?.id !== chat.id) {
                        e.currentTarget.style.background = "#fff";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <Avatar
                          size={44}
                          icon={<UserOutlined />}
                          style={{
                            backgroundColor: "#f0f2f5",
                            color: "#595959",
                            border: "2px solid #fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {chat.customerName.charAt(0).toUpperCase()}
                        </Avatar>
                        {/* Status Indicator */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: getStatusColor(chat.status),
                            border: "2px solid #fff",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Header Row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "4px",
                          }}
                        >
                          <Text
                            strong
                            style={{ fontSize: "14px", color: "#262626" }}
                          >
                            {chat.customerName}
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {chat.unreadCount > 0 && (
                              <Badge
                                count={chat.unreadCount}
                                style={{
                                  backgroundColor: "#ff4d4f",
                                  fontSize: "10px",
                                  minWidth: "16px",
                                  height: "16px",
                                  lineHeight: "16px",
                                }}
                              />
                            )}
                            <Text type="secondary" style={{ fontSize: "11px" }}>
                              {dayjs(chat.lastMessageTime).format("HH:mm")}
                            </Text>
                          </div>
                        </div>

                        {/* Last Message */}
                        <Text
                          type="secondary"
                          style={{
                            fontSize: "13px",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: "8px",
                            color: "#8c8c8c",
                          }}
                        >
                          {chat.lastMessage}
                        </Text>

                        {/* Tags */}
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            flexWrap: "wrap",
                          }}
                        >
                          <Tag
                            color={getPriorityColor(chat.priority)}
                            size="small"
                            style={{
                              fontSize: "10px",
                              borderRadius: "10px",
                              border: "none",
                              fontWeight: "500",
                            }}
                          >
                            {chat.priority === "high"
                              ? "Ưu tiên cao"
                              : chat.priority === "medium"
                              ? "Ưu tiên vừa"
                              : "Ưu tiên thấp"}
                          </Tag>
                          {chat.tags.slice(0, 1).map((tag, index) => (
                            <Tag
                              key={index}
                              size="small"
                              style={{
                                fontSize: "10px",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0",
                                border: "none",
                                color: "#595959",
                              }}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Col>

          {/* Right Main Chat Area */}
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
                {/* Messages Area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "24px",
                    background:
                      "linear-gradient(to bottom, #f8f9fa 0%, #f0f2f5 100%)",
                  }}
                >
                  {messages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                      <Empty
                        description="Chưa có tin nhắn nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Date Divider */}
                      <div style={{ textAlign: "center", margin: "20px 0" }}>
                        <Divider>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "12px",
                              background: "#f0f2f5",
                              padding: "4px 12px",
                              borderRadius: "12px",
                            }}
                          >
                            Hôm nay
                          </Text>
                        </Divider>
                      </div>

                      {messages.map((message, index) => (
                        <div
                          key={message.id}
                          style={{
                            display: "flex",
                            justifyContent: message.isAgent
                              ? "flex-end"
                              : "flex-start",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "65%",
                              display: "flex",
                              flexDirection: message.isAgent
                                ? "row-reverse"
                                : "row",
                              alignItems: "flex-end",
                              gap: "8px",
                            }}
                          >
                            <Avatar
                              size={32}
                              icon={<UserOutlined />}
                              style={{
                                backgroundColor: message.isAgent
                                  ? "#1890ff"
                                  : "#52c41a",
                                flexShrink: 0,
                                border: "2px solid #fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                            >
                              {message.isAgent
                                ? "CS"
                                : message.senderName.charAt(0)}
                            </Avatar>
                            <div>
                              <div
                                style={{
                                  padding: "12px 16px",
                                  borderRadius: message.isAgent
                                    ? "18px 18px 4px 18px"
                                    : "18px 18px 18px 4px",
                                  backgroundColor: message.isAgent
                                    ? "#1890ff"
                                    : "#fff",
                                  color: message.isAgent ? "#fff" : "#262626",
                                  border: message.isAgent
                                    ? "none"
                                    : "1px solid #e8e8e8",
                                  boxShadow: message.isAgent
                                    ? "0 4px 12px rgba(24,144,255,0.15)"
                                    : "0 2px 8px rgba(0,0,0,0.06)",
                                  position: "relative",
                                }}
                              >
                                <Text
                                  style={{
                                    color: message.isAgent ? "#fff" : "#262626",
                                    fontSize: "14px",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {message.content}
                                </Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: message.isAgent
                                    ? "flex-end"
                                    : "flex-start",
                                  gap: "4px",
                                  marginTop: "4px",
                                }}
                              >
                                <Text
                                  type="secondary"
                                  style={{
                                    fontSize: "11px",
                                    color: "#8c8c8c",
                                  }}
                                >
                                  {dayjs(message.timestamp).format("HH:mm")}
                                </Text>
                                {message.isAgent && (
                                  <CheckOutlined
                                    style={{
                                      fontSize: "10px",
                                      color: "#52c41a",
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div
                  style={{
                    padding: "20px 24px",
                    borderTop: "1px solid #e8e8e8",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-end",
                      background: "#f8f9fa",
                      padding: "12px 16px",
                      borderRadius: "24px",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    <TextArea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      style={{
                        flex: 1,
                        border: "none",
                        background: "transparent",
                        resize: "none",
                        fontSize: "14px",
                      }}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Space size="small">
                      <Tooltip title="Đính kèm file">
                        <Button
                          type="text"
                          icon={<PaperClipOutlined />}
                          style={{ color: "#8c8c8c" }}
                        />
                      </Tooltip>
                      <Tooltip title="Emoji">
                        <Button
                          type="text"
                          icon={<SmileOutlined />}
                          style={{ color: "#8c8c8c" }}
                        />
                      </Tooltip>
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        style={{
                          borderRadius: "18px",
                          height: "36px",
                          paddingLeft: "16px",
                          paddingRight: "16px",
                          background: messageText.trim()
                            ? "#1890ff"
                            : "#d9d9d9",
                          border: "none",
                          boxShadow: messageText.trim()
                            ? "0 2px 6px rgba(24,144,255,0.3)"
                            : "none",
                        }}
                      >
                        Gửi
                      </Button>
                    </Space>
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexDirection: "column",
                  gap: "20px",
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                }}
              >
                <div
                  style={{
                    padding: "40px",
                    background: "#fff",
                    borderRadius: "50%",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <MessageOutlined
                    style={{ fontSize: "64px", color: "#d9d9d9" }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <Text
                    style={{
                      fontSize: "18px",
                      color: "#262626",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Chọn một cuộc trò chuyện
                  </Text>
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
                    nhắn tin
                  </Text>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};
