import type { RouteObject } from "react-router";
import DashboardLayout from "../app/layouts/DashboardLayout";
import Dashboard from "../features/dashboard/dashboard";
import UserManagement from "../features/user-management/user";
import ProtectedRoute from "../components/ProtectedRoute";
import BusOperatorManagement from "../features/bus-operator-management/bus-operator";

// Remove this line; useAuthStore should only be called inside a React component or custom hook

export function withRole(element: React.ReactNode, roles: string[]) {
  return <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>;
}

export const AuthRoute: RouteObject = {
  path: "admin",
  element: withRole(<DashboardLayout />, ["ADMIN", "EMPLOYEE"]),
  children: [
    {
      index: true,
      element: withRole(<Dashboard />, ["ADMIN", "EMPLOYEE"]),
    },
    {
      path: "users-management",
      element: withRole(<UserManagement />, ["ADMIN"]),
    },
    {
      path: "bus-operators-management",
      element: withRole(<BusOperatorManagement />, ["ADMIN"]),
    },
  ],
};
