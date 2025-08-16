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
  Rate,
  Badge,
  Row,
  Col,
} from "antd";
import {
  CarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PrinterOutlined,
  MailOutlined,
  WifiOutlined,
  SnippetsOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
  StarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

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

interface TripDetailModalProps {
  trip: Trip | null;
  visible: boolean;
  onClose: () => void;
}

const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  visible,
  onClose,
}) => {
  if (!trip) return null;

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

  const handlePrintInfo = () => {
    message.success("Đang chuẩn bị in thông tin chuyến đi...");
  };

  const handleSendEmail = () => {
    message.success("Đã gửi thông tin chuyến đi qua email");
  };

  const renderAmenities = () => {
    const amenities = [];
    if (trip.amenities.wifi) {
      amenities.push(
        <Tag key="wifi" color="blue" style={{ margin: "2px" }}>
          <WifiOutlined /> WiFi
        </Tag>
      );
    }
    if (trip.amenities.air_conditioner) {
      amenities.push(
        <Tag key="ac" color="cyan" style={{ margin: "2px" }}>
          <SnippetsOutlined /> Điều hòa
        </Tag>
      );
    }
    if (trip.amenities.usb_charging) {
      amenities.push(
        <Tag key="usb" color="orange" style={{ margin: "2px" }}>
          <ThunderboltOutlined /> Sạc USB
        </Tag>
      );
    }
    if (trip.amenities.tv) {
      amenities.push(
        <Tag key="tv" color="purple" style={{ margin: "2px" }}>
          <DesktopOutlined /> TV
        </Tag>
      );
    }

    return amenities.length > 0 ? (
      amenities
    ) : (
      <Text type="secondary">Không có tiện ích đặc biệt</Text>
    );
  };

  // Mock additional details
  const tripDetails = {
    busType: "Giường nằm VIP",
    totalSeats: 40,
    duration: Math.abs(
      dayjs(trip.arrival_time).diff(dayjs(trip.departure_time), "hour")
    ),
    distance: "650 km",
    driverName: "Nguyễn Văn A",
    driverPhone: "0987654321",
    busPlate: "51B-12345",
  };

  return (
    <Modal
      title={
        <Space>
          <CarOutlined />
          <span>Chi tiết chuyến đi - #{trip.trip_id}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="email" icon={<MailOutlined />} onClick={handleSendEmail}>
          Gửi email
        </Button>,
        <Button
          key="print"
          icon={<PrinterOutlined />}
          onClick={handlePrintInfo}
        >
          In thông tin
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Status and Rating */}
        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col span={12}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Title level={4} style={{ margin: 0 }}>
                Trạng thái:{" "}
                <Tag
                  color={getStatusColor(trip.status)}
                  style={{ fontSize: "14px" }}
                >
                  {getStatusText(trip.status)}
                </Tag>
              </Title>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Space direction="vertical" size="small">
                <Rate disabled defaultValue={trip.average_rating} />
                <Text>
                  <StarOutlined /> {trip.average_rating}/5 điểm
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Route Information */}
        <Card
          title="Thông tin tuyến đường"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Điểm khởi hành">
              <Space>
                <EnvironmentOutlined style={{ color: "#52c41a" }} />
                <Text strong>{trip.route.start_location}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Điểm đến">
              <Space>
                <EnvironmentOutlined style={{ color: "#f5222d" }} />
                <Text strong>{trip.route.end_location}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Khoảng cách">
              {tripDetails.distance}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian di chuyển">
              {tripDetails.duration} giờ
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Schedule Information */}
        <Card
          title="Thông tin lịch trình"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Ngày khởi hành">
              <Space>
                <CalendarOutlined />
                {dayjs(trip.departure_time).format("DD/MM/YYYY")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Giờ khởi hành">
              <Space>
                <ClockCircleOutlined />
                {dayjs(trip.departure_time).format("HH:mm")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Giờ đến dự kiến">
              <Space>
                <ClockCircleOutlined />
                {dayjs(trip.arrival_time).format("HH:mm")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đến">
              <Space>
                <CalendarOutlined />
                {dayjs(trip.arrival_time).format("DD/MM/YYYY")}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Bus and Operator Information */}
        <Card
          title="Thông tin nhà xe & xe khách"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Nhà xe">
              <Space>
                <CarOutlined />
                <Text strong>{trip.operator_name}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Loại xe">
              {tripDetails.busType}
            </Descriptions.Item>
            <Descriptions.Item label="Biển số xe">
              <Text code>{tripDetails.busPlate}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tên tài xế">
              {tripDetails.driverName}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT tài xế">
              {tripDetails.driverPhone}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Seat and Price Information */}
        <Card
          title="Thông tin ghế & giá vé"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Tổng số ghế">
              {tripDetails.totalSeats} ghế
            </Descriptions.Item>
            <Descriptions.Item label="Ghế còn trống">
              <Badge
                count={trip.available_seats}
                style={{
                  backgroundColor:
                    trip.available_seats > 20
                      ? "#52c41a"
                      : trip.available_seats > 10
                      ? "#faad14"
                      : "#ff4d4f",
                }}
              >
                <UserOutlined style={{ fontSize: 16 }} />
              </Badge>
            </Descriptions.Item>
            <Descriptions.Item label="Giá vé / ghế" span={2}>
              <Space>
                <DollarOutlined />
                <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
                  {trip.price_per_seat.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Amenities */}
        <Card title="Tiện ích" size="small" style={{ marginBottom: "16px" }}>
          <div style={{ padding: "8px 0" }}>{renderAmenities()}</div>
        </Card>

        <Divider />

        {/* Notes */}
        <Card size="small" style={{ backgroundColor: "#f9f9f9" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Thông tin chi tiết chuyến đi được cập nhật tự động từ hệ thống. Mọi
            thay đổi về lịch trình sẽ được thông báo kịp thời đến khách hàng.
          </Text>
        </Card>
      </div>
    </Modal>
  );
};

export default TripDetailModal;
