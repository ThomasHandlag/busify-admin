import type { RouteObject } from "react-router";
import DashboardLayout from "../app/layouts/DashboardLayout";
import Dashboard from "../features/dashboard/dashboard";
import UserManagement from "../features/user-management/user";
import ProtectedRoute from "../components/ProtectedRoute";

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
  ],
};
