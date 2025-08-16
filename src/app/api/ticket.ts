/* eslint-disable @typescript-eslint/no-unused-vars */

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

export interface TicketResponse {
  code: number;
  message: string;
  result: { tickets: Ticket }[];
}

export interface TicketSearchParams {
  ticketCode?: string;
  name?: string;
  phone?: string;
}

export const getAllTickets = async (): Promise<TicketResponse> => {
  try {
    const response = await apiClient.get("/tickets");
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách vé");
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
      `/tickets/search?${searchParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể tìm kiếm vé");
  }
};
