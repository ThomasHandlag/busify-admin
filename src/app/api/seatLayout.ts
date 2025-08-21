import apiClient from ".";

export interface LayoutData {
  cols: number;
  rows: number;
  floors: number;
}

export interface SeatLayoutResult {
  id: number;
  name: string;
  layoutData: LayoutData;
}

export interface SeatLayoutResponse {
  code: number;
  message: string;
  result: SeatLayoutResult;
}

export const getSeatLayout = async (
  tripId: string
): Promise<SeatLayoutResponse> => {
  const response = await apiClient.get(`/api/seat-layout/trip/${tripId}`);
  return response.data;
};
