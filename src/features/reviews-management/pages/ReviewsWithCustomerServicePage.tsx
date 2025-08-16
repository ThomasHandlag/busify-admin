/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Card,
  Form,
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
  Rate,
  Input,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  ClearOutlined,
  MessageOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import ReviewDetailModal from "../components/ReviewDetailModal";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Mock data based on API response
const mockReviews = [
  {
    reviewId: 1,
    rating: 5,
    customerName: "Nguyễn Văn Admin",
    comment: "Chuyến đi tuyệt vời!",
    createdAt: "2025-07-25T21:00:00Z",
  },
  {
    reviewId: 2,
    rating: 4,
    customerName: "Nguyễn Văn Admin",
    comment: "Chuyến đi thoải mái, tài xế thân thiện",
    createdAt: "2025-07-25T13:00:00Z",
  },
  {
    reviewId: 3,
    rating: 3,
    customerName: "Nguyễn Văn Admin",
    comment: "Xe sạch sẽ nhưng đến muộn 15 phút",
    createdAt: "2025-07-25T17:00:00Z",
  },
  {
    reviewId: 4,
    rating: 5,
    customerName: "Nguyễn Văn Admin",
    comment: "Dịch vụ tốt, sẽ quay lại!",
    createdAt: "2025-07-25T16:00:00Z",
  },
  {
    reviewId: 5,
    rating: 4,
    customerName: "Nguyễn Văn Admin",
    comment: "Wifi hơi yếu nhưng tổng thể ổn",
    createdAt: "2025-07-25T18:00:00Z",
  },
  {
    reviewId: 6,
    rating: 5,
    customerName: "Nguyễn Văn Admin",
    comment: "Tài xế lái an toàn, rất hài lòng",
    createdAt: "2025-07-25T22:00:00Z",
  },
  {
    reviewId: 7,
    rating: 4,
    customerName: "Nguyễn Văn Admin",
    comment: "Ghế ngồi êm, chuyến đi suôn sẻ",
    createdAt: "2025-07-25T23:00:00Z",
  },
  {
    reviewId: 8,
    rating: 2,
    customerName: "Trần Thị B",
    comment: "Xe cũ, điều hòa không mát",
    createdAt: "2025-07-24T15:30:00Z",
  },
  {
    reviewId: 9,
    rating: 1,
    customerName: "Lê Văn C",
    comment: "Tài xế lái rất nhanh, cảm thấy không an toàn",
    createdAt: "2025-07-24T10:15:00Z",
  },
];

interface Review {
  reviewId: number;
  rating: number;
  customerName: string;
  comment: string;
  createdAt: string;
}

