import React from "react";
import { useAuthStore } from "../stores/auth_store";
import AccessDenied from "./AccessDenied";
import { useNavigate } from "react-router";

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const user = useAuthStore((state) => state.loggedInUser);
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleRequest = () => console.log("request access...");
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <AccessDenied
        message={
          <>
            Bạn không có quyền truy cập vào nội dung này.
            <br />
            Vui lòng đăng nhập đúng tài khoản hoặc xin cấp quyền.
          </>
        }
        onLogin={handleLogin}
        onRequestAccess={handleRequest}
        homeHref="/"
      />
    );
  }
  return children;
};
export default ProtectedRoute;
