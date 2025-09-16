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
  Spin,
  Button,
  Alert,
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
  ReloadOutlined,
} from "@ant-design/icons";
import { NotificationDemo } from "../../../components/NotificationDemo";
import { useAuthStore } from "../../../stores/auth_store";
import { useDashboardStats, useRecentActivities } from "../hooks/useDashboard";
import { DashboardCharts } from "../components/DashboardCharts";

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const auth = useAuthStore();

  // Use dashboard hooks for dynamic data
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats(true, 30000);
  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities,
  } = useRecentActivities(10, true, 15000);

  console.log("Auth:", auth);
  console.log("🔍 Dashboard API Data:", {
    stats,
    activities,
    statsLoading,
    activitiesLoading,
    statsError,
    activitiesError,
  });

  // Fallback data for when API is not available
  const fallbackStats = {
    totalUsers: 1248,
    totalVehicles: 156,
    totalRoutes: 24,
    monthlyRevenue: 485920000,
    activeRoutes: 89, // Now represents weekly bookings
    pendingUsers: 12,
    todayBookings: 45,
    pendingComplaints: 8,
    completedTrips: 1250,
    cancelledTrips: 25,
  };

  // Use API data if available, otherwise fallback
  const dashboardStats = stats || fallbackStats;
  const recentActivities = activities.length > 0 ? activities : [];

  // Show data source for debugging
  const dataSource = stats ? "API" : "Fallback";
  console.log(`📊 Using ${dataSource} data:`, dashboardStats);

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
                    <Tag
                      color={stats ? "green" : "orange"}
                      style={{ marginLeft: "8px" }}
                    >
                      {stats ? "📊 Live Data" : "🔄 Demo Data"}
                    </Tag>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      refetchStats();
                      refetchActivities();
                    }}
                  >
                    Làm mới
                  </Button>
                  <Button
                    type="dashed"
                    onClick={async () => {
                      // Test individual APIs
                      try {
                        console.log("🔍 Testing APIs individually...");

                        const { getAllUsersManagement } = await import(
                          "../../../app/api/user"
                        );
                        const userTest = await getAllUsersManagement({
                          page: 1,
                          size: 1,
                        });
                        console.log("👥 Users API:", userTest);

                        const { getAllTrips } = await import(
                          "../../../app/api/trip"
                        );
                        const tripTest = await getAllTrips();
                        console.log("🚌 Trips API:", tripTest);

                        alert("Check console for API results!");
                      } catch (error) {
                        console.error("❌ API Test Error:", error);
                        alert("API test failed - check console");
                      }
                    }}
                  >
                    Test APIs
                  </Button>
                </Space>
              </Col>
            </Row>
            {(statsError || activitiesError) && (
              <Alert
                message="Lỗi tải dữ liệu"
                description={statsError || activitiesError}
                type="warning"
                style={{ marginTop: "16px" }}
                closable
              />
            )}
          </Card>

          {/* Statistics Cards */}
          <Spin spinning={statsLoading}>
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
                    title="Tổng số Chuyến xe"
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
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN").format(Number(value))
                    }
                  />
                </Card>
              </Col>
            </Row>
          </Spin>

          {/* Additional Statistics Row */}
          <Spin spinning={statsLoading}>
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Đặt vé hôm nay"
                    value={dashboardStats.todayBookings}
                    prefix={<ReadOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Chuyến hoàn thành"
                    value={dashboardStats.completedTrips}
                    prefix={<RiseOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Chuyến đã hủy"
                    value={dashboardStats.cancelledTrips}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Đặt vé trong tuần"
                    value={dashboardStats.activeRoutes}
                    prefix={<CarOutlined />}
                    suffix="vé"
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>
          </Spin>

          {/* System Overview and Recent Activities */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} lg={12}>
              <Card title="Tổng quan hệ thống" extra={<EyeOutlined />}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text>Tỷ lệ đặt vé tuần/tháng</Text>
                    <Progress
                      percent={Math.round(
                        (dashboardStats.activeRoutes /
                          (dashboardStats.todayBookings * 7 + 1)) *
                          100
                      )}
                      status="active"
                    />
                  </div>
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Chuyến hoàn thành"
                        value={dashboardStats.completedTrips}
                        suffix={
                          <Badge
                            count={dashboardStats.completedTrips}
                            style={{ backgroundColor: "#52c41a" }}
                          />
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Đặt vé tuần này"
                        value={dashboardStats.activeRoutes}
                        suffix="vé"
                      />
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="Hoạt động gần đây"
                extra={<FileTextOutlined />}
                size="small"
                style={{ maxHeight: "400px" }}
              >
                <Spin spinning={activitiesLoading}>
                  <List
                    size="small"
                    dataSource={recentActivities.slice(0, 5)}
                    renderItem={(item) => (
                      <List.Item style={{ padding: "8px 0" }}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size="small"
                              icon={
                                item.type === "user" ? (
                                  <UserOutlined />
                                ) : item.type === "vehicle" ? (
                                  <CarOutlined />
                                ) : item.type === "booking" ? (
                                  <ReadOutlined />
                                ) : item.type === "complaint" ? (
                                  <FileTextOutlined />
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
                                    : item.type === "booking"
                                    ? "#fa8c16"
                                    : item.type === "complaint"
                                    ? "#eb2f96"
                                    : "#fa8c16",
                              }}
                            />
                          }
                          title={
                            <Text ellipsis style={{ fontSize: "14px" }}>
                              {item.action}
                            </Text>
                          }
                          description={
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {item.user}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>

          {/* Revenue Charts */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <DashboardCharts />
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
