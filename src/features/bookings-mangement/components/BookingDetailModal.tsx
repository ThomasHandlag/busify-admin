import React, { useState, useEffect } from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Card,
  Button,
  message,
  Row,
  Col,
  Form,
  Input,
  Divider,
  Spin,
  Empty,
  Tooltip, // thêm Tooltip
} from "antd";
import {
  BookOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  SaveOutlined,
  CreditCardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getBookingByCode,
  updateBooking,
  type Booking,
  type BookingDetailAPI,
  type UpdateBookingParams,
} from "../../../app/api/booking";
import MailSenderModal from "../../../components/MailSenderModal"; // added import

const { Title, Text } = Typography;

interface BookingDetailModalProps {
  booking: Booking | null;
  visible: boolean;
  onClose: () => void;
  onUpdate: (booking: Booking) => void;
  onDelete?: (bookingCode: string) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  visible,
  onClose,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [bookingDetail, setBookingDetail] = useState<BookingDetailAPI | null>(
    null
  );

  // Mail sender form & visibility
  const [mailForm] = Form.useForm();
  const [isMailModalVisible, setIsMailModalVisible] = useState(false);

  useEffect(() => {
    if (booking && visible) {
      fetchBookingDetail();
    }
    // Reset form when modal closes
    if (!visible) {
      form.resetFields();
      setIsEditing(false);
      setBookingDetail(null);
    }
  }, [booking, visible, form]);

  const fetchBookingDetail = async () => {
    if (!booking) return;

    setFetchLoading(true);
    try {
      const response = await getBookingByCode(booking.booking_code);
      console.log("API Response:", response.result); // Debug log

      // API trả về array, lấy phần tử đầu tiên
      const detailData = Array.isArray(response.result)
        ? response.result[0]
        : response.result;
      setBookingDetail(detailData);

      // Set form values immediately after getting data
      // Ưu tiên sử dụng guest fields nếu có, fallback về passenger fields
      form.setFieldsValue({
        guestFullName:
          detailData?.guestFullName || detailData?.passenger_name || "",
        guestEmail: detailData?.guestEmail || detailData?.email || "",
        guestPhone: detailData?.guestPhone || detailData?.phone || "",
        guestAddress: detailData?.guestAddress || detailData?.address || "",
      });
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      message.error("Không thể tải thông tin chi tiết đặt vé");
    } finally {
      setFetchLoading(false);
    }
  };

  if (!booking) return null;

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
    // Map new enum values to user-friendly Vietnamese strings, keep legacy support
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
            fontSize: 14,
            maxWidth: 120,
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

  const handleCancel = () => {
    setIsEditing(false);
    if (bookingDetail) {
      console.log("Resetting form with data:", bookingDetail); // Debug log
      form.setFieldsValue({
        guestFullName:
          bookingDetail.guestFullName || bookingDetail.passenger_name || "",
        guestEmail: bookingDetail.guestEmail || bookingDetail.email || "",
        guestPhone: bookingDetail.guestPhone || bookingDetail.phone || "",
        guestAddress: bookingDetail.guestAddress || bookingDetail.address || "",
      });
    }
  };

