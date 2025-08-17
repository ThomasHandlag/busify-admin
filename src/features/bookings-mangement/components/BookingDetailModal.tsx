/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "antd";
import {
  BookOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CreditCardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

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

interface BookingDetailModalProps {
  booking: Booking | null;
  visible: boolean;
  onClose: () => void;
  onUpdate: (booking: Booking) => void;
}

// Mock detailed booking data
const getBookingDetail = (booking: Booking) => ({
  id: booking.booking_id,
  bookingCode: booking.booking_code,
  guestFullName: "Trần Thị Khách",
  guestEmail: "customer1@busify.com",
  guestPhone: "0987654321",
  guestAddress: "123 Nguyễn Văn Linh, TP.HCM",
  seatNumber: "A1",
  status: booking.status,
  totalAmount: booking.total_amount,
  createdAt: booking.booking_date,
  updatedAt: booking.booking_date,
  tripId: 1,
});

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  visible,
  onClose,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingDetail, setBookingDetail] = useState<any>(null);

  useEffect(() => {
    if (booking) {
      const detail = getBookingDetail(booking);
      setBookingDetail(detail);
      form.setFieldsValue({
        guestFullName: detail.guestFullName,
        guestEmail: detail.guestEmail,
        guestPhone: detail.guestPhone,
        guestAddress: detail.guestAddress,
      });
    }
  }, [booking, form]);

  if (!booking || !bookingDetail) return null;

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue({
      guestFullName: bookingDetail.guestFullName,
      guestEmail: bookingDetail.guestEmail,
      guestPhone: bookingDetail.guestPhone,
      guestAddress: bookingDetail.guestAddress,
    });
  };

  const handleSave = async (values: any) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedDetail = {
        ...bookingDetail,
        guestFullName: values.guestFullName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        guestAddress: values.guestAddress,
        updatedAt: new Date().toISOString(),
      };

      setBookingDetail(updatedDetail);
      setIsEditing(false);
      setLoading(false);
      message.success("Cập nhật thông tin vé thành công");

      // Update parent component
      onUpdate({ ...booking });
    }, 1000);
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
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              Chỉnh sửa
            </Button>
            <Button onClick={onClose}>Đóng</Button>
          </Space>
        ),
      ]}
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Status */}
        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col span={24}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Title level={4} style={{ margin: 0 }}>
                Trạng thái:{" "}
                <Tag
                  color={getStatusColor(booking.status)}
                  style={{ fontSize: "14px" }}
                >
                  {getStatusText(booking.status)}
                </Tag>
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
            <Descriptions.Item label="Tuyến đường" span={2}>
              <Text strong>{booking.route_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Điểm khởi hành">
              <Space>
                <EnvironmentOutlined style={{ color: "#52c41a" }} />
                {booking.departure_name}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Điểm đến">
              <Space>
                <EnvironmentOutlined style={{ color: "#f5222d" }} />
                {booking.arrival_name}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khởi hành">
              <Space>
                <CalendarOutlined />
                {dayjs(booking.departure_time).format("DD/MM/YYYY")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Giờ khởi hành">
              {dayjs(booking.departure_time).format("HH:mm")} -{" "}
              {dayjs(booking.arrival_time).format("HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Số ghế">
              <Tag color="cyan">{bookingDetail.seatNumber}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng vé">
              {booking.ticket_count} vé
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Customer Information */}
        <Card
          title="Thông tin khách hàng"
          size="small"
          style={{ marginBottom: "16px" }}
          extra={
            !isEditing && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={handleEdit}
                size="small"
              >
                Chỉnh sửa
              </Button>
            )
          }
        >
          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              size="small"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="guestFullName"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
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
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Họ và tên">
                <Space>
                  <UserOutlined />
                  <Text strong>{bookingDetail.guestFullName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  <PhoneOutlined />
                  {bookingDetail.guestPhone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  {bookingDetail.guestEmail}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                <Space>
                  <HomeOutlined />
                  {bookingDetail.guestAddress || "Chưa cập nhật"}
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
                  {booking.total_amount.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              <Space>
                {getPaymentMethodIcon(booking.payment_method)}
                {booking.payment_method}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt vé">
              <Space>
                <CalendarOutlined />
                {dayjs(booking.booking_date).format("DD/MM/YYYY HH:mm")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              <Space>
                <CalendarOutlined />
                {dayjs(bookingDetail.updatedAt).format("DD/MM/YYYY HH:mm")}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        {/* Notes */}
        <Card size="small" style={{ backgroundColor: "#f9f9f9" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Chỉ có thể chỉnh sửa thông tin khách hàng. Thông tin chuyến đi và
            thanh toán không thể thay đổi sau khi đã xác nhận.
          </Text>
        </Card>
      </div>
    </Modal>
  );
};

export default BookingDetailModal;
