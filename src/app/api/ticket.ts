import apiClient from ".";

export interface Ticket {
  ticketId: number;
  passengerName: string;
  passengerPhone: string;
  price: number;
  seatNumber: string;
  status: string;
  ticketCode: string;
  bookingId: number;
}

export interface TicketDetail {
  ticketCode: string;
  passengerName: string;
  passengerPhone: string;
  seatNumber: string;
  price: number;
  status: string;
  booking: {
    bookingId: number;
    bookingCode: string;
    status: string;
    totalAmount: number;
    bookingDate: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: string;
    paidAt: string;
  };
  trip: {
    tripId: number;
    departureTime: string;
    arrivalTime: string;
    pricePerSeat: number;
    route: {
      routeId: number;
      routeName: string;
      startLocation: { name: string };
      endLocation: { name: string };
    };
    bus: {
      busId: number;
      model: string;
      licensePlate: string;
    };
    operator: {
      operatorName: string;
    };
  };
}

export interface TicketResponse {
  code: number;
  message: string;
  result: { tickets: Ticket }[];
}

export interface TicketDetailResponse {
  code: number;
  message: string;
  result: TicketDetail;
}

export interface TicketSearchParams {
  ticketCode?: string;
  name?: string;
  phone?: string;
}

export const getAllTickets = async (): Promise<TicketResponse> => {
  try {
    const response = await apiClient.get("api/tickets");
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách vé" + error);
  }
};

export const searchTickets = async (
  params: TicketSearchParams
): Promise<TicketResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.ticketCode) searchParams.append("ticketCode", params.ticketCode);
    if (params.name) searchParams.append("name", params.name);
    if (params.phone) searchParams.append("phone", params.phone);

    const response = await apiClient.get(
      `api/tickets/search?${searchParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể tìm kiếm vé" + error);
  }
};

export const getTicketByCode = async (
  ticketCode: string
): Promise<TicketDetailResponse> => {
  try {
    const response = await apiClient.get(`/api/tickets/${ticketCode}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin chi tiết vé" + error);
  }
};
