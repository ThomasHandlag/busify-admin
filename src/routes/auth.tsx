import type { RouteObject } from "react-router";
import DashboardLayout from "../app/layouts/DashboardLayout";
import Dashboard from "../features/dashboard/dashboard";

export const AuthRoute: RouteObject = {
  path: "dashboard",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
  ],
};
