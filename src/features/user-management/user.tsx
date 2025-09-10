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
  Form,
  message,
  Tooltip,
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
} from "@ant-design/icons";
import {
  deleteUserById,
  getAllUsersManagement,
  type UserFilterParams,
} from "../../app/api/user";
import UserModal from "./user-modal";
import { getAllRoles } from "../../app/api/role";
import type { Role } from "../../types/role";
import { useQuery } from "@tanstack/react-query";

interface DataType {
  key: string;
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
  emailVerified: boolean;
  authProvider: string;
  roleName: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  statusDisplayName: string;
  authProviderDisplayName: string;
  daysSinceCreated: number;
  daysSinceLastUpdate: number;
  canBeDeleted: boolean;
  canChangeRole: boolean;
}

const UserManagement: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = async () => {
    const params: UserFilterParams = {
      search: searchText || undefined,
      status: selectedStatus || undefined,
      roleName: selectedRole || undefined,
      page: currentPage,
      size: pageSize,
      sortBy: "createdAt",
      sortDirection: "desc",
    };
    const response = await getAllUsersManagement(params);
    return response.result;
  };

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "users",
      searchText,
      selectedStatus,
      selectedRole,
      currentPage,
      pageSize,
      refreshKey,
    ],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  // React Query for roles
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await getAllRoles();
      return response.result as Role[];
    },
    staleTime: 1000 * 60 * 10,
  });

  // Reset page to 0 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchText, selectedStatus, selectedRole]);

  // Handler functions
  const handleEdit = (record: DataType) => {
    console.log("Edit user:", record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: `This will permanently delete ${record.fullName} and all associated data.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        const deleteUser = await deleteUserById(record.id);
        if (deleteUser.code === 200) {
          setRefreshKey((prev) => prev + 1);
          message.success(`User ${record.fullName} has been deleted`);
        }
      },
    });
  };

  // Define columns inside component to access handlers
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email, record) => (
        <div>
          <div className="flex items-center gap-1">
            <MailOutlined className="text-gray-400" />
            {email}
          </div>
          {record.emailVerified && <Tag color="green">Verified</Tag>}
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      render: (role) => (
        <Tag
          color={
            role === "ADMIN" ? "red" : role === "MANAGER" ? "blue" : "green"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "statusDisplayName",
      render: (statusDisplay, record) => {
        let color = "green";
        if (record.status === "inactive") color = "volcano";
        if (record.status === "pending") color = "geekblue";

        return <Tag color={color}>{statusDisplay}</Tag>;
      },
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Bị cấm", value: "inactive" },
        { text: "Chờ duyệt", value: "pending" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Nhà cung cấp xác thực",
      dataIndex: "authProviderDisplayName",
      key: "authProvider",
      render: (provider) => <Tag color="cyan">{provider}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date, record) => (
        <div>
          <div>{new Date(date).toLocaleDateString("vi-VN")}</div>
          <small className="text-gray-500">
            {record.daysSinceCreated} ngày trước
          </small>
        </div>
      ),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date, record) => (
        <div>
          <div>{new Date(date).toLocaleDateString("vi-VN")}</div>
          <small className="text-gray-500">
            {record.daysSinceLastUpdate} ngày trước
          </small>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa người dùng">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="!text-blue-500"
              disabled={!record.canChangeRole}
            />
          </Tooltip>
          <Tooltip title="Xóa người dùng">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              className="!text-red-500"
              danger
              disabled={!record.canBeDeleted}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddUser = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Bảng điều khiển</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý người dùng</Breadcrumb.Item>
      </Breadcrumb>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={userData?.totalElements || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={userData?.filterSummary?.totalActive || 0}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Người dùng không hoạt động"
              value={userData?.filterSummary?.totalInactive || 0}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Email đã xác thực"
              value={userData?.filterSummary?.totalEmailVerified || 0}
              valueStyle={{ color: "#52c41a" }}
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
                placeholder="Tìm kiếm người dùng..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                placeholder="Lọc theo vai trò"
                allowClear
                value={selectedRole}
                onChange={setSelectedRole}
                style={{ width: 150 }}
              >
                {rolesData?.map((role) => (
                  <Select.Option key={role.id} value={role.name}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 150 }}
              >
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Không hoạt động</Select.Option>
                <Select.Option value="suspended">Bị cấm</Select.Option>
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
                onClick={handleAddUser}
              >
                Thêm người dùng
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table<DataType>
          columns={columns}
          dataSource={userData?.users || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: currentPage + 1,
            pageSize: pageSize,
            total: userData?.totalElements || 0,
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

      {/* Modal for Add/Edit User */}
      <UserModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        form={form}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default UserManagement;
