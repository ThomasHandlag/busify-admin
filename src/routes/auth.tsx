import type { RouteObject } from "react-router";
import DashboardLayout from "../app/layouts/DashboardLayout";
import Dashboard from "../features/dashboard/dashboard";
import UserManagement from "../features/user-management/user";
import ProtectedRoute from "../components/ProtectedRoute";

// Customer Service pages
import TicketWithCustomerServicePage from "../features/ticket-management/pages/TicketWithCustomerServicePage";
import TripWithCustomerServicePage from "../features/trip-management/TripWithCustomerService";
import ComplaintsWithCustomerServicePage from "../features/complaints-management/pages/ComplaintsWithCustomerServicePage";
import ReviewsWithCustomerServicePage from "../features/reviews-management/pages/ReviewsWithCustomerServicePage";
import BookingsWithCustomerService from "../features/bookings-mangement/pages/BookingsWithCustomerService";
import { DashboardWithCustomerService } from "../features/dashboard/dashboardWithCustomerService";

export function withRole(element: React.ReactNode, roles: string[]) {
  return <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>;
}

// Route cho vai trò Customer Service
export const CustomerServiceRoute: RouteObject = {
  path: "customer-service",
  element: withRole(<DashboardLayout />, ["CUSTOMER_SERVICE"]),
  children: [
    {
      index: true,
      element: <DashboardWithCustomerService />,
    },
    {
      path: "tickets",
      element: <TicketWithCustomerServicePage />,
    },
    {
      path: "trips",
      element: <TripWithCustomerServicePage />,
    },
    {
      path: "complaints",
      element: <ComplaintsWithCustomerServicePage />,
    },
    {
      path: "reviews",
      element: <ReviewsWithCustomerServicePage />,
    },
    {
      path: "bookings",
      element: <BookingsWithCustomerService />,
    },
  ],
};

// Route cho vai trò Admin
export const AuthRoute: RouteObject = {
  path: "admin",
  element: withRole(<DashboardLayout />, ["ADMIN"]),
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "users-management",
      element: <UserManagement />,
    },
  ],
};
