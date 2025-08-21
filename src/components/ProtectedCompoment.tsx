import React from "react";
import { useAuthStore } from "../stores/auth_store";

interface ProtectedComponentProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedComponent = ({
  allowedRoles,
  children,
}: ProtectedComponentProps) => {
  const user = useAuthStore((state) => state.loggedInUser);
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  return null;
};

export default ProtectedComponent;
