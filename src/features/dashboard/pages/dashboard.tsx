import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Statistic,
  Avatar,
  Divider,
  Progress,
  Tag,
  List,
  Badge,
} from "antd";
import {
  UserOutlined,
  CarOutlined,
  ReadOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
  TruckOutlined,
  RiseOutlined,
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NotificationDemo } from "../../../components/NotificationDemo";
import { useAuthStore } from "../../../stores/auth_store";

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const auth = useAuthStore();

  console.log("Auth:", auth);

  // Mock data for dashboard statistics
  const dashboardStats = {
    totalUsers: 1248,
    totalVehicles: 156,
    totalRoutes: 24,
    monthlyRevenue: 485920000,
    activeRoutes: 18,
    pendingUsers: 12,
  };

  const recentActivities = [
    {
      action: "Thêm người dùng mới",
      user: "admin@busify.com",
      time: "2 phút trước",
      type: "user",
    },
    {
      action: "Cập nhật thông tin nhà xe",
      user: "manager@busify.com",
      time: "15 phút trước",
      type: "vehicle",
    },
    {
      action: "Thêm tuyến xe mới",
      user: "admin@busify.com",
      time: "1 giờ trước",
      type: "route",
    },
    {
      action: "Xóa người dùng",
      user: "admin@busify.com",
      time: "2 giờ trước",
      type: "user",
    },
  ];

  const quickActions = [
    {
      title: "Quản lý Người dùng",
      icon: <UserOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      description: "Thêm, sửa, tìm kiếm, xóa người dùng",
      actions: [
        "Thêm người dùng",
        "Sửa người dùng",
        "Tìm kiếm người dùng",
        "Xóa người dùng",
      ],
      color: "#e6f7ff",
    },
    {
      title: "Quản lý Nhà xe",
      icon: <CarOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      description: "Thêm, sửa, tìm kiếm, xóa nhà xe",
      actions: ["Thêm nhà xe", "Sửa nhà xe", "Tìm kiếm nhà xe", "Xóa nhà xe"],
      color: "#f6ffed",
    },
    {
      title: "Quản lý Tuyến xe",
      icon: <ReadOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />,
      description: "Thêm, sửa, tìm kiếm, xóa tuyến xe",
      actions: [
        "Thêm tuyến xe",
        "Sửa tuyến xe",
        "Tìm kiếm tuyến xe",
        "Xóa tuyến xe",
      ],
      color: "#fff7e6",
    },
    {
      title: "Theo dõi Doanh thu",
      icon: (
        <DollarCircleOutlined style={{ fontSize: "24px", color: "#eb2f96" }} />
      ),
      description: "Báo cáo doanh thu và thống kê",
      actions: ["Xem báo cáo", "Xuất báo cáo", "Thống kê theo tháng"],
      color: "#fff0f6",
    },
    {
      title: "Phân quyền Vai trò",
      icon: <SettingOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
      description: "Quản lý quyền hạn và vai trò",
      actions: ["Phân quyền", "Quản lý vai trò", "Cài đặt quyền"],
      color: "#f9f0ff",
    },
    {
      title: "Quản lý Logs",
      icon: <FileTextOutlined style={{ fontSize: "24px", color: "#13c2c2" }} />,
      description: "Theo dõi và quản lý logs hệ thống",
      actions: ["Xem logs", "Tìm kiếm logs", "Xuất logs"],
      color: "#e6fffb",
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {auth.loggedInUser ? (
        <div>
          {/* Notification Demo */}
          <NotificationDemo />

          {/* Welcome Header */}
          <Card style={{ marginBottom: "24px" }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Space align="center">
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <div>
                    <Title level={2} style={{ margin: 0 }}>
                      Chào mừng, {auth.loggedInUser.email}!
                    </Title>
                    <Text type="secondary">Vai trò: </Text>
                    <Tag color="blue">{auth.loggedInUser.role}</Tag>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng số Người dùng"
                  value={dashboardStats.totalUsers}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng số Nhà xe"
                  value={dashboardStats.totalVehicles}
                  prefix={<TruckOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng số Tuyến xe"
                  value={dashboardStats.totalRoutes}
                  prefix={<ReadOutlined />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Doanh thu tháng"
                  value={dashboardStats.monthlyRevenue}
                  prefix={<RiseOutlined />}
                  suffix="VND"
                  valueStyle={{ color: "#eb2f96" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Quick Actions Grid */}
          <Title level={3}>Chức năng chính</Title>
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  style={{ backgroundColor: action.color, height: "100%" }}
                  hoverable
                  actions={[
                    <PlusOutlined key="add" />,
                    <EditOutlined key="edit" />,
                    <SearchOutlined key="search" />,
                    <DeleteOutlined key="delete" />,
                  ]}
                >
                  <Card.Meta
                    avatar={action.icon}
                    title={action.title}
                    description={
                      <div>
                        <Paragraph>{action.description}</Paragraph>
                        <div>
                          {action.actions.map((act, idx) => (
                            <Tag key={idx} style={{ marginBottom: "4px" }}>
                              {act}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* System Overview and Recent Activities */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Tổng quan hệ thống" extra={<EyeOutlined />}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text>Tuyến xe đang hoạt động</Text>
                    <Progress
                      percent={Math.round(
                        (dashboardStats.activeRoutes /
                          dashboardStats.totalRoutes) *
                          100
                      )}
                      status="active"
                    />
                  </div>
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Người dùng chờ duyệt"
                        value={dashboardStats.pendingUsers}
                        suffix={
                          <Badge
                            count={dashboardStats.pendingUsers}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Tuyến xe hoạt động"
                        value={dashboardStats.activeRoutes}
                        suffix={`/${dashboardStats.totalRoutes}`}
                      />
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Hoạt động gần đây" extra={<FileTextOutlined />}>
                <List
                  dataSource={recentActivities}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={
                              item.type === "user" ? (
                                <UserOutlined />
                              ) : item.type === "vehicle" ? (
                                <CarOutlined />
                              ) : (
                                <ReadOutlined />
                              )
                            }
                            style={{
                              backgroundColor:
                                item.type === "user"
                                  ? "#1890ff"
                                  : item.type === "vehicle"
                                  ? "#52c41a"
                                  : "#fa8c16",
                            }}
                          />
                        }
                        title={item.action}
                        description={
                          <div>
                            <Text type="secondary">{item.user}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {item.time}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <Card style={{ textAlign: "center", marginTop: "100px" }}>
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{ marginBottom: "16px" }}
          />
          <Title level={3}>
            Vui lòng đăng nhập để truy cập bảng điều khiển
          </Title>
          <Text type="secondary">
            Bạn cần đăng nhập với tài khoản quản trị viên để sử dụng các chức
            năng.
          </Text>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
