import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  message,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Transfer,
} from "antd";
import {
  KeyOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Role, Permission } from "../../../types/role";
import {
  getAllRoles,
  getAllPermissions,
  updateRole,
} from "../../../app/api/role";

const { Title, Text } = Typography;

interface TransferItem {
  key: string;
  title: string;
  description?: string;
}

const PermissionSettingsPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        getAllRoles(),
        getAllPermissions(),
      ]);

      if (rolesResponse.code === 200) {
        setRoles((rolesResponse.result as Role[]) || []);
      }

      if (permissionsResponse.code === 200) {
        setPermissions((permissionsResponse.result as Permission[]) || []);
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!selectedRole) return;

    try {
      setLoading(true);
      const permissionIds = targetKeys.map((key) => parseInt(key));

      const response = await updateRole({
        id: selectedRole.id,
        name: selectedRole.name,
        description: selectedRole.description,
        permissionIds,
      });

      if (response.code === 200) {
        message.success("Cập nhật quyền thành công");
        setModalVisible(false);
        loadData();
      } else {
        message.error("Cập nhật quyền thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật quyền");
      console.error("Error updating permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPermissionModal = (role: Role) => {
    setSelectedRole(role);
    setTargetKeys(role.permissions?.map((p) => p.id.toString()) || []);
    setModalVisible(true);
  };

  const getPermissionsByResource = () => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach((permission) => {
      if (!grouped[permission.resource]) {
        grouped[permission.resource] = [];
      }
      grouped[permission.resource].push(permission);
    });
    return grouped;
  };

  const transferData: TransferItem[] = permissions.map((permission) => ({
    key: permission.id.toString(),
    title: `${permission.name}`,
    description: `${permission.resource} - ${permission.action}`,
  }));

  const filterOption = (inputValue: string, option: TransferItem) =>
    option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
    (option.description?.toLowerCase().includes(inputValue.toLowerCase()) ??
      false);

  const roleColumns: ColumnsType<Role> = [
    {
      title: "Vai trò",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Space>
          <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <Text type="secondary">{description || "Chưa có mô tả"}</Text>
      ),
    },
    {
      title: "Số quyền hiện tại",
      key: "permissionCount",
      render: (_, record: Role) => (
        <Tag color="blue">{record.permissions?.length || 0} quyền</Tag>
      ),
    },
    {
      title: "Quyền hiện tại",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: Permission[]) => (
        <Space wrap>
          {permissions?.slice(0, 3).map((permission) => (
            <Tag key={permission.id} color="green" style={{ fontSize: "11px" }}>
              {permission.name}
            </Tag>
          ))}
          {permissions && permissions.length > 3 && (
            <Tag color="default">+{permissions.length - 3} khác</Tag>
          )}
          {(!permissions || permissions.length === 0) && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Chưa có quyền
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record: Role) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => openPermissionModal(record)}
        >
          Cài đặt quyền
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        {/* Danh sách vai trò và quyền */}
        <Col span={24}>
          <Card>
            <div style={{ marginBottom: "20px" }}>
              <Title
                level={3}
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SettingOutlined />
                Cài đặt quyền cho vai trò
              </Title>
              <Text type="secondary">
                Quản lý quyền truy cập cho từng vai trò trong hệ thống
              </Text>
            </div>

            <Table
              columns={roleColumns}
              dataSource={roles}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} vai trò`,
              }}
            />
          </Card>
        </Col>

        {/* Danh sách tất cả quyền */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <KeyOutlined />
                Danh sách tất cả quyền hệ thống
              </Space>
            }
          >
            {Object.entries(getPermissionsByResource()).map(
              ([resource, perms]) => (
                <div key={resource} style={{ marginBottom: "16px" }}>
                  <Title
                    level={5}
                    style={{ color: "#1890ff", marginBottom: "8px" }}
                  >
                    {resource.toUpperCase()}
                  </Title>
                  <Row gutter={[8, 8]}>
                    {perms.map((permission) => (
                      <Col key={permission.id}>
                        <Tag color="default" style={{ marginBottom: "4px" }}>
                          {permission.name} ({permission.action})
                        </Tag>
                      </Col>
                    ))}
                  </Row>
                  <Divider style={{ margin: "12px 0" }} />
                </div>
              )
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal cài đặt quyền */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            Cài đặt quyền cho vai trò: {selectedRole?.name}
          </Space>
        }
        open={modalVisible}
        onOk={handleUpdatePermissions}
        onCancel={() => setModalVisible(false)}
        width={800}
        confirmLoading={loading}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div style={{ margin: "20px 0" }}>
          <Text type="secondary">
            Chọn các quyền mà vai trò <strong>{selectedRole?.name}</strong> được
            phép thực hiện
          </Text>
        </div>

        <Transfer
          dataSource={transferData}
          targetKeys={targetKeys}
          onChange={(keys) => setTargetKeys(keys as string[])}
          render={(item) => (
            <div>
              <div style={{ fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {item.description}
              </div>
            </div>
          )}
          titles={["Quyền có sẵn", "Quyền đã chọn"]}
          showSearch
          filterOption={filterOption}
          style={{ marginBottom: "16px" }}
          listStyle={{
            width: 350,
            height: 400,
          }}
        />

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f6f6f6",
            borderRadius: "6px",
          }}
        >
          <Text style={{ fontSize: "12px", color: "#666" }}>
            <strong>Lưu ý:</strong> Những thay đổi về quyền sẽ có hiệu lực ngay
            lập tức đối với tất cả người dùng có vai trò này.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default PermissionSettingsPage;
