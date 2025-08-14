import type { LoggedInUser } from "../../stores/auth_store";
import apiClient from "./index";

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<
  | { accessToken: string; refreshToken: string; loggedInUser: LoggedInUser }
  | undefined
> => {
  const response = await apiClient.post("api/auth/login", credentials);
  console.log("Login response:", response);
  const result = response.data.result;
  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    loggedInUser: {
      userId: result.userId,
      email: result.email,
      role: result.role,
    },
  };
};

export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};
