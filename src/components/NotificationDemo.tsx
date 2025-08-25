import React from "react";
import { Button, Space, Card, Typography } from "antd";
import { useNotificationActions } from "../hooks/useNotificationActions";

const { Title } = Typography;

export const NotificationDemo: React.FC = () => {
  const {
    addSuccessNotification,
    addInfoNotification,
    addWarningNotification,
    addErrorNotification,
  } = useNotificationActions();

  const handleAddSuccess = () => {
    addSuccessNotification(
      "Thành công!",
      "Dữ liệu đã được lưu thành công",
      "/dashboard"
    );
  };

  const handleAddInfo = () => {
    addInfoNotification("Thông tin mới", "Có báo cáo mới cần xem xét");
  };

  const handleAddWarning = () => {
    addWarningNotification("Cảnh báo", "Hệ thống sẽ bảo trì trong 30 phút nữa");
  };

  const handleAddError = () => {
    addErrorNotification("Lỗi hệ thống", "Không thể kết nối đến cơ sở dữ liệu");
  };

  return (
    <Card
      title={<Title level={4}>Demo Notification</Title>}
      style={{ margin: "20px" }}
    >
      <Space wrap>
        <Button type="primary" onClick={handleAddSuccess}>
          Thêm Success
        </Button>
        <Button onClick={handleAddInfo}>Thêm Info</Button>
        <Button onClick={handleAddWarning}>Thêm Warning</Button>
        <Button danger onClick={handleAddError}>
          Thêm Error
        </Button>
      </Space>
    </Card>
  );
};
