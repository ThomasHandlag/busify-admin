import React, { useState, useEffect } from "react";
import {
  Drawer,
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
  Collapse,
  Form,
  Input,
  Spin,
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
  ShoppingCartOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Trip } from "../../../app/api/trip";
import TripSeatSelector from "./TripSeatSelector";
// Import the API functions
import { getTripSeats, type SeatStatus } from "../../../app/api/tripSeat";
import { getSeatLayout, type LayoutData } from "../../../app/api/seatLayout";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Harmonized palette
const PALETTE = {
  primary: "#1f6feb",
  success: "#27ae60",
  warning: "#f39c12",
  danger: "#e74c3c",
  surface: "#f5f7fb",
  muted: "#6b7280",
  border: "#d9d9d9",
  accent: "#6f42c1",
};

// Mock seat data as fallback
const seatMockData = {
  cols: 4,
  rows: 10,
  floors: 1,
};

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
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingForm] = Form.useForm();
  const [bookingLoading, setBookingLoading] = useState(false);

  // New state variables for API data
  const [seatLayout, setSeatLayout] = useState<LayoutData | null>(null);
  const [seatStatuses, setSeatStatuses] = useState<SeatStatus[]>([]);
  const [seatLoading, setSeatLoading] = useState(false);

  // Function to fetch seat data from APIs
  const fetchSeatData = async () => {
    if (!trip || !visible) return;

    setSeatLoading(true);
    try {
      // Fetch seat layout
      const layoutResponse = await getSeatLayout(trip.trip_id.toString());
      if (layoutResponse.code === 200) {
        setSeatLayout(layoutResponse.result.layoutData);
      } else {
        message.error("Không thể tải thông tin bố trí ghế");
      }

      // Fetch seat statuses
      const statusResponse = await getTripSeats(trip.trip_id);
      if (statusResponse.code === 200) {
        setSeatStatuses(statusResponse.result.seatsStatus);
      } else {
        message.error("Không thể tải trạng thái ghế");
      }
    } catch (error) {
      console.error("Error fetching seat data:", error);
      message.error("Không thể tải thông tin ghế");
    } finally {
      setSeatLoading(false);
    }
  };

  // Reset state when trip changes or drawer visibility changes
  useEffect(() => {
    // When drawer opens with a trip or trip changes
    if (visible && trip) {
      // Reset selected seats
      setSelectedSeats([]);
      // Reset booking form
      bookingForm.resetFields();
      // Hide booking form
      setBookingModalVisible(false);
      // Fetch seat data from API
      fetchSeatData();
    }

    // When drawer closes, clean up state
    if (!visible) {
      // Reset selected seats
      setSelectedSeats([]);
      // Reset booking form visibility
      setBookingModalVisible(false);
      // Reset seat data
      setSeatLayout(null);
      setSeatStatuses([]);
    }
  }, [visible, trip, bookingForm]);

  if (!trip) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return PALETTE.success;
      case "cancelled":
        return PALETTE.danger;
      case "completed":
        return PALETTE.accent;
      case "delayed":
        return PALETTE.warning;
      default:
        return PALETTE.muted;
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
        <Tag key="wifi" color={PALETTE.primary} style={{ margin: "2px" }}>
          <WifiOutlined /> WiFi
        </Tag>
      );
    }
    if (trip.amenities.air_conditioner) {
      amenities.push(
        <Tag key="ac" color={PALETTE.accent} style={{ margin: "2px" }}>
          <SnippetsOutlined /> Điều hòa
        </Tag>
      );
    }
    if (trip.amenities.usb_charging) {
      amenities.push(
        <Tag key="usb" color={PALETTE.warning} style={{ margin: "2px" }}>
          <ThunderboltOutlined /> Sạc USB
        </Tag>
      );
    }
    if (trip.amenities.tv) {
      amenities.push(
        <Tag key="tv" color={PALETTE.muted} style={{ margin: "2px" }}>
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

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatId)) {
        return prevSeats.filter((id) => id !== seatId);
      } else {
        return [...prevSeats, seatId];
      }
    });
  };

  const handleBookingSubmit = async (values: any) => {
    setBookingLoading(true);
    try {
      // TODO: Implement actual booking API call here
      console.log("Booking submitted:", {
        tripId: trip?.trip_id,
        seats: selectedSeats,
        customerInfo: values,
      });

      message.success("Đặt vé thành công!");
      setBookingModalVisible(false);
      setSelectedSeats([]);
      bookingForm.resetFields();
    } catch (error) {
      message.error("Không thể đặt vé. Vui lòng thử lại sau." + error);
    } finally {
      setBookingLoading(false);
    }
  };

  const renderBookingFormInline = () => (
    <Card title="Thông tin khách hàng" size="small" style={{ marginTop: 16 }}>
      <Form form={bookingForm} layout="vertical" onFinish={handleBookingSubmit}>
        <Form.Item
          name="customerName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Nhập email" />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={() => setBookingModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={bookingLoading}>
              Xác nhận đặt vé
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );

  // Custom close handler to ensure cleanup
  const handleDrawerClose = () => {
    // Reset all state
    setSelectedSeats([]);
    setBookingModalVisible(false);
    bookingForm.resetFields();

    // Call parent onClose
    onClose();
  };

  return (
    <Drawer
      title={
        <Space>
          <CarOutlined />
          <span>Chi tiết chuyến đi - #{trip.trip_id}</span>
        </Space>
      }
      open={visible}
      onClose={handleDrawerClose}
      width={900}
      destroyOnClose={true}
      extra={
        <Space>
          <Button icon={<MailOutlined />} onClick={handleSendEmail}>
            Gửi email
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrintInfo}>
            In thông tin
          </Button>
          <Button onClick={onClose}>Đóng</Button>
        </Space>
      }
    >
      {/* Use key based on trip_id to force full re-render when trip changes */}
      <div
        key={`trip-detail-${trip?.trip_id}`}
        style={{
          maxHeight: "calc(100vh - 108px)",
          overflowY: "auto",
          paddingBottom: "20px",
        }}
      >
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

        {/* Trip Seat Section (use items prop to avoid rc-collapse children deprecation) */}
        <Collapse
          defaultActiveKey={["1"]}
          style={{ marginBottom: "16px" }}
          items={[
            {
              key: "1",
              label: "Sơ đồ ghế",
              children: (
                <>
                  {seatLoading ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Spin size="large" />
                      <div style={{ marginTop: "10px" }}>
                        Đang tải thông tin ghế...
                      </div>
                    </div>
                  ) : (
                    <TripSeatSelector
                      key={`seat-selector-${trip?.trip_id}`}
                      seatConfig={seatLayout || seatMockData}
                      selectedSeats={selectedSeats}
                      onSeatSelect={handleSeatSelect}
                      availableSeats={trip?.available_seats || 0}
                      seatStatuses={seatStatuses}
                    />
                  )}

                  {selectedSeats.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div>
                          <Text strong>Ghế đã chọn:</Text>{" "}
                          {selectedSeats.map((seat) => (
                            <Tag
                              color={PALETTE.primary}
                              key={seat}
                              style={{ margin: "2px" }}
                            >
                              {seat}
                            </Tag>
                          ))}
                        </div>
                        <div>
                          <Text strong>Tổng tiền:</Text>{" "}
                          <Text style={{ color: PALETTE.success }}>
                            {(
                              selectedSeats.length * (trip?.price_per_seat || 0)
                            ).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </Text>
                        </div>
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => setBookingModalVisible(true)}
                          style={{
                            marginTop: 8,
                            backgroundColor: PALETTE.primary,
                            borderColor: PALETTE.primary,
                          }}
                        >
                          Đặt vé ({selectedSeats.length} ghế)
                        </Button>
                        {/* Inline booking form inside drawer */}
                        {bookingModalVisible && renderBookingFormInline()}
                      </Space>
                    </div>
                  )}
                </>
              ),
            },
          ]}
        />

        {/* Route Information */}
        <Card
          title="Thông tin tuyến đường"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Điểm khởi hành">
              <Space>
                <EnvironmentOutlined style={{ color: PALETTE.success }} />
                <Text strong>{trip.route.start_location}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Điểm đến">
              <Space>
                <EnvironmentOutlined style={{ color: PALETTE.danger }} />
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
                      ? PALETTE.success
                      : trip.available_seats > 10
                      ? PALETTE.warning
                      : PALETTE.danger,
                }}
              >
                <UserOutlined style={{ fontSize: 16 }} />
              </Badge>
            </Descriptions.Item>
            <Descriptions.Item label="Giá vé / ghế" span={2}>
              <Space>
                <DollarOutlined />
                <Text
                  strong
                  style={{ color: PALETTE.success, fontSize: "16px" }}
                >
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
    </Drawer>
  );
};

export default TripDetailModal;
