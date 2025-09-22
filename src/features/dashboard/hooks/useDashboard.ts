import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import dashboardApi from "../../../app/api/dashboard";
import type {
  DashboardStats,
  RecentActivity,
  RevenueData,
  UserGrowthData,
} from "../../../app/api/dashboard";

// Helper function for error handling
const getErrorMessage = (err: unknown): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || "Đã xảy ra lỗi không xác định";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Đã xảy ra lỗi không xác định";
};

// Hook for dashboard statistics
export const useDashboardStats = (
  autoRefresh = false,
  refreshInterval = 30000
) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardApi.getStats();
      setStats(response.result);
    } catch (err: unknown) {
      const errorMessage =
        getErrorMessage(err) || "Không thể tải dữ liệu thống kê";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook for recent activities
export const useRecentActivities = (
  limit = 10,
  autoRefresh = true,
  refreshInterval = 15000
) => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      if (activities.length === 0) setLoading(true);
      setError(null);
      const response = await dashboardApi.getRecentActivities(limit);
      setActivities(response.result);
    } catch (err: unknown) {
      const errorMessage =
        getErrorMessage(err) || "Không thể tải hoạt động gần đây";
      setError(errorMessage);
      if (activities.length === 0) {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [limit, activities.length]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchActivities, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
};

// Hook for revenue data
export const useRevenueData = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardApi.getRevenueData();
      setRevenueData(response.result);
    } catch (err: unknown) {
      const errorMessage =
        getErrorMessage(err) || "Không thể tải dữ liệu doanh thu";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  return { revenueData, loading, error, refetch: fetchRevenueData };
};

// Remove system health hook since we don't have that API
// Remove unused hooks and keep only what we need
// Hook for user growth data (keeping for potential future use)
export const useUserGrowthData = (months = 12) => {
  const [userGrowthData] = useState<UserGrowthData[]>([]);
  const [loading] = useState(false); // Set to false since we're not using it currently
  const [error] = useState<string | null>(null);

  // Currently not implemented, but keeping structure for future
  const fetchUserGrowthData = useCallback(async () => {
    console.log("User growth data fetch not yet implemented", months);
    // Future implementation could use user API with date filtering
  }, [months]);

  return { userGrowthData, loading, error, refetch: fetchUserGrowthData };
};
