import {
  UserOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  DashboardOutlined,
  TruckOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  FrownOutlined,
  MessageOutlined,
} from "@ant-design/icons";

export interface AppMenuItem {
  key?: string;
  icon?: React.ReactNode;
  label?: string;
  roles?: string[];
  type?: "divider";
  children?: AppMenuItem[];
}

export const menuItems: AppMenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Bảng điều khiển",
    roles: ["ADMIN", "CUSTOMER_SERVICE"],
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
      {
        key: "chat-customer-service",
        label: "Chat với Khách hàng",
        icon: <MessageOutlined />,
        roles: ["CUSTOMER_SERVICE"],
      },
    ],
  },

  {
    key: "tickets-customer-service",
    label: "Quản lý vé",
    roles: ["CUSTOMER_SERVICE", "ADMIN"],
  },
  {
    key: "bookings-customer-service",
    label: "Quản lý booking",
    roles: ["CUSTOMER_SERVICE", "ADMIN"],
  },
  {
    key: "trips-customer-service",
    label: "Tra cứu chuyến đi",
    roles: ["CUSTOMER_SERVICE"],
  },
  {
    key: "complaints-customer-service",
    label: "Quản lý khiếu nại",
    icon: <FrownOutlined />,
    roles: ["CUSTOMER_SERVICE"],
  },
  {
    key: "reviews-customer-service",
    label: "Quản lý đánh giá",
    icon: <StarOutlined />,
    roles: ["CUSTOMER_SERVICE"],
  },
  {
    key: "chat-customer-service",
    label: "Chat với Khách hàng",
    icon: <MessageOutlined />,
    roles: ["CUSTOMER_SERVICE"],
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
        roles: ["ADMIN"],
      },
      {
        key: "permission-settings",
        label: "Cài đặt quyền",
        roles: ["ADMIN"],
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
    roles: ["ADMIN", "CUSTOMER_SERVICE"],
  },
];

export const routeToKeyMap: Record<string, string> = {
  // admin
  "/admin": "dashboard",
  "/admin/users-management": "users",
  "/admin/bus-operators-management": "bus-operators-management",
  "/admin/bus-operators": "bus-operators",
  "/admin/contracts": "list-bus-operator",
  "/admin/revenue-reports": "revenue-reports",
  "/admin/revenue-analytics": "revenue-analytics",
  "/admin/tickets": "tickets-customer-service",
  "/admin/bookings": "bookings-customer-service",
  // customer service
  "/customer-service": "dashboard-customer-service",
  "/customer-service/tickets": "tickets-customer-service",
  "/customer-service/bookings": "bookings-customer-service",
  "/customer-service/trips": "trips-customer-service",
  "/customer-service/complaints": "complaints-customer-service",
  "/customer-service/reviews": "reviews-customer-service",
  "/customer-service/chat": "chat-customer-service",
};
