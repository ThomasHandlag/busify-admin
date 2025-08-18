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
import { useAuthStore } from "../stores/auth_store";

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed?: boolean;
}

interface AppMenuItem {
  key?: string;
  icon?: React.ReactNode;
  label?: string;
  roles?: string[];
  type?: "divider";
  children?: AppMenuItem[];
}

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.loggedInUser);

  // Map route paths to menu keys
  const routeToKeyMap: Record<string, string> = {
    "/admin": "dashboard",
    "/admin/users-management": "users",
    "/admin/bus-operators-management": "bus-operators-management",
  };

  // Update selected key based on current location
  useEffect(() => {
    const currentKey = routeToKeyMap[location.pathname] || "dashboard";
    setSelectedKey(currentKey);
  }, [location.pathname]);

  const menuItems: AppMenuItem[] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
      roles: ["ADMIN", "EMPLOYEE"],
    },
    {
      type: "divider",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Quản lý Người dùng",
      roles: ["ADMIN"],
    },
    {
      key: "bus-operators",
      icon: <TruckOutlined />,
      label: "Quản lý Nhà xe",
      roles: ["ADMIN"],
      children: [
        {
          key: "bus-operators-management",
          label: "Danh sách Nhà xe",
          roles: ["ADMIN"],
        },
        {
          key: "list-bus-operator",
          label: "Hợp đồng",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      key: "route-management",
      icon: <BranchesOutlined />,
      label: "Quản lý Tuyến xe",
    },
    {
      key: "revenue-management",
      icon: <DollarCircleOutlined />,
      label: "Theo dõi Doanh thu",
      roles: ["ADMIN"],
      children: [
        {
          key: "revenue-reports",
          label: "Báo cáo doanh thu",
          roles: ["ADMIN"],
        },
        {
          key: "revenue-analytics",
          label: "Phân tích doanh thu",
          roles: ["ADMIN"],
        },
        {
          key: "revenue-export",
          label: "Xuất báo cáo",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      key: "role-management",
      icon: <SafetyCertificateOutlined />,
      label: "Phân quyền Vai trò",
      roles: ["ADMIN"],
      children: [
        {
          key: "assign-roles",
          label: "Phân quyền",
          roles: ["ADMIN"],
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
      roles: ["EMPLOYEE"],
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

  const getFilteredMenuItems = (): MenuItem[] => {
    return menuItems
      .filter(
        (item) => item.roles?.includes(user?.role as string) || !item.roles
      )
      .map((item): MenuItem => {
        if (item.type === "divider") {
          return { type: "divider" };
        }
        if (item.children) {
          return {
            key: item.key!,
            icon: item.icon,
            label: item.label,
            children: item.children
              .filter(
                (child) =>
                  child.roles?.includes(user?.role as string) || !child.roles
              )
              .map((child) => ({
                key: child.key!,
                icon: child.icon,
                label: child.label,
              })),
          };
        }
        return {
          key: item.key!,
          icon: item.icon,
          label: item.label,
        };
      });
  };
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
      case "bus-operators-management":
        navigate("/admin/bus-operators-management");
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
        items={getFilteredMenuItems()}
        theme="light"
      />
    </Sider>
  );
};

export default Sidebar;
