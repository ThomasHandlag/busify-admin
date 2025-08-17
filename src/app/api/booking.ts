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
  // API now returns an array of detailed booking objects (see example in request)
  result: BookingDetailAPI;
}

// Detailed booking shape returned by GET /api/bookings/{code}
export interface BookingDetailAPI {
  booking_id: number;
  passenger_name: string;
  phone: string;
  email: string;
  route_start: {
    name: string;
    address: string;
    city: string;
  };
  route_end: {
    name: string;
    address: string;
    city: string;
  };
  operator_name: string;
  departure_time: string;
  arrival_estimate_time: string;
  bus: {
    model: string;
    license_plate: string;
  };
  tickets: {
    seat_number: string;
    ticket_code: string;
  }[];
  status: string;
  payment_info: {
    amount: number;
    method: string;
    timestamp: string;
  };
}

export interface UpdateBookingParams {
  guestAddress?: string;
  guestFullName?: string;
  guestPhone?: string;
  guestEmail?: string;
}

export const getAllBookings = async (): Promise<BookingResponse> => {
  try {
    const response = await apiClient.get("api/bookings/all");
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách đặt vé" + error);
  }
};

export const getBookingByCode = async (
  bookingCode: string
): Promise<BookingDetailResponse> => {
  try {
    const response = await apiClient.get(`api/bookings/${bookingCode}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin chi tiết đặt vé" + error);
  }
};

export const updateBooking = async (
  bookingCode: string,
  params: UpdateBookingParams
): Promise<BookingDetailResponse> => {
  try {
    const response = await apiClient.patch(
      `api/bookings/${bookingCode}`,
      params
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật thông tin đặt vé" + error);
  }
};