const ReviewsWithCustomerServicePage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Review[]>(mockReviews);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("filter");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilter = async (values: any) => {
    const { rating, ratingRange, dateRange, customerName } = values;

    setLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      let results = mockReviews;

      // Filter by exact rating
      if (rating) {
        results = results.filter((review) => review.rating === rating);
      }

      // Filter by rating range
      if (ratingRange && ratingRange.length === 2) {
        const [minRating, maxRating] = ratingRange;
        results = results.filter(
          (review) => review.rating >= minRating && review.rating <= maxRating
        );
      }

      // Filter by date range
      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        results = results.filter((review) => {
          const reviewDate = dayjs(review.createdAt);
          return reviewDate.isAfter(startDate) && reviewDate.isBefore(endDate);
        });
      }

      // Filter by customer name
      if (customerName) {
        results = results.filter((review) =>
          review.customerName.toLowerCase().includes(customerName.toLowerCase())
        );
      }

      setSearchResults(results);
      setLoading(false);

      if (results.length === 0) {
        message.info("Không tìm thấy đánh giá phù hợp");
      } else {
        message.success(`Tìm thấy ${results.length} đánh giá`);
      }
    }, 1000);
  };

  // New search function
  const handleSearch = async (values: any) => {
    const { customerName, comment } = values;

    if (!customerName && !comment) {
      message.warning("Vui lòng nhập ít nhất một từ khóa để tìm kiếm");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      let results = mockReviews;

      // Filter by customer name
      if (customerName) {
        results = results.filter((review) =>
          review.customerName.toLowerCase().includes(customerName.toLowerCase())
        );
      }

      // Filter by comment content
      if (comment) {
        results = results.filter((review) =>
          review.comment.toLowerCase().includes(comment.toLowerCase())
        );
      }

      setSearchResults(results);
      setLoading(false);

      if (results.length === 0) {
        message.info("Không tìm thấy đánh giá phù hợp với từ khóa tìm kiếm");
      } else {
        message.success(`Tìm thấy ${results.length} đánh giá phù hợp`);
      }
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
    searchForm.resetFields();
    setSearchResults(mockReviews);
    setHasSearched(false);
  };

  const handleViewDetail = (review: Review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "green";
    if (rating >= 3) return "orange";
    return "red";
  };

  const getRatingText = (rating: number) => {
    if (rating === 5) return "Xuất sắc";
    if (rating === 4) return "Tốt";
    if (rating === 3) return "Bình thường";
    if (rating === 2) return "Kém";
    return "Rất kém";
  };

  const columns: TableProps<Review>["columns"] = [
    {
      title: "ID",
      dataIndex: "reviewId",
      key: "reviewId",
      width: 80,
      render: (id) => (
        <Text strong style={{ color: "#1890ff" }}>
          #{id}
        </Text>
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
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Space direction="vertical" size="small">
          <Rate disabled defaultValue={rating} />
          <Tag color={getRatingColor(rating)}>
            {rating}/5 - {getRatingText(rating)}
          </Tag>
        </Space>
      ),
      width: 150,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      render: (comment) => (
        <div style={{ maxWidth: "300px" }}>
          <Text ellipsis={{ tooltip: comment }}>
            <MessageOutlined style={{ marginRight: "8px" }} />
            {comment}
          </Text>
        </div>
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
    excellent: searchResults.filter((r) => r.rating === 5).length,
    good: searchResults.filter((r) => r.rating === 4).length,
    average: searchResults.filter((r) => r.rating === 3).length,
    poor: searchResults.filter((r) => r.rating <= 2).length,
    averageRating: (
      searchResults.reduce((sum, r) => sum + r.rating, 0) / searchResults.length
    ).toFixed(1),
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
            title: "Quản lý đánh giá",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <StarOutlined /> Quản lý đánh giá khách hàng
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
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item name="customerName" label="Tên khách hàng">
                    <Input
                      placeholder="Nhập tên khách hàng cần tìm"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item name="comment" label="Nội dung đánh giá">
                    <Input
                      placeholder="Nhập từ khóa trong nội dung đánh giá"
                      prefix={<MessageOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} lg={8}>
                  <Form.Item label=" " style={{ marginBottom: 0 }}>
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
                  </Form.Item>
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
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="rating" label="Đánh giá cụ thể">
                    <Select placeholder="Chọn số sao" allowClear>
                      <Option value={5}>5 sao - Xuất sắc</Option>
                      <Option value={4}>4 sao - Tốt</Option>
                      <Option value={3}>3 sao - Bình thường</Option>
                      <Option value={2}>2 sao - Kém</Option>
                      <Option value={1}>1 sao - Rất kém</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="ratingRange" label="Khoảng đánh giá">
                    <Select
                      mode="multiple"
                      placeholder="Chọn khoảng sao"
                      maxCount={2}
                      allowClear
                    >
                      <Option value={1}>1 sao</Option>
                      <Option value={2}>2 sao</Option>
                      <Option value={3}>3 sao</Option>
                      <Option value={4}>4 sao</Option>
                      <Option value={5}>5 sao</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="dateRange" label="Khoảng thời gian">
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
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
                      Lọc đánh giá
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
              title="Tổng đánh giá"
              value={stats.total}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Điểm trung bình"
              value={stats.averageRating}
              suffix="/5"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="5 sao"
              value={stats.excellent}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="4 sao"
              value={stats.good}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="3 sao"
              value={stats.average}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="≤2 sao"
              value={stats.poor}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Results Table */}
      <Card>
        {searchResults.length === 0 ? (
          <Empty description="Không có đánh giá nào" />
        ) : (
          <>
            {hasSearched && (
              <Alert
                message={`Tìm thấy ${searchResults.length} đánh giá phù hợp${
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
                message={`Hiển thị tất cả ${searchResults.length} đánh giá trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={searchResults}
              rowKey="reviewId"
              loading={loading}
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} đánh giá`,
              }}
            />
          </>
        )}
      </Card>

      {/* Review Detail Modal */}
      <ReviewDetailModal
        review={selectedReview}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedReview(null);
        }}
      />
    </div>
  );
};

export default ReviewsWithCustomerServicePage;
