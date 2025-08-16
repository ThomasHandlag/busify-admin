/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Tabs,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  ClearOutlined,
  MessageOutlined,
  FilterOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import ComplaintDetailModal from "../components/ComplaintDetailModal";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Mock data based on API response
const mockComplaints = [
  {
    id: 1,
    title: "Khiếu nại về ghế",
    description: "Ghế không thoải mái, làm tôi đau lưng suốt chuyến đi",
    customerName: "Nguyễn Văn A",
    createdAt: "2025-07-25T22:00:00Z",
    status: "New",
  },
  {
    id: 2,
    title: "Khiếu nại về thời gian",
    description: "Xe đến muộn 30 phút so với lịch trình đã thông báo",
    customerName: "Trần Thị B",
    createdAt: "2025-07-25T14:00:00Z",
    status: "pending",
  },
  {
    id: 3,
    title: "Khiếu nại về wifi",
    description: "Wifi không hoạt động trong suốt chuyến đi",
    customerName: "Lê Văn C",
    createdAt: "2025-07-25T15:00:00Z",
    status: "New",
  },
  {
    id: 4,
    title: "Khiếu nại về điều hòa",
    description: "Điều hòa không mát, quá nóng trong xe",
    customerName: "Phạm Thị D",
    createdAt: "2025-07-24T16:00:00Z",
    status: "in_progress",
  },
  {
    id: 5,
    title: "Khiếu nại về tài xế",
    description: "Tài xế lái xe quá nhanh, không an toàn",
    customerName: "Hoàng Văn E",
    createdAt: "2025-07-24T18:00:00Z",
    status: "resolved",
  },
  {
    id: 6,
    title: "Khiếu nại về vệ sinh",
    description: "Xe không sạch sẽ, có mùi khó chịu",
    customerName: "Ngô Thị F",
    createdAt: "2025-07-23T10:00:00Z",
    status: "rejected",
  },
];

interface Complaint {
  id: number;
  title: string;
  description: string;
  customerName: string;
  createdAt: string;
  status: string;
}

