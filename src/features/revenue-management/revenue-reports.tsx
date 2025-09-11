// import React, { useState, useMemo } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Button,
//   DatePicker,
//   Statistic,
//   Select,
//   Tabs,
// } from "antd";
// import {
//   DollarCircleOutlined,
//   UserOutlined,
//   CarOutlined,
//   CalendarOutlined,
//   DownloadOutlined,
//   ReloadOutlined,
// } from "@ant-design/icons";
// import { useQuery } from "@tanstack/react-query";
// import dayjs from "dayjs";
// import {
//   getYearlyRevenue,
//   getMonthlyReport,
//   getWeeklyReport,
//   getBookingStatusCountsByYear,
//   getTopRevenueRoutes,
//   getTopRevenueTrips,
//   getAllBusOperators,
// } from "../../app/api/revenue";

// // Import components
// import YearlyRevenueCharts from "./components/YearlyRevenueCharts";
// import TopCharts from "./components/TopCharts";
// import MonthlyReportCharts from "./components/MonthlyReportCharts";
// import WeeklyReportCharts from "./components/WeeklyReportCharts";

// const { YearPicker, MonthPicker } = DatePicker;
// const { Option } = Select;
// const { TabPane } = Tabs;

// const RevenueReports: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>("yearly");
//   const [selectedYear, setSelectedYear] = useState<number>(
//     new Date().getFullYear()
//   );
//   const [selectedMonth, setSelectedMonth] = useState<number>(
//     new Date().getMonth() + 1
//   );
//   const [selectedOperator, setSelectedOperator] = useState<number | undefined>(
//     undefined
//   );

//   // Format currency function
//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(amount);
//   };

//   // API Queries
//   const { data: operatorsData, isLoading: isLoadingOperators } = useQuery({
//     queryKey: ["busOperators"],
//     queryFn: () => getAllBusOperators(),
//     staleTime: 5 * 60 * 1000,
//   });

//   const { data: yearlyData, refetch: refetchYearly } = useQuery({
//     queryKey: ["yearlyRevenue", selectedYear],
//     queryFn: () => getYearlyRevenue(selectedYear),
//     enabled: activeTab === "yearly",
//   });

//   const { data: bookingStatusData } = useQuery({
//     queryKey: ["bookingStatus", selectedYear],
//     queryFn: () => getBookingStatusCountsByYear(selectedYear),
//     enabled: activeTab === "yearly",
//   });

//   const { data: topRoutesData } = useQuery({
//     queryKey: ["topRoutes", selectedYear],
//     queryFn: () => getTopRevenueRoutes(selectedYear),
//     enabled: activeTab === "yearly",
//   });

//   const { data: topTripsData } = useQuery({
//     queryKey: ["topTrips", selectedYear],
//     queryFn: () => getTopRevenueTrips(selectedYear),
//     enabled: activeTab === "yearly",
//   });

//   const { data: monthlyData, refetch: refetchMonthly } = useQuery({
//     queryKey: ["monthlyReport", selectedOperator, selectedYear, selectedMonth],
//     queryFn: () =>
//       getMonthlyReport(selectedOperator!, selectedMonth, selectedYear),
//     enabled: activeTab === "monthly" && !!selectedOperator,
//   });

//   const { data: weeklyData, refetch: refetchWeekly } = useQuery({
//     queryKey: ["weeklyReport", selectedOperator],
//     queryFn: () => getWeeklyReport(selectedOperator!),
//     enabled: activeTab === "weekly" && !!selectedOperator,
//   });

//   // Calculate yearly totals
//   const yearlyTotals = useMemo(() => {
//     if (!yearlyData?.result) return null;

//     return yearlyData.result.reduce(
//       (acc, month) => ({
//         totalRevenue: acc.totalRevenue + month.totalRevenue,
//         totalPassengers: acc.totalPassengers + month.totalPassengers,
//         totalTrips: acc.totalTrips + month.totalTrips,
//         maxActiveOperators: Math.max(
//           acc.maxActiveOperators,
//           month.totalActiveOperators
//         ),
//       }),
//       {
//         totalRevenue: 0,
//         totalPassengers: 0,
//         totalTrips: 0,
//         maxActiveOperators: 0,
//       }
//     );
//   }, [yearlyData]);

