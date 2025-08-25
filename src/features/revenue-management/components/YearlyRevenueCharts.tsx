import React from "react";
import { Card, Row, Col } from "antd";
import { Column, Line, Pie } from "@ant-design/charts";
import type {
  YearlyRevenueByMonth,
  BookingStatusCount,
} from "../../../app/api/revenue";

interface YearlyRevenueChartsProps {
  yearlyData: YearlyRevenueByMonth[] | undefined;
  bookingStatusData: BookingStatusCount[] | undefined;
  formatCurrency: (amount: number) => string;
}

const YearlyRevenueCharts: React.FC<YearlyRevenueChartsProps> = ({
  yearlyData,
  bookingStatusData,
  formatCurrency,
}) => {
  // Cấu hình biểu đồ cột doanh thu
  const revenueColumnConfig = {
    data:
      yearlyData?.map((item) => ({
        month: `Tháng ${item.month}`,
        revenue: item.totalRevenue,
      })) || [],
    xField: "month",
    yField: "revenue",
    columnStyle: {
      fill: "#1890ff",
      radius: [4, 4, 0, 0],
    },
    meta: {
      revenue: {
        alias: "Doanh thu",
        formatter: (v: number) => formatCurrency(v),
      },
    },
    label: {
      position: "top" as const,
      formatter: (data: { revenue: number }) =>
        data.revenue > 0 ? formatCurrency(data.revenue) : "",
    },
    tooltip: {
      formatter: (datum: { month: string; revenue: number }) => ({
        name: datum.month,
        value: formatCurrency(datum.revenue),
      }),
    },
  };

  // Cấu hình biểu đồ line hành khách
  const passengersLineConfig = {
    data:
      yearlyData?.map((item) => ({
        month: `T${item.month}`,
        passengers: item.totalPassengers,
        trips: item.totalTrips,
      })) || [],
    xField: "month",
    yField: "passengers",
    seriesField: "type",
    color: ["#722ed1"],
    point: {
      size: 5,
      shape: "diamond" as const,
    },
    meta: {
      passengers: {
        alias: "Hành khách",
      },
    },
    smooth: true,
    tooltip: {
      formatter: (datum: {
        month: string;
        passengers: number;
        trips: number;
      }) => ({
        name: `Hành khách ${datum.month}`,
        value: `${datum.passengers} người (${datum.trips} chuyến)`,
      }),
    },
  };

  // Cấu hình biểu đồ tròn booking status
  const bookingStatusConfig = {
    data:
      bookingStatusData?.map((item) => ({
        type:
          item.status === "confirmed"
            ? "Đã xác nhận"
            : item.status === "pending"
            ? "Chờ xử lý"
            : item.status === "canceled_by_user"
            ? "Hủy bởi khách"
            : item.status === "canceled_by_operator"
            ? "Hủy bởi nhà xe"
            : item.status === "completed"
            ? "Hoàn thành"
            : item.status,
        value: item.count,
        percentage: item.percentage,
      })) || [],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer" as const,
      content: "{name}\n{percentage}%",
    },
    interactions: [{ type: "element-highlight" }, { type: "element-active" }],
    statistic: {
      title: {
        content: "Tổng",
      },
      content: {
        content: `${
          bookingStatusData?.reduce((sum, item) => sum + item.count, 0) || 0
        }`,
      },
    },
    legend: {
      position: "bottom" as const,
    },
  };

  return (
    <Row gutter={16} style={{ marginBottom: "24px" }}>
      <Col xs={24} lg={8}>
        <Card title="Doanh thu theo tháng" size="small">
          <Column {...revenueColumnConfig} height={300} />
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Hành khách theo tháng" size="small">
          <Line {...passengersLineConfig} height={300} />
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Trạng thái Booking" size="small">
          <Pie {...bookingStatusConfig} height={300} />
        </Card>
      </Col>
    </Row>
  );
};

export default YearlyRevenueCharts;
