import { useQuery } from "@tanstack/react-query";
import {
  getAuditLogs,
  type AuditLogFilterParams,
} from "../../../app/api/audit-log";

// Hook for fetching audit logs with filters
export const useAuditLogs = (filters: AuditLogFilterParams = {}) => {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => getAuditLogs(filters),
    placeholderData: (previousData) => previousData,
  });
};

// Hook for audit logs with default pagination
export const useAuditLogsWithPagination = (
  page: number = 0,
  size: number = 20,
  additionalFilters: Omit<AuditLogFilterParams, "page" | "size"> = {}
) => {
  const filters: AuditLogFilterParams = {
    page,
    size,
    ...additionalFilters,
  };

  return useAuditLogs(filters);
};
