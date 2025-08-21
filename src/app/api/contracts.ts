import apiClient from "./index";
import type { ApiResponse } from "./index";

// Contract status enum
export const ContractStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type ContractStatus =
  (typeof ContractStatus)[keyof typeof ContractStatus];

// Admin review actions enum
export const ReviewAction = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  REQUEST_REVISION: "REQUEST_REVISION",
} as const;

export type ReviewAction = (typeof ReviewAction)[keyof typeof ReviewAction];

// Types based on actual API response
export interface ContractData {
  id: number;
  vatCode: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  endDate: string;
  operationArea: string;
  attachmentUrl: string;
  approvedDate?: string;
  adminNote?: string;
  status: ContractStatus;
  createdDate: string;
  updatedDate: string;
}

export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ContractListResponse {
  content: ContractData[];
  pageable: PageableInfo;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ReviewContractRequest {
  action: ReviewAction;
  adminNote?: string;
}

export interface ReviewContractResponse {
  id: number;
  vatCode: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  endDate: string;
  operationArea: string;
  attachmentUrl: string;
  approvedDate?: string;
  adminNote?: string;
  status: ContractStatus;
  createdDate: string;
  updatedDate: string;
}

export interface ContractFilterParams {
  page?: number;
  size?: number;
  status?: ContractStatus;
  email?: string;
  operationArea?: string;
}

// Contract API functions
export const contractsApi = {
  // Get all contracts with pagination and filters
  getAllContracts: async (
    params: ContractFilterParams = {}
  ): Promise<ContractListResponse> => {
    const { page = 1, size = 10, status, email, operationArea } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) {
      searchParams.append("status", status);
    }
    if (email) {
      searchParams.append("email", email);
    }
    if (operationArea) {
      searchParams.append("operationArea", operationArea);
    }

    const response = await apiClient.get<ApiResponse<ContractListResponse>>(
      `/api/contracts/admin/all?${searchParams.toString()}`
    );
    return response.data.result;
  },

  // Admin review contract
  reviewContract: async (
    contractId: number,
    data: ReviewContractRequest
  ): Promise<ApiResponse<ReviewContractResponse>> => {
    const response = await apiClient.post<ApiResponse<ReviewContractResponse>>(
      `/api/contracts/admin/${contractId}/review`,
      data
    );
    return response.data;
  },

  // Get contract by ID (optional for future use)
  getContractById: async (contractId: number): Promise<ContractData> => {
    const response = await apiClient.get<ApiResponse<ContractData>>(
      `/api/contracts/admin/${contractId}`
    );
    return response.data.result;
  },
};
