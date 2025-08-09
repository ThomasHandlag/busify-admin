import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.SECRET_API || "http://localhost:8080/",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
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
