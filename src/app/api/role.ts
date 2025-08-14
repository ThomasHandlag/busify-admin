import apiClient, { type ApiResponse } from "./index";

export interface Role {
  id: number;
  name: string;
}
export const getAllRoles = async (): Promise<ApiResponse> => {
  const response = await apiClient.get("api/roles");
  return response.data;
};
