// import React from "react";
// import { Card, Row, Col } from "antd";
// import { Column, Line, Pie } from "@ant-design/charts";
// import type {
//   YearlyRevenueByMonth,
//   BookingStatusCount,
// } from "../../../app/api/revenue";

// interface YearlyRevenueChartsProps {
//   yearlyData: YearlyRevenueByMonth[] | undefined;
//   bookingStatusData: BookingStatusCount[] | undefined;
//   formatCurrency: (amount: number) => string;
// }

// const YearlyRevenueCharts: React.FC<YearlyRevenueChartsProps> = ({
//   yearlyData,
//   bookingStatusData,
//   formatCurrency,
// }) => {
//   // Cấu hình biểu đồ cột doanh thu
//   const revenueColumnConfig = {
//     data:
//       yearlyData?.map((item) => ({
//         month: `Tháng ${item.month}`,
//         revenue: item.totalRevenue,
//       })) || [],
//     xField: "month",
//     yField: "revenue",
//     columnStyle: {
//       fill: "#1890ff",
//       radius: [4, 4, 0, 0],
//     },
//     meta: {
//       revenue: {
//         alias: "Doanh thu",
//         formatter: (v: number) => formatCurrency(v),
//       },
//     },
//     label: {
//       position: "top" as const,
//       formatter: (data: { revenue: number }) =>
//         data.revenue > 0 ? formatCurrency(data.revenue) : "",
//     },
//     tooltip: {
//       formatter: (datum: { month: string; revenue: number }) => ({
//         name: datum.month,
//         value: formatCurrency(datum.revenue),
//       }),
//     },
//   };

//   // Cấu hình biểu đồ line hành khách
//   const passengersLineConfig = {
//     data:
//       yearlyData?.map((item) => ({
//         month: `T${item.month}`,
//         passengers: item.totalPassengers,
//         trips: item.totalTrips,
//       })) || [],
//     xField: "month",
//     yField: "passengers",
//     seriesField: "type",
//     color: ["#722ed1"],
//     point: {
//       size: 5,
//       shape: "diamond" as const,
//     },
//     meta: {
//       passengers: {
//         alias: "Hành khách",
//       },
//     },
//     smooth: true,
//     tooltip: {
//       formatter: (datum: {
//         month: string;
//         passengers: number;
//         trips: number;
//       }) => ({
//         name: `Hành khách ${datum.month}`,
//         value: `${datum.passengers} người (${datum.trips} chuyến)`,
//       }),
//     },
//   };

//   // Cấu hình biểu đồ tròn booking status
//   const bookingStatusConfig = {
//     data:
//       bookingStatusData?.map((item) => ({
//         type:
//           item.status === "confirmed"
//             ? "Đã xác nhận"
//             : item.status === "pending"
//             ? "Chờ xử lý"
//             : item.status === "canceled_by_user"
//             ? "Hủy bởi khách"
//             : item.status === "canceled_by_operator"
//             ? "Hủy bởi nhà xe"
//             : item.status === "completed"
//             ? "Hoàn thành"
//             : item.status,
//         value: item.count,
//         percentage: item.percentage,
//       })) || [],
//     angleField: "value",
//     colorField: "type",
//     radius: 0.8,
//     label: {
//       type: "outer" as const,
//       content: "{name}\n{percentage}%",
//     },
//     interactions: [{ type: "element-highlight" }, { type: "element-active" }],
//     statistic: {
//       title: {
//         content: "Tổng",
//       },
//       content: {
//         content: `${
//           bookingStatusData?.reduce((sum, item) => sum + item.count, 0) || 0
//         }`,
//       },
//     },
//     legend: {
//       position: "bottom" as const,
//     },
//   };

//   return (
//     <Row gutter={16} style={{ marginBottom: "24px" }}>
//       <Col xs={24} lg={8}>
//         <Card title="Doanh thu theo tháng" size="small">
//           <Column {...revenueColumnConfig} height={300} />
//         </Card>
//       </Col>

//       <Col xs={24} lg={8}>
//         <Card title="Hành khách theo tháng" size="small">
//           <Line {...passengersLineConfig} height={300} />
//         </Card>
//       </Col>

//       <Col xs={24} lg={8}>
//         <Card title="Trạng thái Booking" size="small">
//           <Pie {...bookingStatusConfig} height={300} />
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default YearlyRevenueCharts;

import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col } from "antd";
import { Column, Line, Pie } from "@ant-design/charts";
import type { YearlyRevenueByMonth, BookingStatusCount } from "../../../app/api/revenue";

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
  const [key, setKey] = useState(0); // Để buộc tái render
  const revenueRef = useRef<HTMLDivElement>(null);
  const passengersRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  // Buộc tái render khi dữ liệu thay đổi
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [yearlyData, bookingStatusData]);

  // Theo dõi kích thước container và cập nhật
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setKey((prev) => prev + 1); // Tái render khi kích thước thay đổi
    });

    if (revenueRef.current) observer.observe(revenueRef.current);
    if (passengersRef.current) observer.observe(passengersRef.current);
    if (bookingRef.current) observer.observe(bookingRef.current);

    return () => observer.disconnect();
  }, []);

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
    autoFit: true, // Đảm bảo tự động điều chỉnh kích thước
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
    autoFit: true, // Đảm bảo tự động điều chỉnh kích thước
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
    autoFit: true, // Đảm bảo tự động điều chỉnh kích thước
  };

  return (
    <Row gutter={16} style={{ marginBottom: "24px" }}>
      <Col xs={24} lg={8}>
        <Card title="Doanh thu theo tháng" size="small">
          <div ref={revenueRef} style={{ width: "100%", height: "300px", overflow: "hidden" }}>
            {yearlyData && yearlyData.length > 0 ? (
              <Column {...revenueColumnConfig} height={300} key={`revenue-${key}`} />
            ) : (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100%",
                color: "#999"
              }}>
                <p>Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Hành khách theo tháng" size="small">
          <div ref={passengersRef} style={{ width: "100%", height: "300px", overflow: "hidden" }}>
            {yearlyData && yearlyData.length > 0 ? (
              <Line {...passengersLineConfig} height={300} key={`passengers-${key}`} />
            ) : (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100%",
                color: "#999"
              }}>
                <p>Chưa có dữ liệu hành khách</p>
              </div>
            )}
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Trạng thái Booking" size="small">
          <div ref={bookingRef} style={{ width: "100%", height: "300px", overflow: "hidden" }}>
            {bookingStatusData && bookingStatusData.length > 0 ? (
              <Pie {...bookingStatusConfig} height={300} key={`booking-${key}`} />
            ) : (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100%",
                color: "#999"
              }}>
                <p>Chưa có dữ liệu trạng thái booking</p>
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default YearlyRevenueCharts;