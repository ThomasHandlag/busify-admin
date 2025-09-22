import React from "react";
import { Button, Space, Tooltip, Input } from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

interface MessageInputProps {
  messageText: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  isConnected: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  onMessageChange,
  onSendMessage,
  isConnected,
}) => {
  return (
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
          onChange={(e) => onMessageChange(e.target.value)}
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
              onSendMessage();
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
            onClick={onSendMessage}
            disabled={!messageText.trim() || !isConnected}
            style={{
              borderRadius: "18px",
              height: "36px",
              paddingLeft: "16px",
              paddingRight: "16px",
              background: messageText.trim() ? "#1890ff" : "#d9d9d9",
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
  );
};
