import React from "react";
import {
  Card,
  Space,
  Typography,
  List,
  Avatar,
  Badge,
  Button,
  Tag,
  Alert,
} from "antd";
import { UserOutlined, BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ChatSession, Notification } from "../types";

interface DashboardSidebarProps {
  customerSatisfaction: number;
  chatSessions: ChatSession[];
  notifications: Notification[];
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  customerSatisfaction,
  chatSessions,
  notifications,
}) => {
  const metricCardStyle: React.CSSProperties = {
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(20,20,30,0.04)",
    background: "#fff",
    padding: 14,
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Card style={{ ...metricCardStyle }}>
        <Typography.Title level={5} style={{ marginBottom: 6 }}>
          Hiệu suất
        </Typography.Title>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <Typography.Text type="secondary">Số ticket/ngày</Typography.Text>
            <div style={{ marginTop: 6 }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                42
              </Typography.Title>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Typography.Text type="secondary">Độ hài lòng</Typography.Text>
            <div style={{ marginTop: 6 }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {customerSatisfaction}/5
              </Typography.Title>
            </div>
          </div>
        </div>
      </Card>

      <Card
        style={{ ...metricCardStyle }}
        title="Chat trực tiếp"
        bodyStyle={{ padding: 8 }}
      >
        <List
          size="small"
          dataSource={chatSessions}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" size="small">
                  Trả lời
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={item.unreadCount}>
                    <Avatar size="small" icon={<UserOutlined />} />
                  </Badge>
                }
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
                    <Tag style={{ fontSize: 11 }}>{item.status}</Tag>
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
      </Card>

      <Card
        style={{ ...metricCardStyle }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BellOutlined /> Thông báo
          </div>
        }
      >
        <List
          size="small"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item>
              <Alert
                message={item.message}
                type={item.severity}
                showIcon
                style={{ width: "100%", padding: 8 }}
                description={
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.time).format("HH:mm DD/MM")}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
};
