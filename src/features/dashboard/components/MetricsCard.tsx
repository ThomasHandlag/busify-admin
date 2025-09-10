import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Input,
  Segmented,
} from "antd";
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface StatsData {
  totalOpen: number;
  inProgress: number;
  resolvedToday: number;
  overdue: number;
  avgResponseTime: string;
  customerSatisfaction: number;
}

interface MetricsCardProps {
  stats: StatsData;
  searchText: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  stats,
  searchText,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}) => {
  const metricCardStyle: React.CSSProperties = {
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(20,20,30,0.04)",
    background: "#fff",
    padding: 14,
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={24}>
        <Card style={{ ...metricCardStyle }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Space size="large" wrap>
              <Statistic
                title="Mới"
                value={stats.totalOpen}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: "#f5222d" }}
              />
              <Statistic
                title="Đang xử lý"
                value={stats.inProgress}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Statistic
                title="Giải quyết hôm nay"
                value={stats.resolvedToday}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
              <Statistic
                title="Quá hạn"
                value={stats.overdue}
                prefix={<WarningOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Space>

            <div
              style={{
                minWidth: 280,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Input
                placeholder="Tìm ticket, khách hàng..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
                allowClear
              />
              <Segmented
                options={[
                  { label: "Tất cả", value: "all" },
                  { label: "Mới", value: "open" },
                  { label: "Đang", value: "in_progress" },
                  { label: "Giải quyết", value: "resolved" },
                  { label: "Đã đóng", value: "closed" },
                ]}
                value={selectedStatus}
                onChange={(v) => onStatusChange(String(v))}
              />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
