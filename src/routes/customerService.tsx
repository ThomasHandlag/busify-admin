import type { RouteObject } from "react-router";
import DashboardLayout from "../app/layouts/DashboardLayout";

// Giả sử bạn sẽ tạo các component trang tương ứng cho từng tính năng
import Dashboard from "../features/dashboard/dashboard";
import TicketManagementPage from "../features/ticket-management/pages/TicketManagementPage";
import ReviewsPage from "../features/reviews-management/pages/ReviewsPage";
import ComplaintsPage from "../features/complaints-management/pages/ComplaintsPage";
import TripSearchPage from "../features/trip-management/TripSearchPage";

export const CustomerServiceRoute: RouteObject = {
  path: "customer-service",
  element: <DashboardLayout />,
  children: [
    {
      // Trang chủ mặc định khi CS đăng nhập
      index: true,
      element: <Dashboard />,
    },
    {
      // Tính năng: Quản lý vé (Tìm kiếm và Cập nhật)
      path: "tickets",
      element: <TicketManagementPage />,
    },
    {
      // Tính năng: Tìm kiếm chuyến đi
      path: "trips",
      element: <TripSearchPage />,
    },
    {
      // Tính năng: Xử lý khiếu nại
      path: "complaints",
      element: <ComplaintsPage />,
    },
    {
      // Tính năng: Quản lý đánh giá (Lọc và Tìm kiếm)
      path: "reviews",
      element: <ReviewsPage />,
    },
  ],
};