  const handleSave = async (values: UpdateBookingParams) => {
    if (!booking) return;

    setLoading(true);
    try {
      const response = await updateBooking(booking.booking_code, values);
      // API có thể trả về array hoặc object, xử lý cả hai trường hợp
      const updatedData = Array.isArray(response.result)
        ? response.result[0]
        : response.result;

      // Cập nhật state với dữ liệu mới
      setBookingDetail(updatedData);

      // Cập nhật form với dữ liệu mới từ API
      form.setFieldsValue({
        guestFullName: updatedData?.passenger_name || "",
        guestEmail: updatedData?.email || "",
        guestPhone: updatedData?.phone || "",
        guestAddress: updatedData?.address || "",
      });

      setIsEditing(false);
      message.success("Cập nhật thông tin vé thành công");

      // Update parent component
      onUpdate({ ...booking });

      // Reload dữ liệu từ API để đảm bảo consistency
      await fetchBookingDetail();
    } catch (error) {
      console.error("Error updating booking:", error);
      message.error("Không thể cập nhật thông tin đặt vé");
    } finally {
      setLoading(false);
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

  return (
    <Modal
      title={
        <Space>
          <BookOutlined />
          <span>Chi tiết đặt vé - {booking.booking_code}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        isEditing ? (
          <Space key="edit-actions">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={() => form.submit()}
            >
              Lưu thay đổi
            </Button>
          </Space>
        ) : (
          <Space key="view-actions">
            <Button onClick={onClose}>Đóng</Button>
          </Space>
        ),
      ]}
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {fetchLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>
              Đang tải thông tin chi tiết...
            </div>
          </div>
        ) : bookingDetail ? (
          <>
            {/* Status */}
            <Row gutter={16} style={{ marginBottom: "16px" }}>
              <Col span={24}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Trạng thái: {renderStatusTag(bookingDetail.status)}
                  </Title>
                </Card>
              </Col>
            </Row>

            {/* Trip Information */}
            <Card
              title="Thông tin chuyến đi"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <Descriptions column={2} size="small">
                {bookingDetail.operator_name && (
                  <Descriptions.Item label="Nhà xe" span={2}>
                    <Text strong>{bookingDetail.operator_name}</Text>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Điểm khởi hành">
                  <Space>
                    <EnvironmentOutlined style={{ color: "#52c41a" }} />
                    <div>
                      <div>
                        {bookingDetail.route_start?.name ||
                          booking.departure_name}
                      </div>
                      {bookingDetail.route_start?.address &&
                        bookingDetail.route_start?.city && (
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {bookingDetail.route_start.address},{" "}
                            {bookingDetail.route_start.city}
                          </Text>
                        )}
                    </div>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đến">
                  <Space>
                    <EnvironmentOutlined style={{ color: "#f5222d" }} />
                    <div>
                      <div>
                        {bookingDetail.route_end?.name || booking.arrival_name}
                      </div>
                      {bookingDetail.route_end?.address &&
                        bookingDetail.route_end?.city && (
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {bookingDetail.route_end.address},{" "}
                            {bookingDetail.route_end.city}
                          </Text>
                        )}
                    </div>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày khởi hành">
                  <Space>
                    <CalendarOutlined />
                    {dayjs(
                      bookingDetail.departure_time || booking.departure_time
                    ).format("DD/MM/YYYY")}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Giờ khởi hành">
                  {dayjs(
                    bookingDetail.departure_time || booking.departure_time
                  ).format("HH:mm")}{" "}
                  -{" "}
                  {dayjs(
                    bookingDetail.arrival_estimate_time || booking.arrival_time
                  ).format("HH:mm")}
                </Descriptions.Item>
                {bookingDetail.bus && (
                  <Descriptions.Item label="Phương tiện">
                    <div>
                      <div>{bookingDetail.bus.model}</div>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Biển số: {bookingDetail.bus.license_plate}
                      </Text>
                    </div>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Ghế đã đặt">
                  <Space>
                    {bookingDetail.tickets &&
                    bookingDetail.tickets.length > 0 ? (
                      bookingDetail.tickets.map((ticket, index) => (
                        <Tag key={index} color="cyan">
                          {ticket.seat_number}
                        </Tag>
                      ))
                    ) : (
                      <Tag color="cyan">N/A</Tag>
                    )}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Customer Information */}
            <Card
              title="Thông tin khách hàng"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  size="small"
                  preserve={false}
                  key={`edit-form-${bookingDetail?.booking_id}-${isEditing}`} // Force re-render với key unique
                  initialValues={{
                    guestFullName:
                      bookingDetail.guestFullName ||
                      bookingDetail.passenger_name ||
                      "",
                    guestEmail:
                      bookingDetail.guestEmail || bookingDetail.email || "",
                    guestPhone:
                      bookingDetail.guestPhone || bookingDetail.phone || "",
                    guestAddress:
                      bookingDetail.guestAddress || bookingDetail.address || "",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="guestFullName"
                        label="Họ và tên"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ và tên",
                          },
                        ]}
                      >
                        <Input prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="guestPhone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                        ]}
                      >
                        <Input prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="guestEmail"
                        label="Email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          { type: "email", message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input prefix={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="guestAddress" label="Địa chỉ">
                        <Input prefix={<HomeOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              ) : (
                <Descriptions
                  column={2}
                  size="small"
                  key={`view-${bookingDetail?.booking_id}`}
                >
                  <Descriptions.Item label="Họ và tên">
                    <Space>
                      <UserOutlined />
                      <Text strong>
                        {bookingDetail.guestFullName ||
                          bookingDetail.passenger_name ||
                          "Chưa có thông tin"}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Space>
                      <PhoneOutlined />
                      <Text>
                        {bookingDetail.guestPhone ||
                          bookingDetail.phone ||
                          "Chưa có thông tin"}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      <Text>
                        {bookingDetail.guestEmail ||
                          bookingDetail.email ||
                          "Chưa có thông tin"}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    <Space>
                      <HomeOutlined />
                      <Text>
                        {bookingDetail.guestAddress ||
                          bookingDetail.address ||
                          "Chưa cập nhật"}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>

            {/* Payment Information */}
            <Card
              title="Thông tin thanh toán"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Tổng tiền">
                  <Space>
                    <DollarOutlined />
                    <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
                      {(
                        bookingDetail.payment_info?.amount ||
                        booking.total_amount
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  <Space>
                    {getPaymentMethodIcon(
                      bookingDetail.payment_info?.method ||
                        booking.payment_method
                    )}
                    {bookingDetail.payment_info?.method ||
                      booking.payment_method}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian thanh toán">
                  <Space>
                    <CalendarOutlined />
                    {dayjs(
                      bookingDetail.payment_info?.timestamp ||
                        booking.booking_date
                    ).format("DD/MM/YYYY HH:mm")}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Mã vé">
                  <Space>
                    {bookingDetail.tickets &&
                    bookingDetail.tickets.length > 0 ? (
                      bookingDetail.tickets.map((ticket, index) => (
                        <Tag key={index} color="blue">
                          {ticket.ticket_code}
                        </Tag>
                      ))
                    ) : (
                      <Tag color="blue">{booking.booking_code}</Tag>
                    )}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider />

            {/* Notes */}
            <Card size="small" style={{ backgroundColor: "#f9f9f9" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Chỉ có thể chỉnh sửa thông tin khách hàng. Thông tin chuyến đi
                và thanh toán không thể thay đổi sau khi đã xác nhận.
              </Text>
            </Card>
          </>
        ) : (
          <Empty description="Không thể tải thông tin chi tiết" />
        )}
      </div>

      {/* Mail sender modal */}
      <MailSenderModal
        isVisible={isMailModalVisible}
        setIsVisible={setIsMailModalVisible}
        form={mailForm}
        defaultRecipient={
          bookingDetail?.guestEmail || bookingDetail?.email || ""
        }
        defaultSubject={`Thông tin đặt vé ${booking?.booking_code} - Busify`}
        defaultUserName={
          bookingDetail?.guestFullName || bookingDetail?.passenger_name || ""
        }
        caseNumber={booking?.booking_code}
        onSuccess={() => {
          message.success("Đã gửi email thành công!");
        }}
      />
    </Modal>
  );
};

export default BookingDetailModal;
