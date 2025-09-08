import React from "react";
import { Avatar, Typography } from "antd";
import { UserOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isAgent: boolean;
}

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: message.isAgent ? "flex-end" : "flex-start",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "65%",
          display: "flex",
          flexDirection: message.isAgent ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        <Avatar
          size={32}
          icon={<UserOutlined />}
          style={{
            backgroundColor: message.isAgent ? "#1890ff" : "#52c41a",
            flexShrink: 0,
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {message.isAgent ? "CS" : message.senderName.charAt(0)}
        </Avatar>
        <div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: message.isAgent
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
              backgroundColor: message.isAgent ? "#1890ff" : "#fff",
              color: message.isAgent ? "#fff" : "#262626",
              border: message.isAgent ? "none" : "1px solid #e8e8e8",
              boxShadow: message.isAgent
                ? "0 4px 12px rgba(24,144,255,0.15)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              position: "relative",
            }}
          >
            <Typography.Text
              style={{
                color: message.isAgent ? "#fff" : "#262626",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {message.content}
            </Typography.Text>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: message.isAgent ? "flex-end" : "flex-start",
              gap: "4px",
              marginTop: "4px",
            }}
          >
            <Typography.Text
              type="secondary"
              style={{
                fontSize: "11px",
                color: "#8c8c8c",
              }}
            >
              {dayjs(message.timestamp).format("HH:mm")}
            </Typography.Text>
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
  );
};
