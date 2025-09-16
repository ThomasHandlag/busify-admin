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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Thêm import này
import TicketDetailModal from "../components/TicketDetailModal";
import {
  getAllTickets,
  searchTickets,
  type Ticket,
  type TicketSearchParams,
} from "../../../app/api/ticket";

const { Title, Text } = Typography;

const TicketWithCustomerServicePage: React.FC = () => {
  const [form] = Form.useForm();
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient(); // Để invalidate queries

  // Query để load tất cả vé (thay thế useEffect và useState cho searchResults/loading)
  const {
    data: ticketsData,
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
    error: errorTickets,
  } = useQuery({
    queryKey: ["tickets"], // Key để cache và invalidate
    queryFn: async () => {
      const response = await getAllTickets();
      if (response.result && response.result.length > 0) {
        return response.result.flatMap((item) => item.tickets); // Trả về mảng Ticket[]
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút (tùy chỉnh)
  });

  // Mutation cho tìm kiếm (có thể dùng useQuery với key động thay thế nếu muốn đơn giản hơn)
  const searchMutation = useMutation({
    mutationFn: (params: TicketSearchParams) => searchTickets(params),
    onSuccess: (response) => {
      if (response.result && response.result.length > 0) {
        const tickets = response.result.flatMap((item) => item.tickets);
        queryClient.setQueryData(["tickets"], tickets); // Cập nhật cache
        message.success(`Tìm thấy ${tickets.length} kết quả`);
      } else {
        queryClient.setQueryData(["tickets"], []);
        message.info("Không tìm thấy thông tin vé phù hợp");
      }
      setHasSearched(true);
    },
    onError: (error) => {
      message.error("Lỗi khi tìm kiếm vé: " + error.message);
      queryClient.setQueryData(["tickets"], []);
    },
  });

  const handleSearch = async (values: TicketSearchParams) => {
    const { ticketCode, name, phone } = values;
    if (!ticketCode && !name && !phone) {
      message.warning("Vui lòng nhập ít nhất một thông tin để tìm kiếm");
      return;
    }
    setHasSearched(true);
    searchMutation.mutate(values); // Gọi mutation
  };

  const handleReset = async () => {
    form.resetFields();
    setHasSearched(false);
    queryClient.invalidateQueries({ queryKey: ["tickets"] }); // Invalidate để reload
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

  // Tính stats dựa trên dữ liệu từ query
  const searchResults = ticketsData || [];
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

      {/* Hiển thị error nếu có */}
      {isErrorTickets && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={errorTickets?.message || "Không thể tải danh sách vé"}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
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
                  loading={searchMutation.isPending} // Loading từ mutation
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
        {searchResults.length === 0 && !isLoadingTickets ? (
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
              loading={isLoadingTickets || searchMutation.isPending} // Loading từ query/mutation
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
