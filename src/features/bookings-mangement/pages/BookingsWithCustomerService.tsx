/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
  DollarOutlined,
  ClearOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import BookingDetailModal from "../components/BookingDetailModal";
import {
  searchBookings,
  type SearchBookingParams,
  type Booking,
} from "../../../app/api/booking";
import ProtectedComponent from "../../../components/ProtectedCompoment";

const { Title, Text } = Typography;
const { Option } = Select;

const BookingsWithCustomerService: React.FC = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load initial data
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async (params: SearchBookingParams = {}) => {
    setLoading(true);
    try {
      const response = await searchBookings({
        page: 1,
        size: 10,
        ...params,
      });

      setSearchResults(response.result.result);
      setPagination({
        current: response.result.pageNumber,
        pageSize: response.result.pageSize,
        total: response.result.totalRecords,
      });

      if (Object.keys(params).length > 0) {
        setHasSearched(true);
        if (response.result.result.length === 0) {
          message.info("Không tìm thấy đặt vé phù hợp");
        } else {
          message.success(`Tìm thấy ${response.result.totalRecords} đặt vé`);
        }
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      message.error("Không thể tải danh sách đặt vé");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = async (values: any) => {
    const { bookingCode, routeName, status, fromDate, toDate } = values;

    const searchParams: SearchBookingParams = {
      page: 1,
      size: pagination.pageSize,
    };

    if (bookingCode) searchParams.bookingCode = bookingCode;
    if (routeName) searchParams.route = routeName;
    if (status) searchParams.status = status;
    if (fromDate) searchParams.startDate = dayjs(fromDate).format("YYYY-MM-DD");
    if (toDate) searchParams.endDate = dayjs(toDate).format("YYYY-MM-DD");

    await loadBookings(searchParams);
  };

  const handleReset = () => {
    form.resetFields();
    setHasSearched(false);
    loadBookings();
  };

  const handleTableChange = (paginationConfig: any) => {
    const formValues = form.getFieldsValue();
    const { bookingCode, routeName, status, fromDate, toDate } = formValues;

    const searchParams: SearchBookingParams = {
      page: paginationConfig.current,
      size: paginationConfig.pageSize,
    };

    if (bookingCode) searchParams.bookingCode = bookingCode;
    if (routeName) searchParams.route = routeName;
    if (status) searchParams.status = status;
    if (fromDate) searchParams.startDate = dayjs(fromDate).format("YYYY-MM-DD");
    if (toDate) searchParams.endDate = dayjs(toDate).format("YYYY-MM-DD");

    loadBookings(searchParams);
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    // Cập nhật danh sách local
    setSearchResults((prev) =>
      prev.map((booking) =>
        booking.booking_id === updatedBooking.booking_id
          ? updatedBooking
          : booking
      )
    );

    // Reload danh sách từ server để đảm bảo dữ liệu mới nhất
    try {
      const formValues = form.getFieldsValue();
      const { bookingCode, routeName, status, fromDate, toDate } = formValues;

      const searchParams: SearchBookingParams = {
        page: pagination.current,
        size: pagination.pageSize,
      };

      if (bookingCode) searchParams.bookingCode = bookingCode;
      if (routeName) searchParams.route = routeName;
      if (status) searchParams.status = status;
      if (fromDate)
        searchParams.startDate = dayjs(fromDate).format("YYYY-MM-DD");
      if (toDate) searchParams.endDate = dayjs(toDate).format("YYYY-MM-DD");

      await loadBookings(searchParams);
    } catch (error) {
      console.error("Error refreshing bookings list:", error);
      // Không hiển thị error message để không làm phiền user
    }
  };

  const handleDeleteBooking = async () => {
    // Reload danh sách từ server để đảm bảo dữ liệu mới nhất
    try {
      const formValues = form.getFieldsValue();
      const { bookingCode, routeName, status, fromDate, toDate } = formValues;

      const searchParams: SearchBookingParams = {
        page: pagination.current,
        size: pagination.pageSize,
      };

      if (bookingCode) searchParams.bookingCode = bookingCode;
      if (routeName) searchParams.route = routeName;
      if (status) searchParams.status = status;
      if (fromDate)
        searchParams.startDate = dayjs(fromDate).format("YYYY-MM-DD");
      if (toDate) searchParams.endDate = dayjs(toDate).format("YYYY-MM-DD");

      await loadBookings(searchParams);
    } catch (error) {
      console.error("Error refreshing bookings list:", error);
      // Không hiển thị error message để không làm phiền user
    }
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
          <ProtectedComponent allowedRoles={["CUSTOMER_SERVICE"]}>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleViewDetail(record)}
              />
            </Tooltip>
          </ProtectedComponent>
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
        {searchResults.length === 0 && !loading ? (
          <Empty description="Không có đặt vé nào" />
        ) : (
          <>
            {hasSearched && (
              <Alert
                message={`Tìm thấy ${pagination.total} đặt vé phù hợp`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            {!hasSearched && (
              <Alert
                message={`Hiển thị tất cả ${pagination.total} đặt vé trong hệ thống`}
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
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} đặt vé`,
                onChange: handleTableChange,
                onShowSizeChange: handleTableChange,
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
        onDelete={handleDeleteBooking}
      />
    </div>
  );
};

export default BookingsWithCustomerService;
