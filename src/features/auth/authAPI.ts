// define auth api here

import apiClient from "../../api-client";

export const login = async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
}
