import apiClient from "./index";
import type { ApiResponse } from "./index";

// Types for revenue reports
export interface MonthlyReportData {
  year: number;
  month: number;
  operatorId: number;
  operatorName: string;
  operatorEmail: string;
  totalPassengers: number;
  totalTrips: number;
  totalRevenue: number;
  sentToAdmin: number;
  totalBuses: number;
  reportGeneratedDate: string;
}

export interface YearlyRevenueByMonth {
  year: number;
  month: number;
  totalPassengers: number;
  totalTrips: number;
  totalRevenue: number;
  totalActiveOperators: number;
}

export interface WeeklyReportData {
  operatorId: number;
  totalTrips: number;
  totalRevenue: number;
  totalPassengers: number;
  totalBuses: number;
}

export interface RevenueFilterParams {
  year?: number;
  month?: number;
  operatorId?: number;
}

export interface BookingStatusCount {
  count: number;
  status: string;
  percentage: number;
}

export interface PaginatedBusOperators {
  content: Array<{
    operatorId: number;
    operatorName: string;
    email: string;
  }>;
  empty: boolean;
  first: boolean;
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TopRevenueRoute {
  totalRevenue: number;
  totalTrips: number;
  endLocation: string;
  startLocation: string;
  routeId: number;
  averageRevenuePerTrip: number;
  totalBookings: number;
  routeName: string;
}

export interface TopRevenueTrip {
  totalRevenue: number;
  endLocation: string;
  startLocation: string;
  departureTime: string;
  tripId: number;
  pricePerSeat: number;
  busName: string;
  totalBookings: number;
  routeName: string;
  busOperatorName: string;
}

// API functions
export const getMonthlyReport = async (
  operatorId: number,
  month: number,
  year: number
): Promise<ApiResponse<MonthlyReportData>> => {
  const response = await apiClient.get(
    `api/bus-operators/${operatorId}/monthly-report?month=${month}&year=${year}`
  );
  return response.data;
};

export const getYearlyRevenue = async (
  year: number
): Promise<ApiResponse<YearlyRevenueByMonth[]>> => {
  const response = await apiClient.get(
    `api/bus-operators/admin/yearly-revenue?year=${year}`
  );
  return response.data;
};

export const getWeeklyReport = async (
  operatorId: number
): Promise<ApiResponse<WeeklyReportData>> => {
  const response = await apiClient.get(
    `api/bus-operators/${operatorId}/report`
  );
  return response.data;
};

// Get all bus operators for filter dropdown
export const getAllBusOperators = async (): Promise<
  ApiResponse<PaginatedBusOperators>
> => {
  const response = await apiClient.get("api/bus-operators/management");
  return response.data;
};

// Get booking status counts by year
export const getBookingStatusCountsByYear = async (
  year: number
): Promise<ApiResponse<BookingStatusCount[]>> => {
  const response = await apiClient.get(
    `api/bookings/admin/booking-status-counts-by-year?year=${year}`
  );
  return response.data;
};

// Get top revenue routes by year
export const getTopRevenueRoutes = async (
  year: number
): Promise<ApiResponse<TopRevenueRoute[]>> => {
  const response = await apiClient.get(
    `api/routes/admin/top-revenue-routes?year=${year}`
  );
  return response.data;
};

// Get top revenue trips by year
export const getTopRevenueTrips = async (
  year: number
): Promise<ApiResponse<TopRevenueTrip[]>> => {
  const response = await apiClient.get(
    `api/trips/admin/top-revenue-trips?year=${year}`
  );
  return response.data;
};
