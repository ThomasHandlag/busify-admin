import apiClient from "./index";

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};