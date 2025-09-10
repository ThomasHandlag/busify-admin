/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Avatar, Typography } from "antd";
import { UserOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ChatMessage } from "../../../app/api/chat";

// Cập nhật interface props để nhận loggedInUser và customerName
interface MessageItemProps {
  message: ChatMessage;
  loggedInUser: any; // Giả định type từ auth_store (có thể import chính xác nếu cần, ví dụ: import type { User } from "../../stores/auth_store")
  customerName: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  loggedInUser,
  customerName,
}) => {
  // Tính toán isAgent và senderName dựa trên dữ liệu
  const isAgent = message.sender === loggedInUser?.email;
  const senderName = isAgent
    ? loggedInUser?.email || "Nhân viên CSKH"
    : customerName;
  console.log("Rendering MessageItem:", { message, isAgent, senderName });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAgent ? "flex-end" : "flex-start",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "65%",
          display: "flex",
          flexDirection: isAgent ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        <Avatar
          size={32}
          icon={<UserOutlined />}
          style={{
            backgroundColor: isAgent ? "#1890ff" : "#52c41a", // Phân biệt màu: xanh cho agent, xanh lá cho customer
            flexShrink: 0,
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {isAgent ? "CS" : senderName.charAt(0).toUpperCase()} // Hiển thị "CS"
          cho agent, ký tự đầu cho customer
        </Avatar>
        <div>
          {/* Hiển thị senderName rõ ràng */}
          <Typography.Text
            type="secondary"
            style={{
              fontSize: "12px",
              marginBottom: "4px",
              display: "block",
              textAlign: isAgent ? "right" : "left",
            }}
          >
            {senderName}
          </Typography.Text>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: isAgent
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
              backgroundColor: isAgent ? "#1890ff" : "#fff",
              color: isAgent ? "#fff" : "#262626",
              border: isAgent ? "none" : "1px solid #e8e8e8",
              boxShadow: isAgent
                ? "0 4px 12px rgba(24,144,255,0.15)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              position: "relative",
            }}
          >
            <Typography.Text
              style={{
                color: isAgent ? "#fff" : "#262626",
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
              justifyContent: isAgent ? "flex-end" : "flex-start",
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
            {isAgent && (
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