const ComplaintsWithCustomerServicePage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [searchResults, setSearchResults] =
    useState<Complaint[]>(mockComplaints);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = async (values: any) => {
    const { customerName, title, description } = values;

    if (!customerName && !title && !description) {
      message.warning("Vui lòng nhập ít nhất một từ khóa để tìm kiếm");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      let results = mockComplaints;

      if (customerName) {
        results = results.filter((complaint) =>
          complaint.customerName
            .toLowerCase()
            .includes(customerName.toLowerCase())
        );
      }
      if (title) {
        results = results.filter((complaint) =>
          complaint.title.toLowerCase().includes(title.toLowerCase())
        );
      }
      if (description) {
        results = results.filter((complaint) =>
          complaint.description
            .toLowerCase()
            .includes(description.toLowerCase())
        );
      }

      setSearchResults(results);
      setLoading(false);

      if (results.length === 0) {
        message.info("Không tìm thấy khiếu nại phù hợp với từ khóa tìm kiếm");
      } else {
        message.success(`Tìm thấy ${results.length} khiếu nại phù hợp`);
      }
    }, 1000);
  };

  const handleFilter = async (values: any) => {
    const { status, dateRange, customerName } = values;

    setLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      let results = mockComplaints;

      if (status) {
        results = results.filter((complaint) => complaint.status === status);
      }

      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        results = results.filter((complaint) => {
          const complaintDate = dayjs(complaint.createdAt);
          return (
            complaintDate.isAfter(startDate) && complaintDate.isBefore(endDate)
          );
        });
      }

      if (customerName) {
        results = results.filter((complaint) =>
          complaint.customerName
            .toLowerCase()
            .includes(customerName.toLowerCase())
        );
      }

      setSearchResults(results);
      setLoading(false);

      if (results.length === 0) {
        message.info("Không tìm thấy khiếu nại phù hợp");
      } else {
        message.success(`Tìm thấy ${results.length} khiếu nại`);
      }
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
    searchForm.resetFields();
    setSearchResults(mockComplaints);
    setHasSearched(false);
  };

  const handleViewDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalVisible(true);
  };

  const handleUpdateComplaint = (updatedComplaint: any) => {
    setSearchResults((prev) =>
      prev.map((complaint) =>
        complaint.id === updatedComplaint.id
          ? { ...complaint, status: updatedComplaint.status }
          : complaint
      )
    );
    message.success("Khiếu nại đã được xử lý thành công");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "red";
      case "pending":
        return "orange";
      case "in_progress":
        return "blue";
      case "resolved":
        return "green";
      case "rejected":
        return "volcano";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "New":
        return "Mới";
      case "pending":
        return "Chờ xử lý";
      case "in_progress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const columns: TableProps<Complaint>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => (
        <Text strong style={{ color: "#1890ff" }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Text strong style={{ color: "#262626" }}>
          <ExclamationCircleOutlined
            style={{ marginRight: "8px", color: "#faad14" }}
          />
          {title}
        </Text>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <div style={{ maxWidth: "300px" }}>
          <Text ellipsis={{ tooltip: description }}>
            <MessageOutlined style={{ marginRight: "8px" }} />
            {description}
          </Text>
        </div>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => (
        <Space>
          <UserOutlined />
          {name}
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Space direction="vertical" size="small">
          <div>
            <CalendarOutlined /> {dayjs(date).format("DD/MM/YYYY")}
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {dayjs(date).format("HH:mm")}
          </Text>
        </Space>
      ),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
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
    new: searchResults.filter((c) => c.status === "New").length,
    pending: searchResults.filter((c) => c.status === "pending").length,
    inProgress: searchResults.filter((c) => c.status === "in_progress").length,
    resolved: searchResults.filter((c) => c.status === "resolved").length,
    rejected: searchResults.filter((c) => c.status === "rejected").length,
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
            title: "Quản lý khiếu nại",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <ExclamationCircleOutlined /> Quản lý khiếu nại khách hàng
      </Title>

      {/* Search and Filter Tabs */}
      <Card style={{ marginBottom: "24px" }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <SearchOutlined />
                Tìm kiếm
              </span>
            }
            key="search"
          >
            <Form
              form={searchForm}
              layout="vertical"
              onFinish={handleSearch}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col xs={24} sm={8} lg={8}>
                  <Form.Item name="customerName" label="Tên khách hàng">
                    <Input
                      placeholder="Nhập tên khách hàng"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} lg={8}>
                  <Form.Item name="title" label="Tiêu đề khiếu nại">
                    <Input
                      placeholder="Nhập tiêu đề khiếu nại"
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} lg={8}>
                  <Form.Item name="description" label="Nội dung khiếu nại">
                    <Input
                      placeholder="Nhập từ khóa trong nội dung"
                      prefix={<MessageOutlined />}
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
          </TabPane>
          <TabPane
            tab={
              <span>
                <FilterOutlined />
                Lọc nâng cao
              </span>
            }
            key="filter"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFilter}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col xs={24} sm={8} lg={8}>
                  <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Chọn trạng thái" allowClear>
                      <Option value="New">Mới</Option>
                      <Option value="pending">Chờ xử lý</Option>
                      <Option value="in_progress">Đang xử lý</Option>
                      <Option value="resolved">Đã giải quyết</Option>
                      <Option value="rejected">Từ chối</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} lg={8}>
                  <Form.Item name="dateRange" label="Khoảng thời gian">
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} lg={8}>
                  <Form.Item name="customerName" label="Tên khách hàng">
                    <Input
                      placeholder="Nhập tên khách hàng"
                      prefix={<UserOutlined />}
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
                      icon={<FilterOutlined />}
                      loading={loading}
                    >
                      Lọc khiếu nại
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={handleReset}>
                      Xóa bộ lọc
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Tổng khiếu nại"
              value={stats.total}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Mới"
              value={stats.new}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.inProgress}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Đã giải quyết"
              value={stats.resolved}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Results Table */}
      <Card>
        {searchResults.length === 0 ? (
          <Empty description="Không có khiếu nại nào" />
        ) : (
          <>
            {hasSearched && (
              <Alert
                message={`Tìm thấy ${searchResults.length} khiếu nại phù hợp${
                  activeTab === "search"
                    ? " với từ khóa tìm kiếm"
                    : " với bộ lọc"
                }`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            {!hasSearched && (
              <Alert
                message={`Hiển thị tất cả ${searchResults.length} khiếu nại trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={searchResults}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} khiếu nại`,
              }}
            />
          </>
        )}
      </Card>

      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedComplaint(null);
        }}
        onUpdate={handleUpdateComplaint}
      />
    </div>
  );
};

export default ComplaintsWithCustomerServicePage;
