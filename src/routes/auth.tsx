import type { RouteObject } from "react-router";
import DashboardLayout from "../app/layouts/DashboardLayout";
import Dashboard from "../features/dashboard/dashboard";
import UserManagement from "../features/user-management/user";
import ProtectedRoute from "../components/ProtectedRoute";

// Customer Service pages
import TicketManagementPage from "../features/ticket-management/pages/TicketManagementPage";
import ReviewsPage from "../features/reviews-management/pages/ReviewsPage";
import ComplaintsPage from "../features/complaints-management/pages/ComplaintsPage";
import TripSearchPage from "../features/trip-management/TripSearchPage";

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
      element: <Dashboard />,
    },
    {
      path: "tickets",
      element: <TicketManagementPage />,
    },
    {
      path: "trips",
      element: <TripSearchPage />,
    },
    {
      path: "complaints",
      element: <ComplaintsPage />,
    },
    {
      path: "reviews",
      element: <ReviewsPage />,
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
