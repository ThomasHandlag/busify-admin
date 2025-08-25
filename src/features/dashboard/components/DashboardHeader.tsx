import React from "react";
import { Typography, Button, Space, Avatar, message } from "antd";
import {
  CustomerServiceOutlined,
  ReloadOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface DashboardHeaderProps {
  onRefresh?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
}) => {
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  };

  const handleRefresh = () => {
    onRefresh?.();
    message.success("Đã làm mới");
  };

  return (
    <div style={headerStyle}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          <CustomerServiceOutlined /> Dashboard Chăm Sóc
        </Typography.Title>
        <Typography.Text type="secondary">
          Giao diện tối giản, trực quan cho bộ phận CS
        </Typography.Text>
      </div>
      <Space size="middle">
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} type="text" />
        <Button icon={<BellOutlined />} type="text" />
        <Avatar
          style={{ backgroundColor: "#1890ff" }}
          icon={<UserOutlined />}
        />
      </Space>
    </div>
  );
};
