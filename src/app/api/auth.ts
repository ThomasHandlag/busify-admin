import type { LoggedInUser } from "../../stores/authStore";
import apiClient from "./index";

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<
  | { accessToken: string; refreshToken: string; loggedInUser: LoggedInUser }
  | undefined
> => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data as {
      accessToken: string;
      refreshToken: string;
      loggedInUser: LoggedInUser;
    };
  } catch (error) {
    console.error("Login failed:", error);
    return undefined;
  }
};

export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};
