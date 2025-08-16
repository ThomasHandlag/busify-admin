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
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  BookOutlined,
  PhoneOutlined,
  UserOutlined,
  DollarOutlined,
  ClearOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import BookingDetailModal from "../components/BookingDetailModal";

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data based on API response
const mockBookings = [
  {
    booking_id: 1,
    route_name: "TP.HCM - Hà Nội",
    departure_time: "2025-07-25T08:00:00Z",
    arrival_time: "2025-07-25T20:00:00Z",
    departure_name: "Bến xe Miền Đông",
    arrival_name: "Bến xe Giáp Bát",
    booking_code: "BOOK123",
    status: "confirmed",
    total_amount: 500000.0,
    booking_date: "2025-07-24T12:00:00Z",
    ticket_count: 1,
    payment_method: "Credit Card",
  },
  {
    booking_id: 2,
    route_name: "TP.HCM - Đà Lạt",
    departure_time: "2025-07-25T09:00:00Z",
    arrival_time: "2025-07-25T12:00:00Z",
    departure_name: "Bến xe Miền Đông",
    arrival_name: "Bến xe Đà Lạt",
    booking_code: "BOOK124",
    status: "confirmed",
    total_amount: 150000.0,
    booking_date: "2025-07-24T13:00:00Z",
    ticket_count: 1,
    payment_method: "Credit Card",
  },
  {
    booking_id: 3,
    route_name: "Huế - Đà Nẵng",
    departure_time: "2025-07-25T10:00:00Z",
    arrival_time: "2025-07-25T16:00:00Z",
    departure_name: "Bến xe Huế",
    arrival_name: "Bến xe Miền Đông",
    booking_code: "BOOK125",
    status: "pending",
    total_amount: 250000.0,
    booking_date: "2025-07-24T14:00:00Z",
    ticket_count: 1,
    payment_method: "Bank Transfer",
  },
  {
    booking_id: 4,
    route_name: "Cần Thơ - Vũng Tàu",
    departure_time: "2025-07-25T11:00:00Z",
    arrival_time: "2025-07-25T15:00:00Z",
    departure_name: "Bến xe Cần Thơ",
    arrival_name: "Bến xe Vũng Tàu",
    booking_code: "BOOK126",
    status: "confirmed",
    total_amount: 200000.0,
    booking_date: "2025-07-24T15:00:00Z",
    ticket_count: 1,
    payment_method: "Bank Transfer",
  },
  {
    booking_id: 5,
    route_name: "Nha Trang - TP.HCM",
    departure_time: "2025-07-25T12:00:00Z",
    arrival_time: "2025-07-25T17:00:00Z",
    departure_name: "Bến xe Nha Trang",
    arrival_name: "Bến xe Miền Đông",
    booking_code: "BOOK127",
    status: "confirmed",
    total_amount: 220000.0,
    booking_date: "2025-07-24T16:00:00Z",
    ticket_count: 1,
    payment_method: "Credit Card",
  },
];

interface Booking {
  booking_id: number;
  route_name: string;
  departure_time: string;
  arrival_time: string;
  departure_name: string;
  arrival_name: string;
  booking_code: string;
  status: string;
  total_amount: number;
  booking_date: string;
  ticket_count: number;
  payment_method: string;
}

