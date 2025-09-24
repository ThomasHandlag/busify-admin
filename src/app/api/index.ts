import axios from "axios";
import { useAuthStore } from "../../stores/auth_store";

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  result: T;
}

const apiClient = axios.create({
  baseURL: import.meta.env.SECRET_API || "http://localhost:8080/",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;
