import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Breadcrumb,
  Modal,
  message,
  Tooltip,
  Drawer,
  Descriptions,
  List,
  Form,
} from "antd";
import type { TableProps } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
} from "@ant-design/icons";
// Bus operator API imports - you'll need to create these
// import {
//   deleteBusOperatorById,
//   getAllBusOperatorsManagement,
//   type BusOperatorFilterParams,
// } from "../../app/api/bus-operator";
import { useQuery } from "@tanstack/react-query";
import {
  deleteBusOperatorById,
  getAllBusOperatorsManagement,
  type BusOperatorFilterParams,
} from "../../app/api/bus-operator";
import BusOperatorModal from "./bus-operator-modal";

interface DataType {
  key: string;
  operatorId: number;
  operatorName: string;
  email: string;
  hotline: string;
  address: string;
  description?: string;
  licensePath: string;
  status: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: string;
    emailVerified: boolean;
    authProvider: string;
    createdAt: string;
    updatedAt: string;
    roleName: string | null;
    roleId: number | null;
  };
  busesOwned: Array<{
    id: number;
    operatorId: number;
    licensePlate: string;
    model: string;
    status: string;
  }>;
  dateOfResignation: string;
}

const BusOperatorManagement: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Drawer states
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<DataType | null>(
    null
  );

  const [refreshKey, setRefreshKey] = useState(0);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  const fetchBusOperators = async () => {
    const params: BusOperatorFilterParams = {
      search: searchText || undefined,
      status: selectedStatus || undefined,
      page: currentPage,
      size: pageSize,
      sortBy: "operatorName",
      sortDirection: "asc",
    };

    // TODO: Implement this API call with params
    const response = await getAllBusOperatorsManagement(params);
    return response.result;
  };

  const {
    data: operatorData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "bus-operators",
      searchText,
      selectedStatus,
      currentPage,
      pageSize,
      refreshKey,
    ],
    queryFn: fetchBusOperators,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  // Remove roles query since it's not needed for bus operators

  // Reset page to 0 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchText, selectedStatus]);

  // Handler functions
  const handleEdit = (record: DataType) => {
    form.setFieldsValue({
      operatorId: record.operatorId,
      operatorName: record.operatorName,
      email: record.email,
      hotline: record.hotline,
      address: record.address,
      description: record.description,
      licensePath: record.licensePath,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: "Are you sure you want to delete this bus operator?",
      content: `This will permanently delete ${record.operatorName} and all associated data.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        const deleteOperator = await deleteBusOperatorById(record.operatorId);
        if (deleteOperator.code === 200) {
          setRefreshKey((prev) => prev + 1);
          message.success(
            `Bus operator ${record.operatorName} has been deleted`
          );
        } else {
          message.error(`Failed to delete bus operator ${record.operatorName}`);
        }
      },
    });
  };

  // Handler to open drawer with operator details
  const handleViewDetails = (record: DataType) => {
    setSelectedOperator(record);
    setDrawerVisible(true);
  };

  // Define columns inside component to access handlers
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "operatorId",
      key: "operatorId",
      width: 80,
      sorter: (a, b) => a.operatorId - b.operatorId,
    },
    {
      title: "Tên nhà xe",
      dataIndex: "operatorName",
      key: "operatorName",
      render: (text, record) => (
        <a
          onClick={() => handleViewDetails(record)}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          {text}
        </a>
      ),
      sorter: (a, b) => a.operatorName.localeCompare(b.operatorName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <div className="flex items-center gap-1">
          <MailOutlined className="text-gray-400" />
          {email}
        </div>
      ),
    },
    {
      title: "Hotline",
      dataIndex: "hotline",
      key: "hotline",
      render: (phone) => (
        <div className="flex items-center gap-1">
          <PhoneOutlined className="text-gray-400" />
          {phone}
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Chủ sở hữu",
      key: "owner",
      render: (_, record) => (
        <div>
          <div>{record.owner.fullName}</div>
          <small className="text-gray-500">{record.owner.phoneNumber}</small>
        </div>
      ),
    },
    {
      title: "Giấy phép",
      key: "licensePath",
      render: (_, record) => (
        <div>
          <a
            href={record.licensePath}
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem giấy phép
          </a>
        </div>
      ),
    },

    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        let color = "green";
        let text = "Hoạt động";
        if (status === "suspended") {
          color = "volcano";
          text = "Tạm ngưng";
        }
        if (status === "pending_approval") {
          color = "geekblue";
          text = "Chờ duyệt";
        }
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Tạm ngưng", value: "suspended" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày đăng ký",
      key: "createdAt",
      render: (_, record) => (
        <div>{new Date(record.dateOfResignation).toLocaleDateString()}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa nhà xe">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="!text-blue-500"
            />
          </Tooltip>
          <Tooltip title="Xóa nhà xe">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              className="!text-red-500"
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Bảng điều khiển</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý nhà xe</Breadcrumb.Item>
      </Breadcrumb>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số nhà xe"
              value={operatorData?.totalElements || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhà xe hoạt động"
              value={
                operatorData?.content?.filter(
                  (op: DataType) => op.status === "active"
                ).length || 0
              }
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhà xe chờ duyệt"
              value={
                operatorData?.content?.filter(
                  (op: DataType) => op.status === "pending_approval"
                ).length || 0
              }
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhà xe tạm ngưng"
              value={
                operatorData?.content?.filter(
                  (op: DataType) => op.status === "suspended"
                ).length || 0
              }
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Card style={{ marginBottom: "16px" }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space>
              <Input
                placeholder="Tìm kiếm nhà xe..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 150 }}
                defaultValue={"active"}
              >
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="suspended">Tạm ngưng</Select.Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                loading={isLoading}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm nhà xe
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table<DataType>
          columns={columns}
          dataSource={operatorData?.content || []}
          loading={isLoading}
          rowKey="operatorId"
          pagination={{
            current: currentPage + 1,
            pageSize: pageSize,
            total: operatorData?.totalElements || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, size) => {
              setCurrentPage(page - 1);
              setPageSize(size || 10);
            },
            onShowSizeChange: (_, size) => {
              setCurrentPage(0);
              setPageSize(size);
            },
          }}
          scroll={{ x: 2000 }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Thông tin chi tiết nhà xe
          </div>
        }
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={<Button onClick={() => setDrawerVisible(false)}>Đóng</Button>}
      >
        {selectedOperator && (
          <div>
            {/* Owner Info */}
            <Card title="Thông tin chủ sở hữu" style={{ marginBottom: 16 }}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="ID">
                  {selectedOperator.owner.id}
                </Descriptions.Item>
                <Descriptions.Item label="Họ tên">
                  {selectedOperator.owner.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedOperator.owner.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedOperator.owner.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedOperator.owner.address}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={
                      selectedOperator.owner.status === "active"
                        ? "green"
                        : "volcano"
                    }
                  >
                    {selectedOperator.owner.status === "active"
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Email xác thực">
                  <Tag
                    color={
                      selectedOperator.owner.emailVerified ? "green" : "orange"
                    }
                  >
                    {selectedOperator.owner.emailVerified
                      ? "Đã xác thực"
                      : "Chưa xác thực"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nhà cung cấp">
                  {selectedOperator.owner.authProvider}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {new Date(
                    selectedOperator.owner.createdAt
                  ).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật lần cuối">
                  {new Date(
                    selectedOperator.owner.updatedAt
                  ).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Buses Info */}
            <Card
              title={`Danh sách xe (${selectedOperator.busesOwned.length} xe)`}
            >
              <List
                dataSource={selectedOperator.busesOwned}
                renderItem={(bus) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <CarOutlined
                          style={{ fontSize: 24, color: "#1890ff" }}
                        />
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            Biển số: <strong>{bus.licensePlate}</strong>
                          </span>
                          <Tag
                            color={
                              bus.status === "active" ? "green" : "volcano"
                            }
                          >
                            {bus.status === "active"
                              ? "Hoạt động"
                              : "Không hoạt động"}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>Loại xe: {bus.model}</div>
                          <div style={{ color: "#666", fontSize: "12px" }}>
                            ID: {bus.id}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Drawer>

      {/* Modal for Add/Edit Bus Operator */}
      <BusOperatorModal
        isModalVisible={modalVisible}
        setIsModalVisible={setModalVisible}
        form={form}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default BusOperatorManagement;
