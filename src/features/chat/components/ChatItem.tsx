import React from "react";
import { Avatar, Typography, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ChatSession } from "../../../app/api/chat";

interface ChatItemProps {
  chat: ChatSession;
  isSelected: boolean;
  onSelect: (chat: ChatSession) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #f5f5f5",
        cursor: "pointer",
        background: isSelected ? "#e6f7ff" : "#fff",
        borderLeft: isSelected ? "3px solid #1890ff" : "3px solid transparent",
        transition: "all 0.16s ease",
      }}
      onClick={() => onSelect(chat)}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = "#fafafa";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = "#fff";
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Avatar
          size={44}
          src={chat.avatar}
          icon={!chat.avatar ? <UserOutlined /> : undefined}
          style={{
            backgroundColor: chat.avatar ? undefined : "#f0f2f5",
            color: "#595959",
          }}
        >
          {!chat.avatar && chat.customerName.charAt(0).toUpperCase()}
        </Avatar>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Typography.Text strong style={{ fontSize: 14, color: "#262626" }}>
              {chat.customerName}
            </Typography.Text>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {chat.unreadCount && chat.unreadCount > 0 && (
                <Badge count={chat.unreadCount} size="small" />
              )}
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                {chat.lastMessageTime
                  ? dayjs(chat.lastMessageTime).format("HH:mm")
                  : ""}
              </Typography.Text>
            </div>
          </div>

          <Typography.Text
            type="secondary"
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 13,
              color: "#666",
            }}
            title={chat.lastMessage}
          >
            {chat.lastMessage || chat.customerEmail}
          </Typography.Text>

          <Typography.Text
            style={{
              color: "#999",
              fontSize: 12,
              marginTop: 6,
              display: "block",
            }}
          >
            {chat.customerEmail}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};
