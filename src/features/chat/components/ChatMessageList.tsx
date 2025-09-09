/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from "react";
import { Empty, Divider, Typography } from "antd";
import { MessageItem } from "./MessageItem";
import type { ChatMessage } from "../../../app/api/chat";

// Cập nhật interface props để nhận loggedInUser và customerName (để tính toán isAgent và senderName trong MessageItem)
interface ChatMessageListProps {
  messages: ChatMessage[];
  loggedInUser: any; // Giả định type từ auth_store (có thể import chính xác nếu cần, ví dụ: import type { User } from "../../stores/auth_store")
  customerName: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  loggedInUser,
  customerName,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        background: "linear-gradient(to bottom, #f8f9fa 0%, #f0f2f5 100%)",
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
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Divider>
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  background: "#f0f2f5",
                  padding: "4px 12px",
                  borderRadius: "12px",
                }}
              >
                Hôm nay
              </Typography.Text>
            </Divider>
          </div>
          {messages.map((message) => (
            // Truyền thêm loggedInUser và customerName xuống MessageItem để tính toán isAgent và senderName
            <MessageItem
              key={message.id}
              message={message}
              loggedInUser={loggedInUser}
              customerName={customerName}
            />
          ))}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