//   const handleRefresh = () => {
//     if (activeTab === "yearly") {
//       refetchYearly();
//     } else if (activeTab === "monthly") {
//       refetchMonthly();
//     } else if (activeTab === "weekly") {
//       refetchWeekly();
//     }
//   };

//   const handleExport = () => {
//     console.log("Export data for:", activeTab);
//   };

//   return (
//     <div style={{ padding: "24px" }}>
//       <Row
//         justify="space-between"
//         align="middle"
//         style={{ marginBottom: "24px" }}
//       >
//         <Col>
//           <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
//             📊 Báo cáo Doanh thu
//           </h1>
//           <p style={{ margin: "8px 0 0 0", color: "#666" }}>
//             Quản lý và theo dõi doanh thu hệ thống
//           </p>
//         </Col>
//         <Col>
//           <Button
//             type="default"
//             icon={<ReloadOutlined />}
//             onClick={handleRefresh}
//             style={{ marginRight: "8px" }}
//           >
//             Làm mới
//           </Button>
//           <Button
//             type="primary"
//             icon={<DownloadOutlined />}
//             onClick={handleExport}
//           >
//             Xuất báo cáo
//           </Button>
//         </Col>
//       </Row>

//       <Tabs activeKey={activeTab} onChange={setActiveTab}>
//         {/* Yearly Revenue Tab */}
//         <TabPane tab="Báo cáo theo năm" key="yearly" >
//           <Card style={{ marginBottom: "24px" }}>
//             <Row gutter={16} align="middle">
//               <Col>
//                 <YearPicker
//                   value={dayjs().year(selectedYear)}
//                   onChange={(date) =>
//                     setSelectedYear(date?.year() || new Date().getFullYear())
//                   }
//                   placeholder="Chọn năm"
//                 />
//               </Col>
//             </Row>
//           </Card>

//           {/* Yearly Statistics Cards */}
//           {yearlyTotals && (
//             <Row gutter={16} style={{ marginBottom: "24px" }}>
//               <Col xs={24} sm={12} lg={6}>
//                 <Card size="small">
//                   <Statistic
//                     title="Tổng doanh thu năm"
//                     value={yearlyTotals.totalRevenue}
//                     formatter={(value) => formatCurrency(Number(value))}
//                     prefix={<DollarCircleOutlined />}
//                     valueStyle={{ color: "#3f8600" }}
//                   />
//                 </Card>
//               </Col>
//               <Col xs={24} sm={12} lg={6}>
//                 <Card size="small">
//                   <Statistic
//                     title="Tổng hành khách"
//                     value={yearlyTotals.totalPassengers}
//                     prefix={<UserOutlined />}
//                     valueStyle={{ color: "#1890ff" }}
//                   />
//                 </Card>
//               </Col>
//               <Col xs={24} sm={12} lg={6}>
//                 <Card size="small">
//                   <Statistic
//                     title="Tổng chuyến đi"
//                     value={yearlyTotals.totalTrips}
//                     prefix={<CarOutlined />}
//                     valueStyle={{ color: "#722ed1" }}
//                   />
//                 </Card>
//               </Col>
//               <Col xs={24} sm={12} lg={6}>
//                 <Card size="small">
//                   <Statistic
//                     title="Nhà xe hoạt động"
//                     value={yearlyTotals.maxActiveOperators}
//                     prefix={<CalendarOutlined />}
//                     valueStyle={{ color: "#fa8c16" }}
//                   />
//                 </Card>
//               </Col>
//             </Row>
//           )}

//           {/* Yearly Revenue Charts */}
//           <YearlyRevenueCharts
//             yearlyData={yearlyData?.result}
//             bookingStatusData={bookingStatusData?.result}
//             formatCurrency={formatCurrency}
//           />

//           {/* Top Routes and Trips Charts */}
//           <TopCharts
//             topRoutesData={topRoutesData?.result}
//             topTripsData={topTripsData?.result}
//             formatCurrency={formatCurrency}
//           />
//         </TabPane>

