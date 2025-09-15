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

export interface ComplaintStats {
  New: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

export interface ComplaintStatsResponse {
  code: number;
  message: string;
  result: ComplaintStats;
}

export interface DailyComplaintStats {
  newCount: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  rejectedCount: number;
}

export interface DailyComplaintStatsResponse {
  code: number;
  message: string;
  result: DailyComplaintStats;
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

export const getComplaintByAgent =
  async (): Promise<ComplaintDetailListResponse> => {
    try {
      const response = await apiClient.get(`api/complaints/agent/in-progress`);
      return response.data;
    } catch (error) {
      throw new Error(
        "Không thể lấy danh sách khiếu nại theo nhân viên" + error
      );
    }
  };

export const updateComplaintStatus = async (
  complaintId: number,
  status: string
): Promise<ComplaintDetailResponse> => {
  try {
    const response = await apiClient.patch(
      `/api/complaints/${complaintId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật trạng thái khiếu nại" + error);
  }
};

export const getComplaintStatsForCurrentAgent =
  async (): Promise<ComplaintStatsResponse> => {
    try {
      const response = await apiClient.get("api/complaints/agent/stats");
      return response.data;
    } catch (error) {
      throw new Error("Không thể lấy thống kê khiếu nại" + error);
    }
  };

export const getDailyComplaintStatsForCurrentAgent =
  async (): Promise<DailyComplaintStatsResponse> => {
    try {
      const response = await apiClient.get("api/complaints/agent/daily-stats");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Không thể lấy thống kê khiếu nại hàng ngày" + error);
    }
  };
