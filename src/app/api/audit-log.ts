import apiClient from "./index";
import type { ApiResponse } from "./index";

// Types for Audit Log
export interface AuditLogResponseDTO {
  id: number;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  action: string;
  targetEntity: string;
  targetId: number;
  details: string;
  timestamp: string;
}

export interface AuditLogPageResponseDTO {
  auditLogs: AuditLogResponseDTO[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Filter parameters
export interface AuditLogFilterParams {
  userId?: number;
  action?: string;
  targetEntity?: string;
  startDate?: string; // ISO string format
  endDate?: string; // ISO string format
  page?: number;
  size?: number;
}

// Constants for filter options
export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  USE: "USE",
} as const;

export const TargetEntity = {
  PROMOTION: "PROMOTION",
  USER_PROFILE: "USER_PROFILE",
  BOOKING: "BOOKING",
  PAYMENT: "PAYMENT",
  USER_PROMOTION: "USER_PROMOTION",
  TICKET: "TICKET",
  USER: "USER",
  BUS: "BUS",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type AuditActionType = (typeof AuditAction)[keyof typeof AuditAction];
export type TargetEntityType = (typeof TargetEntity)[keyof typeof TargetEntity];

// API Functions
export const getAuditLogs = async (
  params: AuditLogFilterParams = {}
): Promise<ApiResponse<AuditLogPageResponseDTO>> => {
  const searchParams = new URLSearchParams();

  if (params.userId) searchParams.append("userId", params.userId.toString());
  if (params.action) searchParams.append("action", params.action);
  if (params.targetEntity)
    searchParams.append("targetEntity", params.targetEntity);
  if (params.startDate) searchParams.append("startDate", params.startDate);
  if (params.endDate) searchParams.append("endDate", params.endDate);
  if (params.page !== undefined)
    searchParams.append("page", params.page.toString());
  if (params.size !== undefined)
    searchParams.append("size", params.size.toString());

  const response = await apiClient.get(
    `/api/audit-logs/filter?${searchParams.toString()}`
  );
  return response.data;
};

// Helper function to parse details JSON
export const parseDetails = (
  details: string
): Record<string, unknown> | null => {
  try {
    return JSON.parse(details) as Record<string, unknown>;
  } catch (error) {
    console.error("Failed to parse audit log details:", error);
    return null;
  }
};

// Helper function to get action color
export const getActionColor = (action: string): string => {
  switch (action) {
    case AuditAction.CREATE:
      return "green";
    case AuditAction.UPDATE:
      return "blue";
    case AuditAction.DELETE:
      return "red";
    case AuditAction.USE:
      return "purple";
    default:
      return "default";
  }
};

// Helper function to get entity color
export const getEntityColor = (entity: string): string => {
  switch (entity) {
    case TargetEntity.BOOKING:
      return "cyan";
    case TargetEntity.PAYMENT:
      return "gold";
    case TargetEntity.USER:
      return "geekblue";
    case TargetEntity.PROMOTION:
      return "magenta";
    case TargetEntity.BUS:
      return "orange";
    case TargetEntity.TICKET:
      return "volcano";
    default:
      return "default";
  }
};
