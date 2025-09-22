/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from "react";
import { Empty } from "antd";
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

  // Lọc tin nhắn - chỉ hiển thị CHAT và SYSTEM_ASSIGN
  const filteredMessages = messages.filter(
    (message) => message.type === "CHAT" || message.type === "SYSTEM_ASSIGN"
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        background: "linear-gradient(to bottom, #f8f9fa 0%, #f0f2f5 100%)",
      }}
    >
      {filteredMessages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Empty
            description="Chưa có tin nhắn nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        filteredMessages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            loggedInUser={loggedInUser}
            customerName={customerName}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
