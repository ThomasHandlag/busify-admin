import React from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Divider,
  Card,
  Button,
  message,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PrinterOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface Ticket {
  ticketId: number;
  passengerName: string;
  passengerPhone: string;
  price: number;
  seatNumber: string;
  status: string;
  ticketCode: string;
  bookingId: number;
}

interface TicketDetailModalProps {
  ticket: Ticket | null;
  visible: boolean;
  onClose: () => void;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  visible,
  onClose,
}) => {
  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "green";
      case "used":
        return "blue";
      case "cancelled":
        return "red";
      case "expired":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "Còn hiệu lực";
      case "used":
        return "Đã sử dụng";
      case "cancelled":
        return "Đã hủy";
      case "expired":
        return "Hết hạn";
      default:
        return status;
    }
  };

  const handlePrintTicket = () => {
    message.success("Đang chuẩn bị in vé...");
  };

  const handleSendEmail = () => {
    message.success("Đã gửi thông tin vé qua email");
  };

  // Mock additional data that would come from booking details
  const bookingDetails = {
    departureCity: "Hồ Chí Minh",
    arrivalCity: "Hà Nội",
    departureTime: "08:00 - 15/12/2024",
    arrivalTime: "20:00 - 15/12/2024",
    busCompany: "Xe Limousine VIP",
    route: "HCM - HN Express",
    bookingDate: "10/12/2024",
    paymentMethod: "Thẻ tín dụng",
    email: "customer@email.com",
  };

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          <span>Chi tiết vé - {ticket.ticketCode}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="email" icon={<MailOutlined />} onClick={handleSendEmail}>
          Gửi email
        </Button>,
        <Button
          key="print"
          icon={<PrinterOutlined />}
          onClick={handlePrintTicket}
        >
          In vé
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Ticket Status */}
        <Card
          size="small"
          style={{ marginBottom: "16px", textAlign: "center" }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Trạng thái vé:{" "}
            <Tag
              color={getStatusColor(ticket.status)}
              style={{ fontSize: "14px" }}
            >
              {getStatusText(ticket.status)}
            </Tag>
          </Title>
        </Card>

        {/* Passenger Information */}
        <Card
          title="Thông tin hành khách"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Họ và tên" span={2}>
              <Space>
                <UserOutlined />
                <Text strong>{ticket.passengerName}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <Space>
                <PhoneOutlined />
                {ticket.passengerPhone}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Space>
                <MailOutlined />
                {bookingDetails.email}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Trip Information */}
        <Card
          title="Thông tin chuyến đi"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Tuyến đường" span={2}>
              <Space>
                <EnvironmentOutlined />
                <Text strong>
                  {bookingDetails.departureCity} → {bookingDetails.arrivalCity}
                </Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian khởi hành">
              <Space>
                <CalendarOutlined />
                {bookingDetails.departureTime}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian đến">
              <Space>
                <CalendarOutlined />
                {bookingDetails.arrivalTime}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Nhà xe">
              {bookingDetails.busCompany}
            </Descriptions.Item>
            <Descriptions.Item label="Tuyến">
              {bookingDetails.route}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Ticket Information */}
        <Card
          title="Thông tin vé"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Mã vé">
              <Text code strong>
                {ticket.ticketCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đặt vé">
              <Text code>BOOKING{ticket.bookingId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Số ghế">
              <Tag color="cyan" style={{ fontSize: "14px" }}>
                {ticket.seatNumber}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Giá vé">
              <Space>
                <DollarOutlined />
                <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
                  {ticket.price.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Booking Information */}
        <Card title="Thông tin đặt vé" size="small">
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Ngày đặt">
              <Space>
                <CalendarOutlined />
                {bookingDetails.bookingDate}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {bookingDetails.paymentMethod}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        {/* Additional Actions or Notes */}
        <Card size="small" style={{ backgroundColor: "#f9f9f9" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Thông tin chi tiết vé được tự động cập nhật từ hệ thống. Mọi thay
            đổi sẽ được thông báo đến khách hàng qua email và SMS.
          </Text>
        </Card>
      </div>
    </Modal>
  );
};

export default TicketDetailModal;
