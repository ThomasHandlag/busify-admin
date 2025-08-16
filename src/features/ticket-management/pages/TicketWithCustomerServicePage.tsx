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
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  TagOutlined,
  PhoneOutlined,
  UserOutlined,
  DollarOutlined,
  ClearOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import TicketDetailModal from "../components/TicketDetailModal";

const { Title, Text } = Typography;

// Mock data based on API response
const mockTickets = [
  {
    ticketId: 1,
    passengerName: "Trần Thị Khách",
    passengerPhone: "0987654321",
    price: 500000.0,
    seatNumber: "B01",
    status: "valid",
    ticketCode: "TICKET123",
    bookingId: 1,
  },
  {
    ticketId: 2,
    passengerName: "Lê Văn Khách",
    passengerPhone: "0976543210",
    price: 150000.0,
    seatNumber: "A05",
    status: "valid",
    ticketCode: "TICKET124",
    bookingId: 2,
  },
  {
    ticketId: 3,
    passengerName: "Phạm Thị Hành Khách",
    passengerPhone: "0965432109",
    price: 250000.0,
    seatNumber: "B05",
    status: "cancelled",
    ticketCode: "TICKET125",
    bookingId: 3,
  },
  {
    ticketId: 4,
    passengerName: "Hoàng Văn Khách",
    passengerPhone: "0954321098",
    price: 200000.0,
    seatNumber: "B10",
    status: "used",
    ticketCode: "TICKET126",
    bookingId: 4,
  },
  {
    ticketId: 5,
    passengerName: "Lê Văn Khách",
    passengerPhone: "0976543210",
    price: 220000.0,
    seatNumber: "A17",
    status: "valid",
    ticketCode: "TICKET127",
    bookingId: 5,
  },
];

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

const TicketWithCustomerServicePage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Ticket[]>(mockTickets); // Initialize with mock data
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = async (values: any) => {
    const { ticketCode, name, phone } = values;

    if (!ticketCode && !name && !phone) {
      message.warning("Vui lòng nhập ít nhất một thông tin để tìm kiếm");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      let results = mockTickets;

      if (ticketCode) {
        results = results.filter((ticket) =>
          ticket.ticketCode.toLowerCase().includes(ticketCode.toLowerCase())
        );
      }
      if (name) {
        results = results.filter((ticket) =>
          ticket.passengerName.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (phone) {
        results = results.filter((ticket) =>
          ticket.passengerPhone.includes(phone)
        );
      }

      setSearchResults(results);
      setLoading(false);

      if (results.length === 0) {
        message.info("Không tìm thấy thông tin vé phù hợp");
      } else {
        message.success(`Tìm thấy ${results.length} kết quả`);
      }
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults(mockTickets); // Reset to show all mock data
    setHasSearched(false);
  };

  const handleViewDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

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

  const columns: TableProps<Ticket>["columns"] = [
    {
      title: "Mã vé",
      dataIndex: "ticketCode",
      key: "ticketCode",
      render: (code) => (
        <Text strong style={{ color: "#1890ff" }}>
          {code}
        </Text>
      ),
    },
    {
      title: "Tên hành khách",
      dataIndex: "passengerName",
      key: "passengerName",
      render: (name) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "passengerPhone",
      key: "passengerPhone",
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      ),
    },
    {
      title: "Số ghế",
      dataIndex: "seatNumber",
      key: "seatNumber",
      render: (seat) => <Tag color="cyan">{seat}</Tag>,
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Space>
          <DollarOutlined />
          {price.toLocaleString("vi-VN")} VNĐ
        </Space>
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
    },
  ];

  const stats = {
    total: searchResults.length,
    valid: searchResults.filter((t) => t.status === "valid").length,
    used: searchResults.filter((t) => t.status === "used").length,
    cancelled: searchResults.filter((t) => t.status === "cancelled").length,
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
            title: "Quản lý vé",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <FileSearchOutlined /> Tìm kiếm thông tin vé
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
            <Col xs={24} sm={8}>
              <Form.Item name="ticketCode" label="Mã vé">
                <Input
                  placeholder="Nhập mã vé (VD: TICKET123)"
                  prefix={<TagOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="name" label="Tên khách hàng">
                <Input
                  placeholder="Nhập tên khách hàng"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
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
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Search Results Statistics */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số vé"
              value={stats.total}
              prefix={<TagOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Còn hiệu lực"
              value={stats.valid}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã sử dụng"
              value={stats.used}
              valueStyle={{ color: "#1890ff" }}
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
      </Row>

      {/* Search Results Table */}
      <Card>
        {searchResults.length === 0 ? (
          <Empty description="Không có dữ liệu vé" />
        ) : (
          <>
            {hasSearched && (
              <Alert
                message={`Tìm thấy ${searchResults.length} kết quả phù hợp`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            {!hasSearched && (
              <Alert
                message={`Hiển thị tất cả ${searchResults.length} vé trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={searchResults}
              rowKey="ticketId"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} vé`,
              }}
            />
          </>
        )}
      </Card>

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
};

export default TicketWithCustomerServicePage;
