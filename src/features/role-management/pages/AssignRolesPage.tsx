import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Select,
  Tag,
  message,
  Space,
  Typography,
  Input,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { User, Role } from "../../../types/role";
import {
  getAllRoles,
  assignRolesToUser,
  removeRoleFromUser,
} from "../../../app/api/role";
import { getAllUsersManagement } from "../../../app/api/user";
import "../styles.css";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const AssignRolesPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        getAllUsersManagement(),
        getAllRoles(),
      ]);

      if (usersResponse.code === 200) {
        setUsers(usersResponse.result?.content || []);
      }

      if (rolesResponse.code === 200) {
        setRoles((rolesResponse.result as Role[]) || []);
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoles = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const response = await assignRolesToUser({
        userId: selectedUser.id,
        roleIds: selectedRoles,
      });

      if (response.code === 200) {
        message.success("Phân quyền thành công");
        setModalVisible(false);
        loadData();
      } else {
        message.error("Phân quyền thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi phân quyền");
      console.error("Error assigning roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (userId: number, roleId: number) => {
    try {
      const response = await removeRoleFromUser(userId, roleId);
      if (response.code === 200) {
        message.success("Xóa quyền thành công");
        loadData();
      } else {
        message.error("Xóa quyền thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa quyền");
      console.error("Error removing role:", error);
    }
  };

  const openAssignModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles?.map((role) => role.id) || []);
    setModalVisible(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<User> = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, record: User) => (
        <Space>
          <UserOutlined />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusColors = {
          ACTIVE: "green",
          INACTIVE: "orange",
          BANNED: "red",
        };
        const statusTexts = {
          ACTIVE: "Hoạt động",
          INACTIVE: "Không hoạt động",
          BANNED: "Bị cấm",
        };
        return (
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {statusTexts[status as keyof typeof statusTexts]}
          </Tag>
        );
      },
    },
    {
      title: "Vai trò hiện tại",
      dataIndex: "roles",
      key: "roles",
      render: (roles: Role[], record: User) => (
        <Space wrap>
          {roles?.map((role) => (
            <Tag
              key={role.id}
              color="blue"
              closable
              onClose={() => handleRemoveRole(record.id, role.id)}
            >
              {role.name}
            </Tag>
          ))}
          {(!roles || roles.length === 0) && (
            <Text type="secondary">Chưa có vai trò</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record: User) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openAssignModal(record)}
          >
            Phân quyền
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="role-management-container">
      <Card className="role-card">
        <div className="role-header">
          <Title
            level={3}
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <SafetyCertificateOutlined />
            Phân quyền người dùng
          </Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
            Quản lý và phân quyền vai trò cho người dùng trong hệ thống
          </Text>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên hoặc email"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Table
          className="role-table"
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </Card>

      <Modal
        className="role-modal"
        title={
          <Space>
            <SafetyCertificateOutlined />
            Phân quyền cho {selectedUser?.fullName}
          </Space>
        }
        open={modalVisible}
        onOk={handleAssignRoles}
        onCancel={() => setModalVisible(false)}
        width={600}
        confirmLoading={loading}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: "16px" }}>
          <Text type="secondary">Email: {selectedUser?.email}</Text>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Text strong>Chọn vai trò:</Text>
        </div>

        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Chọn vai trò cho người dùng"
          value={selectedRoles}
          onChange={setSelectedRoles}
          optionLabelProp="label"
        >
          {roles.map((role) => (
            <Option key={role.id} value={role.id} label={role.name}>
              <Space>
                <SafetyCertificateOutlined />
                {role.name}
                {role.description && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    - {role.description}
                  </Text>
                )}
              </Space>
            </Option>
          ))}
        </Select>

        <div style={{ marginTop: "16px" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            * Người dùng có thể có nhiều vai trò cùng lúc
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default AssignRolesPage;
