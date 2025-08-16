/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  Typography,
  Tag,
  Row,
  Col,
  Statistic,
  Alert,
  Breadcrumb,
  Empty,
  Tooltip,
  message,
  Select,
  DatePicker,
  TimePicker,
  Rate,
  Badge,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  ClearOutlined,
  CarOutlined,
  WifiOutlined,
  SnippetsOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import TripDetailModal from "./components/TripDetailModal";

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data based on API response
const mockTrips = [
  {
    trip_id: 1,
    operator_name: "Nhà Xe ABC",
    route: {
      start_location: "Bến xe Miền Đông; TP.HCM",
      end_location: "Bến xe Giáp Bát; Hà Nội",
    },
    amenities: {
      wifi: true,
      air_conditioner: true,
    },
    average_rating: 5.0,
    departure_time: "2025-07-25T08:00:00Z",
    arrival_time: "2025-07-25T20:00:00Z",
    status: "scheduled",
    price_per_seat: 500000.0,
    available_seats: 39,
  },
  {
    trip_id: 2,
    operator_name: "Nhà Xe XYZ",
    route: {
      start_location: "Bến xe Miền Đông; TP.HCM",
      end_location: "Bến xe Đà Lạt; Đà Lạt",
    },
    amenities: {
      wifi: true,
      air_conditioner: true,
      usb_charging: true,
    },
    average_rating: 4.5,
    departure_time: "2025-07-25T09:00:00Z",
    arrival_time: "2025-07-25T12:00:00Z",
    status: "scheduled",
    price_per_seat: 150000.0,
    available_seats: 31,
  },
  {
    trip_id: 3,
    operator_name: "Nhà Xe Huế",
    route: {
      start_location: "Bến xe Huế; Huế",
      end_location: "Bến xe Miền Đông; TP.HCM",
    },
    amenities: {
      wifi: true,
      air_conditioner: true,
    },
    average_rating: 3.0,
    departure_time: "2025-07-25T10:00:00Z",
    arrival_time: "2025-07-25T16:00:00Z",
    status: "scheduled",
    price_per_seat: 250000.0,
    available_seats: 47,
  },
  {
    trip_id: 4,
    operator_name: "Nhà Xe Biển Xanh",
    route: {
      start_location: "Bến xe Cần Thơ; Cần Thơ",
      end_location: "Bến xe Vũng Tàu; Vũng Tàu",
    },
    amenities: {
      wifi: true,
      air_conditioner: true,
      tv: true,
    },
    average_rating: 5.0,
    departure_time: "2025-07-25T11:00:00Z",
    arrival_time: "2025-07-25T15:00:00Z",
    status: "cancelled",
    price_per_seat: 200000.0,
    available_seats: 0,
  },
  {
    trip_id: 5,
    operator_name: "Nhà Xe Nha Trang",
    route: {
      start_location: "Bến xe Nha Trang; Nha Trang",
      end_location: "Bến xe Miền Đông; TP.HCM",
    },
    amenities: {
      wifi: true,
      air_conditioner: true,
    },
    average_rating: 4.0,
    departure_time: "2025-07-25T12:00:00Z",
    arrival_time: "2025-07-25T17:00:00Z",
    status: "scheduled",
    price_per_seat: 220000.0,
    available_seats: 47,
  },
];

interface Trip {
  trip_id: number;
  operator_name: string;
  route: {
    start_location: string;
    end_location: string;
  };
  amenities: {
    wifi?: boolean;
    air_conditioner?: boolean;
    usb_charging?: boolean;
    tv?: boolean;
  };
  average_rating: number;
  departure_time: string;
  arrival_time: string;
  status: string;
  price_per_seat: number;
  available_seats: number;
}

