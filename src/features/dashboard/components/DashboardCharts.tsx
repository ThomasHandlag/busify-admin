import React from "react";
import { Card, Row, Col, Typography, Progress } from "antd";
import { useRevenueData } from "../hooks/useDashboard";

const { Text } = Typography;

export const DashboardCharts: React.FC = () => {
  const { revenueData, loading, error } = useRevenueData();

  if (error) {
    return (
      <Card title="Biểu đồ doanh thu">
        <Text type="danger">{error}</Text>
      </Card>
    );
  }

  // Calculate total revenue and find max month
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const maxRevenue = Math.max(...revenueData.map((item) => item.amount), 1);

  return (
    <Card title="Doanh thu theo tháng" loading={loading}>
      {revenueData.length > 0 ? (
        <>
          <Row style={{ marginBottom: "16px" }}>
            <Col span={24}>
              <Text strong>Tổng doanh thu năm: </Text>
              <Text style={{ fontSize: "18px", color: "#1890ff" }}>
                {new Intl.NumberFormat("vi-VN").format(totalRevenue)} VND
              </Text>
            </Col>
          </Row>

          <Row gutter={[8, 16]}>
            {revenueData.map((item, index) => {
              const percentage = Math.round((item.amount / maxRevenue) * 100);
              const monthName = new Date(item.date + "-01").toLocaleDateString(
                "vi-VN",
                {
                  month: "long",
                  year: "numeric",
                }
              );

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <div style={{ padding: "8px" }}>
                    <Text strong style={{ fontSize: "12px" }}>
                      {monthName}
                    </Text>
                    <Progress
                      percent={percentage}
                      size="small"
                      format={(percent) => `${percent}%`}
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%": "#87d068",
                      }}
                    />
                    <Text style={{ fontSize: "11px", color: "#666" }}>
                      {new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(item.amount)}{" "}
                      VND
                    </Text>
                  </div>
                </Col>
              );
            })}
          </Row>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Text type="secondary">Chưa có dữ liệu doanh thu</Text>
        </div>
      )}
    </Card>
  );
};
