import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Progress,
  List,
  Badge,
  Avatar,
  Divider,
  Alert,
  Select,
  Input,
  Tooltip,
  message,
} from "antd";
import {
  CustomerServiceOutlined,
  PhoneOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  BellOutlined,
  WarningOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data types
interface Ticket {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  type: "cancel" | "refund" | "change" | "complaint" | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
}

interface Notification {
  id: string;
  type: "sla_breach" | "new_ticket" | "chat_waiting" | "system_error";
  message: string;
  time: string;
  severity: "info" | "warning" | "error";
}

interface ChatSession {
  id: string;
  customerName: string;
  status: "active" | "waiting" | "closed";
  lastMessage: string;
  unreadCount: number;
  startTime: string;
}

export const DashboardWithCustomerService = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  // Mock data
  const mockTickets: Ticket[] = [
    {
      id: "TK001",
      customerName: "Nguyễn Văn An",
      phone: "0912345678",
      email: "an.nguyen@email.com",
      type: "cancel",
      status: "open",
      priority: "high",
      subject: "Yêu cầu hủy vé do thay đổi lịch trình",
      description:
        "Khách hàng cần hủy vé chuyến đi ngày 15/12 do có việc đột xuất",
      createdAt: "2024-12-10T08:30:00",
      updatedAt: "2024-12-10T08:30:00",
      dueAt: "2024-12-10T17:30:00",
    },
    {
      id: "TK002",
      customerName: "Trần Thị Bình",
      phone: "0987654321",
      email: "binh.tran@email.com",
      type: "refund",
      status: "in_progress",
      priority: "medium",
      subject: "Hoàn tiền sau khi hủy chuyến",
      description:
        "Chuyến xe bị hủy do thời tiết, khách hàng yêu cầu hoàn tiền",
      createdAt: "2024-12-09T14:20:00",
      updatedAt: "2024-12-10T09:15:00",
      dueAt: "2024-12-11T14:20:00",
    },
    {
      id: "TK003",
      customerName: "Lê Minh Cường",
      phone: "0923456789",
      email: "cuong.le@email.com",
      type: "complaint",
      status: "open",
      priority: "urgent",
      subject: "Khiếu nại về chất lượng dịch vụ",
      description: "Xe đến muộn 2 tiếng, tài xế thái độ không tốt",
      createdAt: "2024-12-10T07:45:00",
      updatedAt: "2024-12-10T07:45:00",
      dueAt: "2024-12-10T15:45:00",
    },
    {
      id: "TK004",
      customerName: "Phạm Thị Dung",
      phone: "0934567890",
      email: "dung.pham@email.com",
      type: "change",
      status: "resolved",
      priority: "low",
      subject: "Đổi vé sang chuyến khác",
      description: "Khách hàng muốn đổi từ chuyến 8:00 sang chuyến 10:00",
      createdAt: "2024-12-09T16:30:00",
      updatedAt: "2024-12-10T10:00:00",
      dueAt: "2024-12-11T16:30:00",
    },
    {
      id: "TK005",
      customerName: "Võ Văn Em",
      phone: "0945678901",
      email: "em.vo@email.com",
      type: "other",
      status: "closed",
      priority: "low",
      subject: "Hỏi thông tin lịch trình",
      description: "Khách hàng muốn biết thông tin chi tiết về điểm đón",
      createdAt: "2024-12-08T11:15:00",
      updatedAt: "2024-12-09T09:30:00",
      dueAt: "2024-12-09T11:15:00",
    },
  ];

  const mockNotifications: Notification[] = [
    {
      id: "N001",
      type: "sla_breach",
      message: "Ticket TK003 sắp quá hạn xử lý (còn 1 giờ)",
      time: "2024-12-10T14:30:00",
      severity: "warning",
    },
    {
      id: "N002",
      type: "new_ticket",
      message: "Ticket mới TK006 từ khách hàng Nguyễn Thị Hoa",
      time: "2024-12-10T14:25:00",
      severity: "info",
    },
    {
      id: "N003",
      type: "chat_waiting",
      message: "Khách hàng Trần Văn Khải đang chờ phản hồi trong chat",
      time: "2024-12-10T14:20:00",
      severity: "warning",
    },
  ];

  const mockChatSessions: ChatSession[] = [
    {
      id: "CH001",
      customerName: "Nguyễn Thị Lan",
      status: "active",
      lastMessage: "Tôi muốn đổi vé sang ngày mai được không?",
      unreadCount: 2,
      startTime: "2024-12-10T14:15:00",
    },
    {
      id: "CH002",
      customerName: "Trần Văn Khải",
      status: "waiting",
      lastMessage: "Cảm ơn, tôi đã hiểu rồi",
      unreadCount: 0,
      startTime: "2024-12-10T13:45:00",
    },
    {
      id: "CH003",
      customerName: "Lê Thị Mai",
      status: "active",
      lastMessage: "Xe có wifi không ạ?",
      unreadCount: 1,
      startTime: "2024-12-10T14:30:00",
    },
  ];

  // Filter tickets based on status and search
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesSearch =
      searchText === "" ||
      ticket.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalOpen: mockTickets.filter((t) => t.status === "open").length,
    inProgress: mockTickets.filter((t) => t.status === "in_progress").length,
    resolvedToday: mockTickets.filter(
      (t) =>
        t.status === "resolved" && dayjs(t.updatedAt).isSame(dayjs(), "day")
    ).length,
    overdue: mockTickets.filter(
      (t) =>
        (t.status === "open" || t.status === "in_progress") &&
        dayjs().isAfter(dayjs(t.dueAt))
    ).length,
    avgResponseTime: "2.5",
    customerSatisfaction: 4.2,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cancel":
        return "orange";
      case "refund":
        return "red";
      case "change":
        return "blue";
      case "complaint":
        return "purple";
      default:
        return "default";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "cancel":
        return "Hủy vé";
      case "refund":
        return "Hoàn tiền";
      case "change":
        return "Đổi vé";
      case "complaint":
        return "Khiếu nại";
      default:
        return "Khác";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "red";
      case "in_progress":
        return "blue";
      case "resolved":
        return "green";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Mới";
      case "in_progress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      case "closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#f5222d";
      case "high":
        return "#fa8c16";
      case "medium":
        return "#faad14";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const handleTicketAction = (action: string, ticketId: string) => {
    message.success(`${action} ticket ${ticketId}`);
  };

  const columns: TableProps<Ticket>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => (
        <Text strong style={{ color: "#1890ff" }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 150,
      render: (_, record) => (
        <div>
          <div>
            <UserOutlined /> {record.customerName}
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <PhoneOutlined /> {record.phone}
          </Text>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color={getTypeColor(type)}>{getTypeText(type)}</Tag>
      ),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (priority) => (
        <Badge
          color={getPriorityColor(priority)}
          text={priority.toUpperCase()}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Text ellipsis={{ tooltip: subject }} style={{ maxWidth: 200 }}>
          {subject}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: "12px" }}>
            <ClockCircleOutlined />{" "}
            {dayjs(record.createdAt).format("DD/MM HH:mm")}
          </div>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Hạn: {dayjs(record.dueAt).format("DD/MM HH:mm")}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleTicketAction("View", record.id)}
            />
          </Tooltip>
          <Tooltip title="Xử lý">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleTicketAction("Process", record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>
          <CustomerServiceOutlined /> Dashboard Chăm sóc Khách hàng
        </Title>
        <Text type="secondary">Tổng quan và quản lý yêu cầu khách hàng</Text>
      </div>

      {/* Overview Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tickets Mới"
              value={stats.totalOpen}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang Xử Lý"
              value={stats.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giải Quyết Hôm Nay"
              value={stats.resolvedToday}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Quá Hạn"
              value={stats.overdue}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          {/* Filters and Search */}
          <Card style={{ marginBottom: "16px" }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Lọc theo trạng thái"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="open">Mới</Option>
                  <Option value="in_progress">Đang xử lý</Option>
                  <Option value="resolved">Đã giải quyết</Option>
                  <Option value="closed">Đã đóng</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Tìm kiếm ticket, khách hàng..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => message.success("Đã làm mới")}
                >
                  Làm mới
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Tickets Table */}
          <Card title="Danh sách Yêu cầu" bodyStyle={{ padding: 12 }}>
            <List
              grid={{ gutter: 12, xs: 1, sm: 1, md: 2, lg: 2 }}
              dataSource={filteredTickets}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    size="small"
                    bordered={false}
                    style={{
                      boxShadow: "0 1px 6px rgba(16, 24, 40, 0.06)",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                    bodyStyle={{ padding: 12 }}
                    actions={[
                      <Button
                        type="link"
                        key="view"
                        onClick={() => handleTicketAction("View", item.id)}
                      >
                        Xem
                      </Button>,
                      <Button
                        type="link"
                        key="process"
                        onClick={() => handleTicketAction("Process", item.id)}
                      >
                        Xử lý
                      </Button>,
                    ]}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Text
                            strong
                            style={{ fontSize: 14, lineHeight: 1.2 }}
                          >
                            {item.subject}
                          </Text>
                          <Tag
                            color={getTypeColor(item.type)}
                            style={{ marginLeft: 0 }}
                          >
                            {getTypeText(item.type)}
                          </Tag>
                          <Tag
                            color={getStatusColor(item.status)}
                            style={{ marginLeft: 0 }}
                          >
                            {getStatusText(item.status)}
                          </Tag>
                        </div>

                        <div
                          style={{
                            marginTop: 6,
                            color: "#6b6f76",
                            fontSize: 13,
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text ellipsis style={{ maxWidth: 220 }}>
                            {item.customerName}
                          </Text>
                          <Text type="secondary" code style={{ marginLeft: 6 }}>
                            {item.id}
                          </Text>
                          <Text type="secondary" style={{ marginLeft: 6 }}>
                            {item.phone}
                          </Text>
                        </div>

                        <div
                          style={{
                            marginTop: 8,
                            color: "#8c8f94",
                            fontSize: 13,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.description}
                        </div>
                      </div>

                      <div style={{ textAlign: "right", minWidth: 120 }}>
                        <div style={{ fontSize: 12, color: "#8c8f94" }}>
                          <div>
                            {dayjs(item.createdAt).format("DD/MM HH:mm")}
                          </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 12, color: "#8c8f94" }}>
                            Hạn
                          </div>
                          <div style={{ fontWeight: 600 }}>
                            {dayjs(item.dueAt).format("DD/MM HH:mm")}
                          </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div style={{ width: 56 }}>
                              <Progress
                                percent={
                                  item.priority === "urgent"
                                    ? 100
                                    : item.priority === "high"
                                    ? 75
                                    : item.priority === "medium"
                                    ? 50
                                    : 25
                                }
                                showInfo={false}
                                strokeWidth={6}
                              />
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.priority.toUpperCase()}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Performance Metrics */}
          <Card title="Hiệu Suất" style={{ marginBottom: "16px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text>Thời gian phản hồi trung bình</Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <Text strong style={{ fontSize: "20px", marginRight: "8px" }}>
                    {stats.avgResponseTime}h
                  </Text>
                  <Progress
                    percent={75}
                    showInfo={false}
                    size="small"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div>
                <Text>Độ hài lòng khách hàng</Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <StarOutlined
                    style={{ color: "#fadb14", marginRight: "4px" }}
                  />
                  <Text strong style={{ fontSize: "20px" }}>
                    {stats.customerSatisfaction}/5.0
                  </Text>
                </div>
              </div>
            </Space>
          </Card>

          {/* Live Chat */}
          <Card title="Chat Trực Tiếp" style={{ marginBottom: "16px" }}>
            <List
              size="small"
              dataSource={mockChatSessions}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">
                      Trả lời
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={item.unreadCount} size="small">
                        <Avatar icon={<UserOutlined />} size="small" />
                      </Badge>
                    }
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Text style={{ flex: 1 }}>{item.customerName}</Text>
                        <Tag
                          color={item.status === "active" ? "green" : "orange"}
                        >
                          {item.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <Text ellipsis style={{ fontSize: "12px" }}>
                        {item.lastMessage}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Notifications */}
          <Card title="Thông Báo" extra={<BellOutlined />}>
            <List
              size="small"
              dataSource={mockNotifications}
              renderItem={(item) => (
                <List.Item>
                  <Alert
                    message={item.message}
                    type={item.severity}
                    showIcon
                    style={{ width: "100%" }}
                    description={
                      <Text type="secondary" style={{ fontSize: "11px" }}>
                        {dayjs(item.time).format("HH:mm DD/MM")}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
