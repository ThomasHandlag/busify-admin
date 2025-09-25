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
  ReloadOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReviewDetailModal from "../components/ReviewDetailModal";
import {
  getAllReviews,
  filterReviews,
  searchReviews,
  type Review,
  type ReviewFilterParams,
  type ReviewSearchParams,
  type ReviewResponse,
} from "../../../app/api/review";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ReviewsWithCustomerServicePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("filter");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Truy vấn để tải tất cả các đánh giá
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: errorReviews,
  } = useQuery({
    queryKey: ["reviews", pagination.current, pagination.pageSize],
    queryFn: async (): Promise<ReviewResponse["result"]> => {
      const response = await getAllReviews({
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      if (response.code === 200) {
        setPagination((prev) => ({
          ...prev,
          total: response.result.totalElements,
        }));
        return response.result;
      }
      return {
        reviews: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        hasNext: false,
        hasPrevious: false,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  // Mutation cho chức năng lọc đánh giá
  const filterMutation = useMutation({
    mutationFn: async (values: any) => {
      const { rating, ratingRange, dateRange, customerName } = values;
      const filterParams: ReviewFilterParams = {};

      // Xử lý lọc theo rating cụ thể
      if (rating) {
        filterParams.rating = rating;
      }

      // Xử lý lọc theo khoảng rating
      if (ratingRange && ratingRange.length === 2) {
        const [minRating, maxRating] = ratingRange.sort(
          (a: number, b: number) => a - b
        );
        filterParams.minRating = minRating;
        filterParams.maxRating = maxRating;
      }

      // Xử lý lọc theo khoảng thời gian
      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        filterParams.startDate = startDate.format("YYYY-MM-DD");
        filterParams.endDate = endDate.format("YYYY-MM-DD");
      }

      const response = await filterReviews({
        ...filterParams,
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      const results = response.result;

      // Lọc theo tên khách hàng ở phía client (nếu có)
      if (customerName) {
        results.reviews = results.reviews.filter((review) =>
          review.customerName.toLowerCase().includes(customerName.toLowerCase())
        );
      }

      return results;
    },
    onSuccess: (data) => {
      // Cập nhật cache với kết quả lọc
      queryClient.setQueryData(["reviews", "filtered"], data.reviews);
      setPagination((prev) => ({
        ...prev,
        total: data.totalElements,
        current: data.currentPage + 1,
      }));

      if (data.reviews.length === 0) {
        message.info("Không tìm thấy đánh giá phù hợp");
      } else {
        message.success(`Tìm thấy ${data.totalElements} đánh giá`);
      }

      setHasSearched(true);
    },
    onError: (error: Error) => {
      message.error(`Lỗi khi lọc đánh giá: ${error.message}`);
      queryClient.setQueryData(["reviews", "filtered"], []);
    },
  });

  // Mutation cho chức năng tìm kiếm đánh giá
  const searchMutation = useMutation({
    mutationFn: async (values: any) => {
      const { customerName, comment } = values;

      if (!customerName && !comment) {
        throw new Error("Vui lòng nhập ít nhất một từ khóa để tìm kiếm");
      }

      const searchParams: ReviewSearchParams = {};

      if (customerName) {
        searchParams.customerName = customerName;
      }

      if (comment) {
        searchParams.comment = comment;
      }

      const response = await searchReviews({
        ...searchParams,
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      return response.result;
    },
    onSuccess: (data) => {
      // Cập nhật cache với kết quả tìm kiếm
      queryClient.setQueryData(["reviews", "filtered"], data.reviews);
      setPagination((prev) => ({
        ...prev,
        total: data.totalElements,
        current: data.currentPage + 1,
      }));

      if (data.reviews.length === 0) {
        message.info("Không tìm thấy đánh giá phù hợp với từ khóa tìm kiếm");
      } else {
        message.success(`Tìm thấy ${data.totalElements} đánh giá phù hợp`);
      }

      setHasSearched(true);
    },
    onError: (error: Error) => {
      if (error.message.includes("Vui lòng nhập")) {
        message.warning(error.message);
      } else {
        message.error(`Lỗi khi tìm kiếm đánh giá: ${error.message}`);
        queryClient.setQueryData(["reviews", "filtered"], []);
      }
    },
  });

  const handleFilter = (values: any) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    filterMutation.mutate(values);
  };

  const handleSearch = (values: any) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    searchMutation.mutate(values);
  };

  const handleReset = () => {
    form.resetFields();
    searchForm.resetFields();
    setHasSearched(false);
    setPagination({ current: 1, pageSize: 10, total: 0 });
    queryClient.removeQueries({ queryKey: ["reviews", "filtered"] });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["reviews", pagination.current, pagination.pageSize],
    });
    if (hasSearched) {
      // Nếu đã tìm kiếm trước đó, thực hiện lại hành động tìm kiếm hoặc lọc
      if (activeTab === "search") {
        searchMutation.mutate(searchForm.getFieldsValue());
      } else {
        filterMutation.mutate(form.getFieldsValue());
      }
    }
    message.success("Đang làm mới dữ liệu...");
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

  // Quyết định dữ liệu nào hiển thị dựa trên trạng thái tìm kiếm
  const displayReviews = hasSearched
    ? queryClient.getQueryData<Review[]>(["reviews", "filtered"]) || []
    : reviewsData?.reviews || [];

  // Tính toán thống kê dựa trên dữ liệu hiển thị hiện tại
  const stats = {
    total: displayReviews.length,
    excellent: displayReviews.filter((r) => r.rating === 5).length,
    good: displayReviews.filter((r) => r.rating === 4).length,
    average: displayReviews.filter((r) => r.rating === 3).length,
    poor: displayReviews.filter((r) => r.rating <= 2).length,
    averageRating:
      displayReviews.length > 0
        ? (
            displayReviews.reduce((sum, r) => sum + r.rating, 0) /
            displayReviews.length
          ).toFixed(1)
        : "0.0",
  };

  // Trạng thái loading tổng hợp
  const isLoading =
    isLoadingReviews || filterMutation.isPending || searchMutation.isPending;

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: newPagination.total,
    });
    if (hasSearched) {
      if (activeTab === "search") {
        searchMutation.mutate(searchForm.getFieldsValue());
      } else {
        filterMutation.mutate(form.getFieldsValue());
      }
    }
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          <StarOutlined /> Quản lý đánh giá khách hàng
        </Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          Làm mới
        </Button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {isErrorReviews && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={
            errorReviews?.message || "Không thể tải danh sách đánh giá"
          }
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

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
                        loading={searchMutation.isPending}
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
                      loading={filterMutation.isPending}
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
        {displayReviews.length === 0 && !isLoading ? (
          <Empty description="Không có đánh giá nào" />
        ) : (
          <>
            {hasSearched && (
              <Alert
                message={`Tìm thấy ${displayReviews.length} đánh giá phù hợp${
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
                message={`Hiển thị tất cả ${displayReviews.length} đánh giá trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={displayReviews}
              rowKey="reviewId"
              loading={isLoading}
              scroll={{ x: 1000 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: hasSearched
                  ? pagination.total
                  : reviewsData?.totalElements,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} đánh giá`,
              }}
              onChange={handleTableChange}
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
