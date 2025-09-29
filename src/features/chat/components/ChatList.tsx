import React from "react";
import { Input, Typography, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ChatItem } from "./ChatItem";
import type { ChatSession } from "../../../app/api/chat";

interface ChatListProps {
  chatSessions: ChatSession[];
  selectedChat: ChatSession | null;
  searchText: string;
  onSearchChange: (value: string) => void;
  onChatSelect: (chat: ChatSession) => void;
  newlyAssignedChatIds?: Set<string>; // IDs of newly assigned chats
}

export const ChatList: React.FC<ChatListProps> = ({
  chatSessions,
  selectedChat,
  searchText,
  onSearchChange,
  onChatSelect,
  newlyAssignedChatIds = new Set(),
}) => {
  const q = searchText.trim().toLowerCase();
  const filteredChats = chatSessions.filter((chat) => {
    if (!q) return true;
    return (
      chat.customerName.toLowerCase().includes(q) ||
      chat.customerEmail.toLowerCase().includes(q) ||
      chat.lastMessage.toLowerCase().includes(q)
    );
  });

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
          padding: "16px",
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <Typography.Title
          level={4}
          style={{ margin: "0 0 12px 0", color: "#262626" }}
        >
          Tin nhắn
        </Typography.Title>
        <Input
          placeholder="Tìm kiếm theo tên, email hoặc tin nhắn..."
          prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            borderRadius: 20,
            background: "#f5f5f5",
            border: "1px solid #e8e8e8",
            height: 38,
          }}
        />
      </div>

      <div
        style={{
          padding: "12px 16px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Typography.Text strong style={{ color: "#595959", fontSize: 13 }}>
          CUỘC TRÒ CHUYỆN ({filteredChats.length})
        </Typography.Text>
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
          filteredChats.map((chat) => {
            const isSelected = selectedChat?.id === chat.id;
            return (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={isSelected}
                onSelect={onChatSelect}
                isNewlyAssigned={newlyAssignedChatIds.has(chat.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
