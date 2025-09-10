import React from "react";
import { Card, Space, Typography, List, Avatar, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ChatSession } from "../../../app/api/chat";
import { useWebSocket } from "../../../app/provider/WebSocketContext";

interface DashboardSidebarProps {
  customerSatisfaction: number;
  chatSessions: ChatSession[];
  chatLoading: boolean;
  chatError: string | null;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  chatSessions,
  chatLoading,
  chatError,
}) => {
  const navigate = useNavigate();
  const { isConnected } = useWebSocket();

  const metricCardStyle: React.CSSProperties = {
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(20,20,30,0.04)",
    background: "#fff",
    padding: 14,
  };

  // Only show the 3 most recent chat sessions
  const recentSessions = chatSessions.slice(0, 3);

  const handleReply = (chatId: string) => {
    // Navigate to the chat page with the selected chat ID
    navigate(`/customer-service/chat?chatId=${chatId}`);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Card
        style={{ ...metricCardStyle }}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Chat trực tiếp</span>
            <span
              style={{
                fontSize: "12px",
                color: isConnected ? "#52c41a" : "#ff4d4f",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isConnected ? "#52c41a" : "#ff4d4f",
                  display: "inline-block",
                  marginRight: "4px",
                }}
              />
              {isConnected ? "Đã kết nối" : "Mất kết nối"}
            </span>
          </div>
        }
        bodyStyle={{ padding: 8 }}
      >
        {chatLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <Spin size="small" />
            <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
              Đang tải dữ liệu...
            </div>
          </div>
        ) : chatError ? (
          <div
            style={{ padding: "20px", textAlign: "center", color: "#ff4d4f" }}
          >
            <div style={{ fontSize: 12 }}>Lỗi: {chatError}</div>
          </div>
        ) : recentSessions.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#999" }}>
              Không có cuộc trò chuyện nào gần đây
            </div>
          </div>
        ) : (
          <List
            size="small"
            dataSource={recentSessions}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleReply(item.id)}
                  >
                    Trả lời
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size="small" icon={<UserOutlined />} />}
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <Typography.Text
                          ellipsis={{ tooltip: item.customerName }}
                        >
                          {item.customerName}
                        </Typography.Text>
                      </div>
                    </div>
                  }
                  description={
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12 }}
                      ellipsis={{ tooltip: item.lastMessage }}
                    >
                      {item.lastMessage}
                    </Typography.Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
        {recentSessions.length > 0 && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <Button
              type="link"
              size="small"
              onClick={() => navigate("/customer-service/chat")}
            >
              Xem tất cả
            </Button>
          </div>
        )}
      </Card>
    </Space>
  );
};
