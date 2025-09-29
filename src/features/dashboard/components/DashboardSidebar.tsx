import React from "react";
import {
  Card,
  Space,
  Typography,
  List,
  Avatar,
  Button,
  Spin,
  Badge,
  Tooltip,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ChatSession } from "../../../app/api/chat";
import { useWebSocket } from "../../../app/provider/WebSocketContext";

interface DashboardSidebarProps {
  customerSatisfaction: number;
  chatSessions: ChatSession[];
  chatLoading: boolean;
  chatError: string | null;
  newlyAssignedChatIds?: Set<string>; // ID của các cuộc trò chuyện mới được assign
  onChatSelect?: (chatId: string) => void; // Hàm xử lý khi chọn chat
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  chatSessions,
  chatLoading,
  chatError,
  newlyAssignedChatIds = new Set(),
  onChatSelect,
}) => {
  const navigate = useNavigate();
  const { isConnected } = useWebSocket();

  // Chỉ hiển thị 3 cuộc trò chuyện gần đây nhất
  const recentSessions = chatSessions.slice(0, 3);

  const handleReply = (chatId: string) => {
    // Gọi callback nếu có, nếu không thì xử lý mặc định
    if (onChatSelect) {
      onChatSelect(chatId);
    } else {
      // Navigate to the chat page with the selected chat ID
      navigate(`/customer-service/chat?chatId=${chatId}`);
    }
  };

  return (
    <Card title="Recent Chats" size="small" styles={{ body: { padding: 12 } }}>
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 8,
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {newlyAssignedChatIds.has(item.id) && (
                          <Tooltip title="Cuộc trò chuyện mới được giao">
                            <Badge
                              dot
                              color="#1890ff"
                              style={{ marginRight: 4 }}
                            />
                          </Tooltip>
                        )}
                        {(item.unreadCount ?? 0) > 0 && (
                          <Badge count={item.unreadCount} size="small" />
                        )}
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
      </Space>
    </Card>
  );
};
