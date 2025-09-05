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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { ChatSession } from "../types";

interface DashboardSidebarProps {
  customerSatisfaction: number;
  chatSessions: ChatSession[];
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  chatSessions,
}) => {
  const metricCardStyle: React.CSSProperties = {
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(20,20,30,0.04)",
    background: "#fff",
    padding: 14,
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
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
    </Space>
  );
};