//         {/* Monthly Report Tab */}
//         <TabPane tab="Báo cáo theo tháng" key="monthly">
//           <Card style={{ marginBottom: "24px" }}>
//             <Row gutter={16} align="middle">
//               <Col>
//                 <Select
//                   style={{ width: 200 }}
//                   placeholder="Chọn nhà xe"
//                   value={selectedOperator}
//                   onChange={setSelectedOperator}
//                   loading={isLoadingOperators}
//                 >
//                   {operatorsData?.result?.content?.map(
//                     (operator: { operatorId: number; operatorName: string; email: string }) => (
//                       <Option key={operator.operatorId} value={operator.operatorId}>
//                         {operator.operatorName}
//                       </Option>
//                     )
//                   )}
//                 </Select>
//               </Col>
//               <Col>
//                 <YearPicker
//                   value={dayjs().year(selectedYear)}
//                   onChange={(date) =>
//                     setSelectedYear(date?.year() || new Date().getFullYear())
//                   }
//                   placeholder="Chọn năm"
//                 />
//               </Col>
//               <Col>
//                 <MonthPicker
//                   value={dayjs().month(selectedMonth - 1)}
//                   onChange={(date) =>
//                     setSelectedMonth(
//                       date ? date.month() + 1 : new Date().getMonth() + 1
//                     )
//                   }
//                   placeholder="Chọn tháng"
//                 />
//               </Col>
//             </Row>
//           </Card>

//           {/* Monthly Report Charts */}
//           <MonthlyReportCharts
//             monthlyData={monthlyData?.result}
//             formatCurrency={formatCurrency}
//           />
//         </TabPane>

//       </Tabs>
//     </div>
//   );
// };

// export default RevenueReports;


import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Statistic,
  Select,
  Tabs,
} from "antd";
import {
  DollarCircleOutlined,
  UserOutlined,
  CarOutlined,
  CalendarOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  getYearlyRevenue,
  getMonthlyReport,
  getWeeklyReport,
  getBookingStatusCountsByYear,
  getTopRevenueRoutes,
  getTopRevenueTrips,
  getAllBusOperators,
} from "../../app/api/revenue";

// Import components
import YearlyRevenueCharts from "./components/YearlyRevenueCharts";
import TopCharts from "./components/TopCharts";
import MonthlyReportCharts from "./components/MonthlyReportCharts";

