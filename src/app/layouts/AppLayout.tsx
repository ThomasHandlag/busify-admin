import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/auth_store";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const auth = useAuthStore();
  useEffect(() => {
    if (auth.loggedInUser) {
      navigate(window.location.pathname);
    } else {
      navigate("/login");
    }
  }, [auth.loggedInUser, navigate]);
  return <div className="max-w-full h-screen">{children}</div>;
};

export default AppLayout;
