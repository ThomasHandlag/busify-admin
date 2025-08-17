/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from ".";

export interface Trip {
  trip_id: number;
  operator_name: string;
  route: {
    start_location: string;
    end_location: string;
  };
  amenities: {
    wifi?: boolean;
    air_conditioner?: boolean;
    usb_charging?: boolean;
    tv?: boolean;
  };
  average_rating: number;
  departure_time: string;
  arrival_time: string;
  status: string;
  price_per_seat: number;
  available_seats: number;
}

export interface TripResponse {
  code: number;
  message: string;
  result: Trip[];
}

export interface TripFilterParams {
  routeId?: number;
  busOperatorIds?: number[];
  departureDate?: string;
  busModels?: string[];
  untilTime?: string;
  availableSeats?: number;
  amenities?: string[];
}

export const getAllTrips = async (): Promise<TripResponse> => {
  try {
    const response = await apiClient.get("api/trips");
    return response.data;
  } catch (error: any) {
    console.error("API Error - getAllTrips:", error);
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách chuyến đi"
    );
  }
};

export const filterTrips = async (
  params: TripFilterParams
): Promise<TripResponse> => {
  try {
    const response = await apiClient.post("api/trips/filter", params);
    return response.data;
  } catch (error: any) {
    console.error("API Error - filterTrips:", error);
    throw new Error(error.response?.data?.message || "Không thể lọc chuyến đi");
  }
};

export const getTripById = async (
  tripId: number
): Promise<{ code: number; message: string; result: Trip }> => {
  try {
    const response = await apiClient.get(`api/trips/${tripId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error - getTripById:", error);
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin chuyến đi"
    );
  }
};
