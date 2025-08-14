import type { RouteObject } from "react-router";
import DashboardLayout from "../app/layouts/DashboardLayout";
import Dashboard from "../features/dashboard/dashboard";
import UserManagement from "../features/user-management/user";

export const AuthRoute: RouteObject = {
  path: "admin",
  element: <DashboardLayout />,
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
