import { createBrowserRouter } from "react-router";
import App from "../App";

export const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);