const { YearPicker, MonthPicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const RevenueReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedOperator, setSelectedOperator] = useState<number | undefined>(
    undefined
  );

  // Format currency function
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // API Queries
  const { data: operatorsData, isLoading: isLoadingOperators } = useQuery({
    queryKey: ["busOperators"],
    queryFn: () => getAllBusOperators(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: yearlyData, refetch: refetchYearly } = useQuery({
    queryKey: ["yearlyRevenue", selectedYear],
    queryFn: () => getYearlyRevenue(selectedYear),
    enabled: activeTab === "yearly",
  });

  const { data: bookingStatusData } = useQuery({
    queryKey: ["bookingStatus", selectedYear],
    queryFn: () => getBookingStatusCountsByYear(selectedYear),
    enabled: activeTab === "yearly",
  });

  const { data: topRoutesData } = useQuery({
    queryKey: ["topRoutes", selectedYear],
    queryFn: () => getTopRevenueRoutes(selectedYear),
    enabled: activeTab === "yearly",
  });

  const { data: topTripsData } = useQuery({
    queryKey: ["topTrips", selectedYear],
    queryFn: () => getTopRevenueTrips(selectedYear),
    enabled: activeTab === "yearly",
  });

  const { data: monthlyData, refetch: refetchMonthly } = useQuery({
    queryKey: ["monthlyReport", selectedOperator, selectedYear, selectedMonth],
    queryFn: () =>
      getMonthlyReport(selectedOperator!, selectedMonth, selectedYear),
    enabled: activeTab === "monthly" && !!selectedOperator,
  });

  const { data: weeklyData, refetch: refetchWeekly } = useQuery({
    queryKey: ["weeklyReport", selectedOperator],
    queryFn: () => getWeeklyReport(selectedOperator!),
    enabled: activeTab === "weekly" && !!selectedOperator,
  });

  // Calculate yearly totals
  const yearlyTotals = useMemo(() => {
    if (!yearlyData?.result) return null;

    return yearlyData.result.reduce(
      (acc, month) => ({
        totalRevenue: acc.totalRevenue + month.totalRevenue,
        totalPassengers: acc.totalPassengers + month.totalPassengers,
        totalTrips: acc.totalTrips + month.totalTrips,
        maxActiveOperators: Math.max(
          acc.maxActiveOperators,
          month.totalActiveOperators
        ),
      }),
      {
        totalRevenue: 0,
        totalPassengers: 0,
        totalTrips: 0,
        maxActiveOperators: 0,
      }
    );
  }, [yearlyData]);

  const handleRefresh = () => {
    if (activeTab === "yearly") {
      refetchYearly();
    } else if (activeTab === "monthly") {
      refetchMonthly();
    } else if (activeTab === "weekly") {
      refetchWeekly();
    }
  };

  const handleExport = () => {
    console.log("Export data for:", activeTab);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
            📊 Báo cáo Doanh thu
          </h1>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>
            Quản lý và theo dõi doanh thu hệ thống
          </p>
        </Col>
        <Col>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            style={{ marginRight: "8px" }}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Xuất báo cáo
          </Button>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Yearly Revenue Tab */}
        <TabPane tab="Báo cáo theo năm" key="yearly" forceRender>
          <Card style={{ marginBottom: "24px" }}>
            <Row gutter={16} align="middle">
              <Col>
                <YearPicker
                  value={dayjs().year(selectedYear)}
                  onChange={(date) =>
                    setSelectedYear(date?.year() || new Date().getFullYear())
                  }
                  placeholder="Chọn năm"
                />
              </Col>
            </Row>
          </Card>

          {/* Yearly Statistics Cards */}
          {yearlyTotals && (
            <Row gutter={16} style={{ marginBottom: "24px" }}>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Tổng doanh thu năm"
                    value={yearlyTotals.totalRevenue}
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<DollarCircleOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Tổng hành khách"
                    value={yearlyTotals.totalPassengers}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Tổng chuyến đi"
                    value={yearlyTotals.totalTrips}
                    prefix={<CarOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Nhà xe hoạt động"
                    value={yearlyTotals.maxActiveOperators}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {/* Yearly Revenue Charts */}
          <YearlyRevenueCharts
            yearlyData={yearlyData?.result}
            bookingStatusData={bookingStatusData?.result}
            formatCurrency={formatCurrency}
          />

          {/* Top Routes and Trips Charts */}
          <TopCharts
            topRoutesData={topRoutesData?.result}
            topTripsData={topTripsData?.result}
            formatCurrency={formatCurrency}
          />
        </TabPane>

        {/* Monthly Report Tab */}
        <TabPane tab="Báo cáo theo tháng" key="monthly">
          <Card style={{ marginBottom: "24px" }}>
            <Row gutter={16} align="middle">
              <Col>
                <Select
                  style={{ width: 200 }}
                  placeholder="Chọn nhà xe"
                  value={selectedOperator}
                  onChange={setSelectedOperator}
                  loading={isLoadingOperators}
                >
                  {operatorsData?.result?.content?.map(
                    (operator: { id: number; name: string; email: string }) => (
                      <Option key={operator.id} value={operator.id}>
                        {operator.name}
                      </Option>
                    )
                  )}
                </Select>
              </Col>
              <Col>
                <YearPicker
                  value={dayjs().year(selectedYear)}
                  onChange={(date) =>
                    setSelectedYear(date?.year() || new Date().getFullYear())
                  }
                  placeholder="Chọn năm"
                />
              </Col>
              <Col>
                <MonthPicker
                  value={dayjs().month(selectedMonth - 1)}
                  onChange={(date) =>
                    setSelectedMonth(
                      date ? date.month() + 1 : new Date().getMonth() + 1
                    )
                  }
                  placeholder="Chọn tháng"
                />
              </Col>
            </Row>
          </Card>

          {/* Monthly Report Charts */}
          <MonthlyReportCharts
            monthlyData={monthlyData?.result}
            formatCurrency={formatCurrency}
          />
        </TabPane>

        
      </Tabs>
    </div>
  );
};

export default RevenueReports;