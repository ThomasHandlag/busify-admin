import React from "react";
import { Avatar, Typography, Badge, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

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

interface ChatItemProps {
  chat: ChatSession;
  isSelected: boolean;
  onSelect: (chat: ChatSession) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isSelected,
  onSelect,
  getStatusColor,
  getPriorityColor,
}) => {
  return (
    <div
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid #f5f5f5",
        cursor: "pointer",
        background: isSelected ? "#e6f7ff" : "#fff",
        borderLeft: isSelected ? "3px solid #1890ff" : "3px solid transparent",
        transition: "all 0.2s ease",
      }}
      onClick={() => onSelect(chat)}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "#f8f9fa";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "4px",
            }}
          >
            <Typography.Text
              strong
              style={{ fontSize: "14px", color: "#262626" }}
            >
              {chat.customerName}
            </Typography.Text>
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
              <Typography.Text type="secondary" style={{ fontSize: "11px" }}>
                {dayjs(chat.lastMessageTime).format("HH:mm")}
              </Typography.Text>
            </div>
          </div>

          <Typography.Text
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
          </Typography.Text>

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
  );
};
