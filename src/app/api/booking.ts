/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from ".";

export interface Booking {
  booking_id: number;
  route_name: string;
  departure_time: string;
  arrival_time: string;
  departure_name: string;
  arrival_name: string;
  booking_code: string;
  status: string;
  total_amount: number;
  booking_date: string;
  ticket_count: number;
  payment_method: string;
}

export interface BookingDetail {
  id: number;
  bookingCode: string;
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string;
  seatNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  tripId: number;
}

export interface BookingResponse {
  code: number;
  message: string;
  result: Booking[];
}

export interface BookingDetailResponse {
  code: number;
  message: string;
  result: BookingDetail;
}

export interface UpdateBookingParams {
  guestAddress?: string;
  guestFullName?: string;
  guestPhone?: string;
  guestEmail?: string;
}

export const getAllBookings = async (): Promise<BookingResponse> => {
  try {
    const response = await apiClient.get("/bookings/all");
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách đặt vé");
  }
};

export const getBookingByCode = async (
  bookingCode: string
): Promise<BookingDetailResponse> => {
  try {
    const response = await apiClient.get(`/bookings/${bookingCode}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin chi tiết đặt vé");
  }
};

export const updateBooking = async (
  bookingCode: string,
  params: UpdateBookingParams
): Promise<BookingDetailResponse> => {
  try {
    const response = await apiClient.patch(`/bookings/${bookingCode}`, params);
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật thông tin đặt vé");
  }
};
