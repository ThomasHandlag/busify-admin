import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../features/login/login";
import Dashboard from "../features/dashboard/dashboard";

export const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "login",
        element: <LoginPage />,
      }
    ]
  },
]);