const TripWithCustomerServicePage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Trip[]>(mockTrips);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = async (values: any) => {
    const {
      startLocation,
      endLocation,
      departureDate,
      departureTime,
      status,
      minSeats,
    } = values;

    setLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      let results = mockTrips;

      if (startLocation) {
        results = results.filter((trip) =>
          trip.route.start_location
            .toLowerCase()
            .includes(startLocation.toLowerCase())
        );
      }
      if (endLocation) {
        results = results.filter((trip) =>
          trip.route.end_location
            .toLowerCase()
            .includes(endLocation.toLowerCase())
        );
      }
      if (status) {
        results = results.filter((trip) => trip.status === status);
      }
      if (minSeats) {
        results = results.filter((trip) => trip.available_seats >= minSeats);
      }

      setSearchResults(results);
      setLoading(false);

      if (results.length === 0) {
        message.info("Không tìm thấy chuyến đi phù hợp");
      } else {
        message.success(`Tìm thấy ${results.length} chuyến đi`);
      }
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults(mockTrips);
    setHasSearched(false);
  };

  const handleViewDetail = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "green";
      case "cancelled":
        return "red";
      case "completed":
        return "blue";
      case "delayed":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Đã lên lịch";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      case "delayed":
        return "Bị trễ";
      default:
        return status;
    }
  };

  const renderAmenities = (amenities: any) => {
    const amenityList = [];
    if (amenities.wifi)
      amenityList.push(<WifiOutlined key="wifi" title="WiFi" />);
    if (amenities.air_conditioner)
      amenityList.push(<SnippetsOutlined key="ac" title="Điều hòa" />);
    if (amenities.usb_charging)
      amenityList.push(<ThunderboltOutlined key="usb" title="Sạc USB" />);
    if (amenities.tv) amenityList.push(<DesktopOutlined key="tv" title="TV" />);

    return <Space>{amenityList}</Space>;
  };

  const columns: TableProps<Trip>["columns"] = [
    {
      title: "Mã chuyến",
      dataIndex: "trip_id",
      key: "trip_id",
      render: (id) => (
        <Text strong style={{ color: "#1890ff" }}>
          #{id}
        </Text>
      ),
      width: 100,
    },
    {
      title: "Nhà xe",
      dataIndex: "operator_name",
      key: "operator_name",
      render: (name) => (
        <Space>
          <CarOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: "Tuyến đường",
      dataIndex: "route",
      key: "route",
      render: (route) => (
        <div>
          <div>
            <EnvironmentOutlined style={{ color: "#52c41a" }} />{" "}
            {route.start_location}
          </div>
          <div style={{ margin: "4px 0", color: "#999" }}>↓</div>
          <div>
            <EnvironmentOutlined style={{ color: "#f5222d" }} />{" "}
            {route.end_location}
          </div>
        </div>
      ),
      width: 300,
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <div>
          <div>
            <CalendarOutlined />{" "}
            {dayjs(record.departure_time).format("DD/MM/YYYY")}
          </div>
          <div>
            <ClockCircleOutlined />{" "}
            {dayjs(record.departure_time).format("HH:mm")} -{" "}
            {dayjs(record.arrival_time).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "average_rating",
      key: "rating",
      render: (rating) => (
        <div>
          <Rate disabled defaultValue={rating} />
          <div>
            <Text type="secondary">({rating}/5)</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Tiện ích",
      dataIndex: "amenities",
      key: "amenities",
      render: renderAmenities,
    },
    {
      title: "Giá vé",
      dataIndex: "price_per_seat",
      key: "price",
      render: (price) => (
        <Space>
          <DollarOutlined />
          <Text strong style={{ color: "#52c41a" }}>
            {price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </Space>
      ),
    },
    {
      title: "Ghế trống",
      dataIndex: "available_seats",
      key: "seats",
      render: (seats, record) => (
        <Badge
          count={seats}
          style={{
            backgroundColor:
              record.status === "cancelled"
                ? "#ff4d4f"
                : seats > 20
                ? "#52c41a"
                : seats > 10
                ? "#faad14"
                : "#ff4d4f",
          }}
        >
          <UserOutlined style={{ fontSize: 16 }} />
        </Badge>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Tooltip>
      ),
      width: 80,
    },
  ];

  const stats = {
    total: searchResults.length,
    scheduled: searchResults.filter((t) => t.status === "scheduled").length,
    cancelled: searchResults.filter((t) => t.status === "cancelled").length,
    totalSeats: searchResults.reduce(
      (sum, trip) => sum + trip.available_seats,
      0
    ),
  };

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[
          {
            title: "Chăm sóc khách hàng",
          },
          {
            title: "Tra cứu chuyến đi",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <CarOutlined /> Tìm kiếm chuyến đi
      </Title>

      {/* Search Form */}
      <Card style={{ marginBottom: "24px" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="startLocation" label="Điểm khởi hành">
                <Input
                  placeholder="Nhập điểm khởi hành"
                  prefix={<EnvironmentOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="endLocation" label="Điểm đến">
                <Input
                  placeholder="Nhập điểm đến"
                  prefix={<EnvironmentOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="departureDate" label="Ngày khởi hành">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="departureTime" label="Giờ khởi hành">
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn giờ"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" allowClear>
                  <Option value="scheduled">Đã lên lịch</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="delayed">Bị trễ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="minSeats" label="Số ghế tối thiểu">
                <Input
                  type="number"
                  placeholder="Nhập số ghế"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} lg={8}>
              <Form.Item label=" " style={{ marginBottom: 0 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    Tìm kiếm
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={handleReset}>
                    Xóa bộ lọc
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Search Results Statistics */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng chuyến đi"
              value={stats.total}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã lên lịch"
              value={stats.scheduled}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng ghế trống"
              value={stats.totalSeats}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search Results Table */}
      <Card>
        {searchResults.length === 0 ? (
          <Empty description="Không có chuyến đi nào" />
        ) : (
          <>
            {hasSearched && (
              <Alert
                message={`Tìm thấy ${searchResults.length} chuyến đi phù hợp`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            {!hasSearched && (
              <Alert
                message={`Hiển thị tất cả ${searchResults.length} chuyến đi trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={searchResults}
              rowKey="trip_id"
              loading={loading}
              scroll={{ x: 1400 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} chuyến đi`,
              }}
            />
          </>
        )}
      </Card>

      {/* Trip Detail Modal */}
      <TripDetailModal
        trip={selectedTrip}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedTrip(null);
        }}
      />
    </div>
  );
};

export default TripWithCustomerServicePage;
