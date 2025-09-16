/* eslint-disable @typescript-eslint/no-explicit-any */
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
  DollarOutlined,
  ClearOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchBookingParams>({
    page: 1,
    size: 10,
  });

  // Use React Query to fetch bookings
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
    error: errorBookings,
  } = useQuery({
    queryKey: ["bookings", searchParams],
    queryFn: async () => {
      const response = await searchBookings(searchParams);
      if (response.code !== 200) {
        throw new Error(response.message || "Không thể tải danh sách đặt vé");
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    refetchOnWindowFocus: false,
  });

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (values: any) => {
      const { bookingCode, routeName, status, fromDate, toDate } = values;

      const newSearchParams: SearchBookingParams = {
        page: 1,
        size: searchParams.size || 10,
      };

      if (bookingCode) newSearchParams.bookingCode = bookingCode;
      if (routeName) newSearchParams.route = routeName;
      if (status) newSearchParams.status = status;
      if (fromDate)
        newSearchParams.startDate = dayjs(fromDate).format("YYYY-MM-DD");
      if (toDate) newSearchParams.endDate = dayjs(toDate).format("YYYY-MM-DD");

      const response = await searchBookings(newSearchParams);
      if (response.code !== 200) {
        throw new Error(response.message || "Không thể tìm kiếm đặt vé");
      }

      return { result: response.result, searchParams: newSearchParams };
    },
    onSuccess: (data) => {
      // Update search params to trigger query refetch
      setSearchParams(data.searchParams);
      setHasSearched(true);

      if (data.result.result.length === 0) {
        message.info("Không tìm thấy đặt vé phù hợp");
      } else {
        message.success(`Tìm thấy ${data.result.totalRecords} đặt vé`);
      }
    },
    onError: (error: Error) => {
      message.error(`Lỗi khi tìm kiếm đặt vé: ${error.message}`);
    },
  });

  const handleSearch = async (values: any) => {
    searchMutation.mutate(values);
  };

  const handleReset = () => {
    form.resetFields();
    setHasSearched(false);
    setSearchParams({ page: 1, size: 10 });
  };

  const handleTableChange = (pagination: any) => {
    const formValues = form.getFieldsValue();
    const { bookingCode, routeName, status, fromDate, toDate } = formValues;

    const newSearchParams: SearchBookingParams = {
      page: pagination.current,
      size: pagination.pageSize,
    };

    if (bookingCode) newSearchParams.bookingCode = bookingCode;
    if (routeName) newSearchParams.route = routeName;
    if (status) newSearchParams.status = status;
    if (fromDate)
      newSearchParams.startDate = dayjs(fromDate).format("YYYY-MM-DD");
    if (toDate) newSearchParams.endDate = dayjs(toDate).format("YYYY-MM-DD");

    setSearchParams(newSearchParams);
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleUpdateBooking = async () => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    message.success("Đã cập nhật thông tin đặt vé");
  };

  const handleDeleteBooking = async () => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    message.success("Đã hủy đặt vé");
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    message.success("Đang làm mới dữ liệu...");
  };

  const getStatusColor = (status: string) => {
    // Support both new enum values and older "cancelled" spelling
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "orange";
      case "canceled_by_user":
      case "canceled_by_operator":
      case "cancelled": // legacy
        return "red";
      case "completed":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    // Map statuses to readable Vietnamese labels
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "canceled_by_user":
        return "Đã hủy (khách hàng)";
      case "canceled_by_operator":
        return "Đã hủy (nhà xe/nhân viên)";
      case "cancelled": // legacy
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  // Thêm hàm helper để hiển thị Tag trạng thái gọn gàng với Tooltip
  const renderStatusTag = (status: string) => {
    const text = getStatusText(status);
    return (
      <Tooltip title={text}>
        <Tag
          color={getStatusColor(status)}
          style={{
            maxWidth: 100,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
            display: "inline-block",
          }}
        >
          {text}
        </Tag>
      </Tooltip>
    );
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
      render: (status) => renderStatusTag(status),
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

  // Get data from React Query result
  const searchResults = bookingsData?.result || [];
  const pagination = {
    current: bookingsData?.pageNumber || 1,
    pageSize: bookingsData?.pageSize || 10,
    total: bookingsData?.totalRecords || 0,
  };

  const stats = {
    total: searchResults.length,
    confirmed: searchResults.filter((b) => b.status === "confirmed").length,
    pending: searchResults.filter((b) => b.status === "pending").length,
    totalRevenue: searchResults.reduce(
      (sum, booking) => sum + booking.total_amount,
      0
    ),
  };

  // Combined loading state
  const isLoading = isLoadingBookings || searchMutation.isPending;

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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          <BookOutlined /> Quản lý đặt vé
        </Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          Làm mới
        </Button>
      </div>

      {/* Error Alert */}
      {isErrorBookings && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={
            errorBookings?.message || "Không thể tải danh sách đặt vé"
          }
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
          action={
            <Button size="small" onClick={handleRefresh}>
              Thử lại
            </Button>
          }
        />
      )}

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
                    loading={searchMutation.isPending}
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
              value={pagination.total}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={stats.confirmed}
              valueStyle={{ color: "#52c41a" }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              valueStyle={{ color: "#faad14" }}
              loading={isLoading}
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
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Results Table */}
      <Card>
        {searchResults.length === 0 && !isLoading ? (
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
              loading={isLoading}
              scroll={{ x: 1400 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} đặt vé`,
              }}
              onChange={handleTableChange}
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
