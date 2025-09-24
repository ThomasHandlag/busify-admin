export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  user?: User;
  role?: Role;
  assignedAt?: string;
  assignedBy?: number;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  roles?: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignRoleRequest {
  userId: number;
  roleIds: number[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds?: number[];
}

export interface UpdateRoleRequest {
  id: number;
  name?: string;
  description?: string;
  permissionIds?: number[];
}
