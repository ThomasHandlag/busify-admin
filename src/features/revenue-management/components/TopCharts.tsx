import React from "react";
import { Card, Row, Col } from "antd";
import { Bar, Column } from "@ant-design/charts";

interface TopRouteData {
  totalRevenue: number;
  totalTrips: number;
  routeName: string;
  totalBookings: number;
}

interface TopTripData {
  totalRevenue: number;
  routeName: string;
  totalBookings: number;
  busOperatorName: string;
  departureTime: string;
}

interface TopChartsProps {
  topRoutesData: TopRouteData[] | undefined;
  topTripsData: TopTripData[] | undefined;
  formatCurrency: (amount: number) => string;
}

const TopCharts: React.FC<TopChartsProps> = ({
  topRoutesData,
  topTripsData,
  formatCurrency,
}) => {
  // Cấu hình Top Routes Bar Chart
  const topRoutesConfig = {
    data:
      topRoutesData
        ?.filter((route) => route.totalRevenue > 0)
        .slice(0, 5)
        .map((route, index) => ({
          route: `Tuyến ${index + 1}`,
          fullName: route.routeName,
          revenue: route.totalRevenue,
          trips: route.totalTrips,
          bookings: route.totalBookings,
        })) || [],
    xField: "revenue",
    yField: "route",
    seriesField: "route",
    legend: false,
    meta: {
      revenue: {
        alias: "Doanh thu",
        formatter: (v: number) => formatCurrency(v),
      },
    },
    color: "#52c41a",
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    tooltip: {
      formatter: (datum: {
        fullName: string;
        revenue: number;
        trips: number;
        bookings: number;
      }) => ({
        name: datum.fullName,
        value: `${formatCurrency(datum.revenue)} - ${datum.trips} chuyến - ${
          datum.bookings
        } booking`,
      }),
    },
    label: {
      position: "right" as const,
      offset: 4,
      formatter: (v: { revenue: number }) => formatCurrency(v.revenue),
    },
  };

  // Cấu hình Top Trips Column Chart
  const topTripsConfig = {
    data:
      topTripsData?.slice(0, 5).map((trip, index) => ({
        trip: `Chuyến ${index + 1}`,
        fullRoute: trip.routeName,
        revenue: trip.totalRevenue,
        bookings: trip.totalBookings,
        operator: trip.busOperatorName,
        departureTime: trip.departureTime,
      })) || [],
    xField: "trip",
    yField: "revenue",
    columnStyle: {
      fill: "#722ed1",
      radius: [4, 4, 0, 0],
    },
    meta: {
      revenue: {
        alias: "Doanh thu",
        formatter: (v: number) => formatCurrency(v),
      },
    },
    label: {
      visible: true,
      position: "top" as const,
      formatter: (data: { bookings: number }) =>
        data.bookings > 0 ? `${data.bookings} booking` : "0 booking",
    },
    tooltip: {
      formatter: (datum: {
        revenue: number;
        bookings: number;
        operator: string;
        fullRoute: string;
        departureTime: string;
      }) => ({
        name: datum.fullRoute,
        value: `${formatCurrency(datum.revenue)} • ${
          datum.bookings
        } booking • ${datum.operator}`,
      }),
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
  };

  return (
    <Row gutter={16} style={{ marginTop: "24px" }}>
      <Col xs={24} lg={12}>
        <Card title="🏆 Top 5 Tuyến đường Doanh thu cao nhất" size="small">
          <Bar {...topRoutesConfig} height={280} />
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="🚌 Top 5 Chuyến đi Doanh thu cao nhất" size="small">
          <Column {...topTripsConfig} height={280} />
        </Card>
      </Col>
    </Row>
  );
};

export default TopCharts;
