import React from "react";
import { Input, Typography, Badge, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ChatItem } from "./ChatItem";

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

interface ChatListProps {
  chatSessions: ChatSession[];
  selectedChat: ChatSession | null;
  searchText: string;
  onSearchChange: (value: string) => void;
  onChatSelect: (chat: ChatSession) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const ChatList: React.FC<ChatListProps> = ({
  chatSessions,
  selectedChat,
  searchText,
  onSearchChange,
  onChatSelect,
  getStatusColor,
  getPriorityColor,
}) => {
  const filteredChats = chatSessions.filter(
    (chat) =>
      chat.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100%",
        borderRight: "1px solid #e8e8e8",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "20px",
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <Typography.Title
          level={4}
          style={{ margin: "0 0 16px 0", color: "#262626" }}
        >
          Tin nhắn
        </Typography.Title>
        <Input
          placeholder="Tìm kiếm cuộc trò chuyện..."
          prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            borderRadius: "20px",
            background: "#f5f5f5",
            border: "1px solid #e8e8e8",
          }}
        />
      </div>

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
          <Typography.Text
            strong
            style={{ color: "#595959", fontSize: "13px" }}
          >
            CUỘC TRÒ CHUYỆN ({filteredChats.length})
          </Typography.Text>
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
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onSelect={onChatSelect}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))
        )}
      </div>
    </div>
  );
};
