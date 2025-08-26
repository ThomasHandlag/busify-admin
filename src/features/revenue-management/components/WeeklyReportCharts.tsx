import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import {
  DollarCircleOutlined,
  UserOutlined,
  CarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Gauge } from "@ant-design/charts";

interface WeeklyReportData {
  operatorId: number;
  totalTrips: number;
  totalRevenue: number;
  totalPassengers: number;
  totalBuses: number;
}

interface WeeklyReportChartsProps {
  weeklyData: WeeklyReportData | undefined;
  formatCurrency: (amount: number) => string;
}

const WeeklyReportCharts: React.FC<WeeklyReportChartsProps> = ({
  weeklyData,
  formatCurrency,
}) => {
  if (!weeklyData) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Vui lòng chọn nhà xe để xem báo cáo tuần</p>
        </div>
      </Card>
    );
  }

  // Cấu hình gauge cho hiệu suất
  const performanceScore = Math.min(
    (weeklyData.totalRevenue / 1000000) * 100,
    100
  ); // Giả sử mục tiêu 1M VND

  const gaugeConfig = {
    percent: performanceScore / 100,
    range: {
      color: "#30BF78",
    },
    indicator: {
      pointer: {
        style: {
          stroke: "#D0D0D0",
        },
      },
      pin: {
        style: {
          stroke: "#D0D0D0",
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: "24px",
          lineHeight: "24px",
        },
        formatter: () => `${performanceScore.toFixed(1)}%`,
      },
    },
  };

  return (
    <>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Doanh thu tuần"
              value={weeklyData.totalRevenue}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "#3f8600", fontSize: "20px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Hành khách"
              value={weeklyData.totalPassengers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: "20px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Chuyến đi"
              value={weeklyData.totalTrips}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#722ed1", fontSize: "20px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Số xe"
              value={weeklyData.totalBuses}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#fa8c16", fontSize: "20px" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Gauge */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="⚡ Hiệu suất tuần" size="small">
            <Gauge {...gaugeConfig} height={200} />
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Hiệu suất dựa trên doanh thu (mục tiêu: 1,000,000 VND)
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📈 Chỉ số hoạt động" size="small">
            <div style={{ padding: "20px 0" }}>
              <div style={{ marginBottom: "20px" }}>
                <p>Doanh thu / Chuyến đi</p>
                <Progress
                  percent={Math.min(
                    (weeklyData.totalRevenue / weeklyData.totalTrips / 500000) *
                      100,
                    100
                  )}
                  format={() =>
                    `${formatCurrency(
                      weeklyData.totalRevenue / weeklyData.totalTrips || 0
                    )}`
                  }
                  strokeColor="#52c41a"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <p>Hành khách / Chuyến đi</p>
                <Progress
                  percent={Math.min(
                    (weeklyData.totalPassengers / weeklyData.totalTrips / 30) *
                      100,
                    100
                  )}
                  format={() =>
                    `${(
                      weeklyData.totalPassengers / weeklyData.totalTrips || 0
                    ).toFixed(1)} người`
                  }
                  strokeColor="#1890ff"
                />
              </div>

              <div>
                <p>Chuyến đi / Xe</p>
                <Progress
                  percent={Math.min(
                    (weeklyData.totalTrips / weeklyData.totalBuses / 10) * 100,
                    100
                  )}
                  format={() =>
                    `${(
                      weeklyData.totalTrips / weeklyData.totalBuses || 0
                    ).toFixed(1)} chuyến`
                  }
                  strokeColor="#722ed1"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WeeklyReportCharts;