const BookingsWithCustomerService: React.FC = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Booking[]>(mockBookings);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = async (values: any) => {
    const { bookingCode, routeName, status, fromDate, toDate } = values;

    setLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      let results = mockBookings;

      if (bookingCode) {
        results = results.filter((booking) =>
          booking.booking_code.toLowerCase().includes(bookingCode.toLowerCase())
        );
      }
      if (routeName) {
        results = results.filter((booking) =>
          booking.route_name.toLowerCase().includes(routeName.toLowerCase())
        );
      }
      if (status) {
        results = results.filter((booking) => booking.status === status);
      }
      if (fromDate) {
        results = results.filter(
          (booking) =>
            dayjs(booking.booking_date).isAfter(fromDate, "day") ||
            dayjs(booking.booking_date).isSame(fromDate, "day")
        );
      }
      if (toDate) {
        results = results.filter(
          (booking) =>
            dayjs(booking.booking_date).isBefore(toDate, "day") ||
            dayjs(booking.booking_date).isSame(toDate, "day")
        );
      }

      setSearchResults(results);
      setLoading(false);

      if (results.length === 0) {
        message.info("Không tìm thấy đặt vé phù hợp");
      } else {
        message.success(`Tìm thấy ${results.length} đặt vé`);
      }
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults(mockBookings);
    setHasSearched(false);
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setSearchResults((prev) =>
      prev.map((booking) =>
        booking.booking_id === updatedBooking.booking_id
          ? updatedBooking
          : booking
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      case "completed":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Credit Card":
        return <CreditCardOutlined />;
      case "Bank Transfer":
        return <DollarOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  const columns: TableProps<Booking>["columns"] = [
    {
      title: "Mã đặt vé",
      dataIndex: "booking_code",
      key: "booking_code",
      render: (code) => (
        <Text strong style={{ color: "#1890ff" }}>
          {code}
        </Text>
      ),
      width: 120,
    },
    {
      title: "Tuyến đường",
      dataIndex: "route_name",
      key: "route_name",
      render: (route, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{route}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            <EnvironmentOutlined /> {record.departure_name} →{" "}
            {record.arrival_name}
          </div>
        </div>
      ),
      width: 250,
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
          <div style={{ fontSize: "12px", color: "#666" }}>
            {dayjs(record.departure_time).format("HH:mm")} -{" "}
            {dayjs(record.arrival_time).format("HH:mm")}
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Số lượng vé",
      dataIndex: "ticket_count",
      key: "ticket_count",
      render: (count) => (
        <Space>
          <BookOutlined />
          {count} vé
        </Space>
      ),
      width: 100,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => (
        <Text strong style={{ color: "#52c41a" }}>
          {amount.toLocaleString("vi-VN")} VNĐ
        </Text>
      ),
      width: 130,
    },
    {
      title: "Phương thức TT",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (method) => (
        <Space>
          {getPaymentMethodIcon(method)}
          {method}
        </Space>
      ),
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      width: 120,
    },
    {
      title: "Ngày đặt",
      dataIndex: "booking_date",
      key: "booking_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 140,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
      width: 100,
      fixed: "right",
    },
  ];

  const stats = {
    total: searchResults.length,
    confirmed: searchResults.filter((b) => b.status === "confirmed").length,
    pending: searchResults.filter((b) => b.status === "pending").length,
    totalRevenue: searchResults.reduce(
      (sum, booking) => sum + booking.total_amount,
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
            title: "Quản lý đặt vé",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <BookOutlined /> Quản lý đặt vé
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
              <Form.Item name="bookingCode" label="Mã đặt vé">
                <Input placeholder="Nhập mã đặt vé" prefix={<BookOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="routeName" label="Tuyến đường">
                <Input
                  placeholder="Nhập tên tuyến"
                  prefix={<EnvironmentOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" allowClear>
                  <Option value="confirmed">Đã xác nhận</Option>
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="completed">Hoàn thành</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="fromDate" label="Từ ngày">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày bắt đầu"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="toDate" label="Đến ngày">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày kết thúc"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={18} lg={18}>
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

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng đặt vé"
              value={stats.total}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={stats.confirmed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Results Table */}
      <Card>
        {searchResults.length === 0 ? (
          <Empty description="Không có đặt vé nào" />
        ) : (
          <>
            {hasSearched && (
              <Alert
                message={`Tìm thấy ${searchResults.length} đặt vé phù hợp`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            {!hasSearched && (
              <Alert
                message={`Hiển thị tất cả ${searchResults.length} đặt vé trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={searchResults}
              rowKey="booking_id"
              loading={loading}
              scroll={{ x: 1400 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} đặt vé`,
              }}
            />
          </>
        )}
      </Card>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedBooking(null);
        }}
        onUpdate={handleUpdateBooking}
      />
    </div>
  );
};

export default BookingsWithCustomerService;
