import React, { useState } from "react";
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Tooltip,
  Breadcrumb,
  Empty,
  Divider,
  Modal,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { TableProps, ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useAuditLogsWithPagination } from "../hooks/useAuditLogs";
import {
  type AuditLogResponseDTO,
  type AuditLogFilterParams,
  AuditAction,
  TargetEntity,
  getActionColor,
  getEntityColor,
  parseDetails,
} from "../../../app/api/audit-log";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AuditLogManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedLog, setSelectedLog] = useState<AuditLogResponseDTO | null>(
    null
  );
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState<
    Omit<AuditLogFilterParams, "page" | "size">
  >({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  // Fetch audit logs using TanStack Query
  const {
    data: auditLogsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuditLogsWithPagination(
    pagination.current - 1, // API uses 0-based pagination
    pagination.pageSize,
    filters
  );

  const auditLogs = auditLogsData?.result?.auditLogs || [];
  const totalElements = auditLogsData?.result?.totalElements || 0;

  // Handle search form submission
  const handleSearch = async (values: Record<string, unknown>) => {
    const { userId, action, targetEntity, dateRange } = values;

    const newFilters: Omit<AuditLogFilterParams, "page" | "size"> = {};

    if (userId && typeof userId === "string") {
      newFilters.userId = parseInt(userId);
    }
    if (action && typeof action === "string") {
      newFilters.action = action;
    }
    if (targetEntity && typeof targetEntity === "string") {
      newFilters.targetEntity = targetEntity;
    }
    if (Array.isArray(dateRange) && dateRange[0] && dateRange[1]) {
      newFilters.startDate = (dateRange[0] as dayjs.Dayjs).toISOString();
      newFilters.endDate = (dateRange[1] as dayjs.Dayjs).toISOString();
    }

    setFilters(newFilters);
    setPagination({ ...pagination, current: 1 });
  };

  // Handle form reset
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
  };

  // Handle pagination change
  const handleTableChange: TableProps<AuditLogResponseDTO>["onChange"] = (
    paginationInfo
  ) => {
    if (paginationInfo) {
      setPagination({
        current: paginationInfo.current || 1,
        pageSize: paginationInfo.pageSize || 20,
      });
    }
  };

  // Handle view detail
  const handleViewDetail = (log: AuditLogResponseDTO) => {
    setSelectedLog(log);
    setIsDetailModalVisible(true);
  };

  // Render user info
  const renderUserInfo = (record: AuditLogResponseDTO) => {
    if (!record.userId) {
      return (
        <div>
          <Text type="secondary">System</Text>
          <div style={{ fontSize: "12px", color: "#999" }}>Auto action</div>
        </div>
      );
    }

    return (
      <div>
        <div style={{ fontWeight: 500 }}>
          <UserOutlined /> {record.userName || "Unknown"}
        </div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          {record.userEmail}
        </div>
        <div style={{ fontSize: "11px", color: "#999" }}>
          ID: {record.userId}
        </div>
      </div>
    );
  };

  // Render details preview
  const renderDetailsPreview = (details: string) => {
    const parsed = parseDetails(details);
    if (!parsed) return <Text type="secondary">Invalid JSON</Text>;

    const keys = Object.keys(parsed);
    const previewKeys = keys.slice(0, 2);
    const remainingCount = keys.length - 2;

    return (
      <div>
        {previewKeys.map((key) => (
          <div key={key} style={{ fontSize: "12px" }}>
            <Text strong>{key}:</Text> {String(parsed[key])}
          </div>
        ))}
        {remainingCount > 0 && (
          <Text type="secondary" style={{ fontSize: "11px" }}>
            +{remainingCount} more fields
          </Text>
        )}
      </div>
    );
  };

  // Table columns
  const columns: ColumnsType<AuditLogResponseDTO> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: "User",
      key: "user",
      width: 200,
      render: (_, record) => renderUserInfo(record),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (action) => <Tag color={getActionColor(action)}>{action}</Tag>,
      filters: Object.values(AuditAction).map((action) => ({
        text: action,
        value: action,
      })),
      filterMultiple: false,
    },
    {
      title: "Entity",
      dataIndex: "targetEntity",
      key: "targetEntity",
      width: 120,
      render: (entity) => (
        <Tag color={getEntityColor(entity)}>{entity.replace("_", " ")}</Tag>
      ),
      filters: Object.values(TargetEntity).map((entity) => ({
        text: entity.replace("_", " "),
        value: entity,
      })),
      filterMultiple: false,
    },
    {
      title: "Target ID",
      dataIndex: "targetId",
      key: "targetId",
      width: 100,
      render: (id) => <Text code>{id}</Text>,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
      render: (details) => renderDetailsPreview(details),
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (timestamp) => (
        <div>
          <div>
            <CalendarOutlined /> {dayjs(timestamp).format("DD/MM/YYYY")}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {dayjs(timestamp).format("HH:mm:ss")}
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  if (isError) {
    return (
      <div style={{ padding: "24px" }}>
        <Card>
          <Empty
            description={`Error loading audit logs: ${
              error?.message || "Unknown error"
            }`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button type="primary" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "System" }, { title: "Audit Logs" }]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <SettingOutlined /> Audit Logs Management
      </Title>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="userId" label="User ID">
                <Input
                  placeholder="Enter user ID"
                  type="number"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="action" label="Action">
                <Select placeholder="Select action" allowClear>
                  {Object.values(AuditAction).map((action) => (
                    <Option key={action} value={action}>
                      {action}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="targetEntity" label="Target Entity">
                <Select placeholder="Select entity" allowClear>
                  {Object.values(TargetEntity).map((entity) => (
                    <Option key={entity} value={entity}>
                      {entity.replace("_", " ")}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="dateRange" label="Date Range">
                <RangePicker
                  style={{ width: "100%" }}
                  placeholder={["Start date", "End date"]}
                  showTime
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={isLoading}
                >
                  Search
                </Button>
                <Button icon={<ClearOutlined />} onClick={handleReset}>
                  Clear Filters
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Results Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={auditLogs}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalElements,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} audit logs`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`Audit Log Details - #${selectedLog?.id}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID" span={1}>
                <Text strong>#{selectedLog.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Timestamp" span={1}>
                {dayjs(selectedLog.timestamp).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="User" span={1}>
                {selectedLog.userId ? (
                  <div>
                    <div>{selectedLog.userName}</div>
                    <Text type="secondary">{selectedLog.userEmail}</Text>
                    <div>
                      <Text code>ID: {selectedLog.userId}</Text>
                    </div>
                  </div>
                ) : (
                  <Text type="secondary">System Action</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Action" span={1}>
                <Tag color={getActionColor(selectedLog.action)}>
                  {selectedLog.action}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Target Entity" span={1}>
                <Tag color={getEntityColor(selectedLog.targetEntity)}>
                  {selectedLog.targetEntity.replace("_", " ")}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Target ID" span={1}>
                <Text code>{selectedLog.targetId}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Details</Divider>
            <Card size="small">
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  overflow: "auto",
                  maxHeight: "300px",
                }}
              >
                {JSON.stringify(parseDetails(selectedLog.details), null, 2)}
              </pre>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogManagement;
