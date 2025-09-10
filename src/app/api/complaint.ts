import apiClient from ".";

export interface Complaint {
  id: number;
  title: string;
  description: string;
  customerName: string;
  createdAt: string;
  status: string;
}

export interface ComplaintDetail {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    customerId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  };
  booking: {
    bookingId: number;
    bookingCode: string;
    bookingStatus: string;
    totalAmount: number;
    seatNumber: string;
    bookingDate: string;
    routeName: string;
    startLocation: string;
    endLocation: string;
    departureTime: string;
    arrivalTime: string;
    operatorName: string;
    busLicensePlate: string;
  };
  assignedAgent: unknown;
}

export interface ComplaintResponse {
  code: number;
  message: string;
  result: {
    complaints: Complaint[];
  };
}

export interface ComplaintDetailResponse {
  code: number;
  message: string;
  result: ComplaintDetail;
}

export interface ComplaintDetailListResponse {
  code: number;
  message: string;
  result: ComplaintDetail[];
}

export interface UpdateComplaintParams {
  title?: string;
  description?: string;
  status?: string;
  assignedAgentId?: number;
}

export const getAllComplaints = async (): Promise<ComplaintResponse> => {
  try {
    const response = await apiClient.get("api/complaints");
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách khiếu nại" + error);
  }
};

export const getComplaintById = async (
  complaintId: number
): Promise<ComplaintDetailResponse> => {
  try {
    const response = await apiClient.get(`api/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin chi tiết khiếu nại" + error);
  }
};

export const updateComplaint = async (
  complaintId: number,
  params: UpdateComplaintParams
): Promise<ComplaintDetailResponse> => {
  try {
    const response = await apiClient.patch(
      `api/complaints/${complaintId}`,
      params
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật khiếu nại" + error);
  }
};

export const getComplaintByAgent = async (
): Promise<ComplaintDetailListResponse> => {
  try {
    const response = await apiClient.get(`api/complaints/agent/in-progress`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách khiếu nại theo nhân viên" + error);
  }
};
