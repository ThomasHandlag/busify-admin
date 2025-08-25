import apiClient from ".";

export interface SeatStatus {
  seatNumber: string;
  status: string; // e.g. "available"
}

export interface TripSeatsResult {
  tripId: number;
  seatsStatus: SeatStatus[];
}

export interface TripSeatsResponse {
  code: number;
  message: string;
  result: TripSeatsResult;
}

export const getTripSeats = async (
  tripId: number
): Promise<TripSeatsResponse> => {
  const response = await apiClient.get(`/api/trip-seats/${tripId}`);
  return response.data;
};
