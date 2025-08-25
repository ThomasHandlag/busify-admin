import React, { useState } from "react";
import { Card, Tabs, Typography } from "antd";
import AssignRolesPage from "./pages/AssignRolesPage";
import ManageRolesPage from "./pages/ManageRolesPage";
import PermissionSettingsPage from "./pages/PermissionSettingsPage";

const { Title } = Typography;

const RoleManagementDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState("assign");

  const tabItems = [
    {
      key: "assign",
      label: "Phân quyền người dùng",
      children: <AssignRolesPage />,
    },
    {
      key: "manage",
      label: "Quản lý vai trò",
      children: <ManageRolesPage />,
    },
    {
      key: "permissions",
      label: "Cài đặt quyền",
      children: <PermissionSettingsPage />,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          🚀 Role Management System Demo
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          style={{ minHeight: "600px" }}
        />
      </Card>
    </div>
  );
};

export default RoleManagementDemo;
