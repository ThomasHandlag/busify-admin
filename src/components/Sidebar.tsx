import { Layout, Menu, Avatar, Typography } from "antd";
import {
  UserOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  DashboardOutlined,
  TruckOutlined,
  SafetyCertificateOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  // Map route paths to menu keys
  const routeToKeyMap: Record<string, string> = {
    "/admin": "dashboard",
    "/admin/users-management": "users",
  };

  // Update selected key based on current location
  useEffect(() => {
    const currentKey = routeToKeyMap[location.pathname] || "dashboard";
    setSelectedKey(currentKey);
  }, [location.pathname]);

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
    },
    {
      type: "divider",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Quản lý Người dùng",
    },
    {
      key: "vehicle-management",
      icon: <TruckOutlined />,
      label: "Quản lý Nhà xe",
      children: [
        {
          key: "add-vehicle",
          label: "Thêm nhà xe",
        },
        {
          key: "edit-vehicle",
          label: "Sửa nhà xe",
        },
        {
          key: "search-vehicle",
          label: "Tìm kiếm nhà xe",
        },
        {
          key: "delete-vehicle",
          label: "Xóa nhà xe",
        },
      ],
    },
    {
      key: "route-management",
      icon: <BranchesOutlined />,
      label: "Quản lý Tuyến xe",
      children: [
        {
          key: "add-route",
          label: "Thêm tuyến xe",
        },
        {
          key: "edit-route",
          label: "Sửa tuyến xe",
        },
        {
          key: "search-route",
          label: "Tìm kiếm tuyến xe",
        },
        {
          key: "delete-route",
          label: "Xóa tuyến xe",
        },
      ],
    },
    {
      key: "revenue-management",
      icon: <DollarCircleOutlined />,
      label: "Theo dõi Doanh thu",
      children: [
        {
          key: "revenue-reports",
          label: "Báo cáo doanh thu",
        },
        {
          key: "revenue-analytics",
          label: "Phân tích doanh thu",
        },
        {
          key: "revenue-export",
          label: "Xuất báo cáo",
        },
      ],
    },
    {
      key: "role-management",
      icon: <SafetyCertificateOutlined />,
      label: "Phân quyền Vai trò",
      children: [
        {
          key: "assign-roles",
          label: "Phân quyền",
        },
        {
          key: "manage-roles",
          label: "Quản lý vai trò",
        },
        {
          key: "permission-settings",
          label: "Cài đặt quyền",
        },
      ],
    },
    {
      key: "log-management",
      icon: <FileTextOutlined />,
      label: "Quản lý Logs",
      children: [
        {
          key: "view-logs",
          label: "Xem logs",
        },
        {
          key: "search-logs",
          label: "Tìm kiếm logs",
        },
        {
          key: "export-logs",
          label: "Xuất logs",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt hệ thống",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);

    // Navigation logic based on menu key
    switch (key) {
      case "dashboard":
        navigate("/admin");
        break;
      case "users":
        navigate("/admin/users-management");
        break;
      // Add more cases for other menu items as needed
      default:
        console.log("Navigate to:", key);
        break;
    }
  };

  return (
    <Sider
      collapsed={collapsed}
      width={280}
      collapsedWidth={80}
      className="overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1000,
      }}
      trigger={null}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minHeight: "64px",
        }}
      >
        <Avatar size={collapsed ? 32 : 40} src="/src/assets/logo.png">
          B
        </Avatar>
        {!collapsed && (
          <div>
            <Text
              strong
              style={{
                fontSize: "18px",
                color: "#1890ff",
                display: "block",
                lineHeight: 1.2,
              }}
            >
              Busify
            </Text>
            <Text
              type="secondary"
              style={{
                fontSize: "12px",
                lineHeight: 1.2,
              }}
            >
              Admin Dashboard
            </Text>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        style={{
          height: "calc(100vh - 64px)",
          borderRight: 0,
          paddingTop: "8px",
        }}
        items={menuItems}
        theme="light"
      />
    </Sider>
  );
};

export default Sidebar;
