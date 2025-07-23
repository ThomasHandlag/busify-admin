import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("dashboard");
    } else {
      navigate("login");
    }
  });
  return <div className="max-w-full h-screen">{children}</div>;
};

export default AppLayout;
