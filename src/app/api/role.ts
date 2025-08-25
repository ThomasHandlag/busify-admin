import apiClient, { type ApiResponse } from "./index";
import type {
  AssignRoleRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../../types/role";

// Role APIs
export const getAllRoles = async (): Promise<ApiResponse> => {
  const response = await apiClient.get("api/roles");
  return response.data;
};

export const getRoleById = async (id: number): Promise<ApiResponse> => {
  const response = await apiClient.get(`api/roles/${id}`);
  return response.data;
};

export const createRole = async (
  data: CreateRoleRequest
): Promise<ApiResponse> => {
  const response = await apiClient.post("api/roles", data);
  return response.data;
};

export const updateRole = async (
  data: UpdateRoleRequest
): Promise<ApiResponse> => {
  const response = await apiClient.put(`api/roles/${data.id}`, data);
  return response.data;
};

export const deleteRole = async (id: number): Promise<ApiResponse> => {
  const response = await apiClient.delete(`api/roles/${id}`);
  return response.data;
};

// Permission APIs
export const getAllPermissions = async (): Promise<ApiResponse> => {
  const response = await apiClient.get("api/permissions");
  return response.data;
};

// User Role APIs
export const getUserRoles = async (userId: number): Promise<ApiResponse> => {
  const response = await apiClient.get(`api/users/${userId}/roles`);
  return response.data;
};

export const assignRolesToUser = async (
  data: AssignRoleRequest
): Promise<ApiResponse> => {
  const response = await apiClient.post(`api/users/${data.userId}/roles`, {
    roleIds: data.roleIds,
  });
  return response.data;
};

export const removeRoleFromUser = async (
  userId: number,
  roleId: number
): Promise<ApiResponse> => {
  const response = await apiClient.delete(
    `api/users/${userId}/roles/${roleId}`
  );
  return response.data;
};

// Get all users with their roles
export const getAllUsersWithRoles = async (): Promise<ApiResponse> => {
  const response = await apiClient.get("api/users/with-roles");
  return response.data;
};
