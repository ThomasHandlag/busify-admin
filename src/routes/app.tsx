import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../features/auth/login";

import { AuthRoute, CustomerServiceRoute } from "./auth";
import NotFoundPage from "../components/NotFoundPage";

export const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      AuthRoute,
      CustomerServiceRoute, // Thêm CustomerServiceRoute vào đây
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
