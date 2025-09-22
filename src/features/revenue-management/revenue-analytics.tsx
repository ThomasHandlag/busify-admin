import React, { useState } from "react";
import { Card, Typography, Row, Col, DatePicker, Space, Button } from "antd";
import { BarChartOutlined, ReloadOutlined } from "@ant-design/icons";
import { DualAxes, Gauge, Column } from "@ant-design/charts";
import dayjs from "dayjs";

const { Title } = Typography;
const { YearPicker } = DatePicker;

const RevenueAnalytics: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Mock data for analytics (in real app, this would come from API)
  const mockMonthlyTrend = [
    { month: "T1", revenue: 800000, growth: 0 },
    { month: "T2", revenue: 950000, growth: 18.75 },
    { month: "T3", revenue: 1100000, growth: 15.79 },
    { month: "T4", revenue: 890000, growth: -19.09 },
    { month: "T5", revenue: 1200000, growth: 34.83 },
    { month: "T6", revenue: 1350000, growth: 12.5 },
    { month: "T7", revenue: 1450000, growth: 7.41 },
    { month: "T8", revenue: 1620000, growth: 11.72 },
    { month: "T9", revenue: 1400000, growth: -13.58 },
    { month: "T10", revenue: 1550000, growth: 10.71 },
    { month: "T11", revenue: 1680000, growth: 8.39 },
    { month: "T12", revenue: 1750000, growth: 4.17 },
  ];

  const mockComparisonData = [
    { month: "T1", currentYear: 1620000, lastYear: 1200000 },
    { month: "T2", currentYear: 1450000, lastYear: 1100000 },
    { month: "T3", currentYear: 1680000, lastYear: 1350000 },
    { month: "T4", currentYear: 1750000, lastYear: 1400000 },
    { month: "T5", currentYear: 1820000, lastYear: 1500000 },
    { month: "T6", currentYear: 1950000, lastYear: 1600000 },
  ];

  // Calculate yearly metrics
  const averageGrowth =
    mockMonthlyTrend.reduce((sum, item) => sum + item.growth, 0) /
    mockMonthlyTrend.length;

  return (
    <div style={{ padding: "24px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <Title level={2}>
            <BarChartOutlined /> Phân tích Doanh thu
          </Title>
        </Col>
        <Col>
          <Space>
            <YearPicker
              value={dayjs().year(selectedYear)}
              onChange={(date) =>
                setSelectedYear(date?.year() || new Date().getFullYear())
              }
              placeholder="Chọn năm"
            />
            <Button type="primary" icon={<ReloadOutlined />}>
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Performance Gauge */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} md={8}>
          <Card title="Hiệu suất tăng trưởng">
            <Gauge
              percent={Math.max(0, averageGrowth) / 100}
              range={{
                ticks: [0, 1 / 3, 2 / 3, 1],
                color: ["#F4664A", "#FAAD14", "#30BF78"],
              }}
              indicator={{
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
              }}
              statistic={{
                content: {
                  style: {
                    fontSize: "16px",
                    lineHeight: "16px",
                  },
                  formatter: () => `${averageGrowth.toFixed(1)}%`,
                },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Xu hướng doanh thu và tăng trưởng theo tháng">
            <DualAxes
              data={[mockMonthlyTrend, mockMonthlyTrend]}
              xField="month"
              yField={["revenue", "growth"]}
              meta={{
                revenue: {
                  alias: "Doanh thu",
                  formatter: (v: number) => `${(v / 1000000).toFixed(1)}M VND`,
                },
                growth: {
                  alias: "Tăng trưởng",
                  formatter: (v: number) => `${v.toFixed(1)}%`,
                },
              }}
              geometryOptions={[
                {
                  geometry: "column",
                  color: "#5B8FF9",
                },
                {
                  geometry: "line",
                  color: "#5AD8A6",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Trend Area Chart */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          <Card title="Biểu đồ cột doanh thu theo thời gian">
            <Column
              data={mockMonthlyTrend}
              xField="month"
              yField="revenue"
              meta={{
                revenue: {
                  alias: "Doanh thu",
                  formatter: (v: number) => `${(v / 1000000).toFixed(1)}M VND`,
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Year over Year Comparison */}
      <Row gutter={16}>
        <Col xs={24}>
          <Card title="So sánh doanh thu theo năm">
            <DualAxes
              data={[mockComparisonData, mockComparisonData]}
              xField="month"
              yField={["currentYear", "lastYear"]}
              meta={{
                currentYear: {
                  alias: `Năm ${selectedYear}`,
                  formatter: (v: number) => `${(v / 1000000).toFixed(1)}M VND`,
                },
                lastYear: {
                  alias: `Năm ${selectedYear - 1}`,
                  formatter: (v: number) => `${(v / 1000000).toFixed(1)}M VND`,
                },
              }}
              geometryOptions={[
                {
                  geometry: "column",
                  color: "#5B8FF9",
                },
                {
                  geometry: "line",
                  color: "#5AD8A6",
                  lineStyle: {
                    lineWidth: 3,
                  },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueAnalytics;
