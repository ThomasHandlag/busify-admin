import React, { useEffect } from "react";
import {
  Badge,
  Button,
  Dropdown,
  List,
  Typography,
  Space,
  Divider,
  Tag,
  Empty,
  Tooltip,
  Spin,
  Alert,
  Modal,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNotificationStore } from "../stores/notification_store";
import { useNotificationPolling } from "../hooks/useNotificationPolling";
import type { NotificationItem } from "../types/notification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { NotificationAPI } from "../app/api/notification";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

export const NotificationBell: React.FC = () => {
  const [showModalMessage, setShowModalMessage] = React.useState(false);
  const [selectedNotification, setSelectedNotification] =
    React.useState<NotificationItem | null>(null);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    setError,
  } = useNotificationStore();

  useNotificationPolling(30000);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setShowModalMessage(true);
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const dismissError = () => {
    setError(null);
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    const iconStyle = { fontSize: "16px" };
    switch (type) {
      case "success":
        return <CheckOutlined style={{ ...iconStyle, color: "#52c41a" }} />;
      case "warning":
        return <BellOutlined style={{ ...iconStyle, color: "#faad14" }} />;
      case "error":
        return <DeleteOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />;
      default:
        return <BellOutlined style={{ ...iconStyle, color: "#1890ff" }} />;
    }
  };

  const getNotificationColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "blue";
    }
  };

  const extractPdfFilename = (message: string) => {
    const match = message.match(/([\w-]+\.pdf)/);
    return match ? match[1] : null;
  };

  const handleViewPdf = async () => {
    if (!selectedNotification) return;
    const message =
      notifications.find((n) => n.id === selectedNotification.id)?.message ||
      "";
    const pdfFilename = extractPdfFilename(message);
    if (!pdfFilename) return;
    try {
      await NotificationAPI.viewPdf(Number(selectedNotification.id));
    } catch (err) {
      Modal.error({ title: "Lỗi tải báo cáo", content: String(err) });
    }
  };

  if (showModalMessage && selectedNotification) {
    const message =
      notifications.find((n) => n.id === selectedNotification.id)?.message ||
      "";
    return (
      <Modal
        title="Message Info"
        closable={{ "aria-label": "Custom Close Button" }}
        open={showModalMessage}
        onOk={() => setShowModalMessage(false)}
        onCancel={() => setShowModalMessage(false)}
      >
        <p>
          {message.split("\n").map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
          <Button style={{ marginTop: 8 }} onClick={handleViewPdf}>
            Xem thêm
          </Button>
        </p>
      </Modal>
    );
  }

  const notificationDropdown = (
    <div style={{ width: 380, maxHeight: 400, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            Thông báo
          </Title>
          <Space>
            <Tooltip title="Làm mới">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              />
            </Tooltip>
            {unreadCount > 0 && (
              <Tooltip title="Đánh dấu tất cả đã đọc">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={handleMarkAllAsRead}
                />
              </Tooltip>
            )}
          </Space>
        </div>
        {unreadCount > 0 && (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Bạn có {unreadCount} thông báo chưa đọc
          </Text>
        )}
      </div>
      {error && (
        <div style={{ padding: "8px 16px" }}>
          <Alert
            message={error}
            type="error"
            closable
            onClose={dismissError}
            style={{ fontSize: "12px" }}
          />
        </div>
      )}
      <div style={{ maxHeight: 300, overflowY: "auto" }}>
        {loading && notifications.length === 0 ? (
          <div style={{ padding: "40px 16px", textAlign: "center" }}>
            <Spin tip="Đang tải thông báo..." />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "40px 16px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có thông báo nào"
            />
          </div>
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : "#f6ffed",
                  borderLeft: notification.isRead
                    ? "none"
                    : "3px solid #52c41a",
                  transition: "background-color 0.2s",
                }}
                onClick={() => handleNotificationClick(notification)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.isRead
                    ? "transparent"
                    : "#f6ffed";
                }}
                actions={[
                  <Tooltip title="Xóa" key="delete">
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      danger
                    />
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(notification.type)}
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        strong={!notification.isRead}
                        style={{
                          fontSize: "14px",
                          color: notification.isRead ? "#8c8c8c" : "#262626",
                        }}
                      >
                        {notification.title}
                      </Text>
                      <Tag
                        color={getNotificationColor(notification.type)}
                        style={{
                          fontSize: "10px",
                          lineHeight: "16px",
                          height: "20px",
                        }}
                      >
                        {notification.type.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: "11px" }}>
                        {dayjs(notification.createdAt).fromNow()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {notifications.length > 0 && (
        <>
          <Divider style={{ margin: 0 }} />
          <div style={{ padding: "8px 16px", textAlign: "center" }}>
            <Button type="link" size="small">
              Xem tất cả thông báo
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={notificationDropdown}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Badge count={unreadCount} size="small">
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Badge>
    </Dropdown>
  );
};
