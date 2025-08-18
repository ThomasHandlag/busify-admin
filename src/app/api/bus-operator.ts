import apiClient from "./index";

export interface BusOperatorFilterParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
export const getAllBusOperatorsManagement = async (
  params: BusOperatorFilterParams
) => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append("search", params.search);
  if (params.status) {
    searchParams.append("status", params.status);
  } else {
    searchParams.append("status", "active");
  }
  if (params.page !== undefined)
    searchParams.append("page", params.page.toString());
  if (params.size !== undefined)
    searchParams.append("size", params.size.toString());
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.sortDirection)
    searchParams.append("sortDirection", params.sortDirection);

  const response = await apiClient.get(
    `/api/bus-operators/management?${searchParams.toString()}`
  );
  return response.data;
};

export const updateBusOperator = async (id: number, data: FormData) => {
  const response = await apiClient.put(
    `/api/bus-operators/management/${id}`,
    data
  );
  return response.data;
};

export const createBusOperator = async (data: FormData) => {
  const response = await apiClient.post(`/api/bus-operators/management`, data);
  return response.data;
};

export const deleteBusOperatorById = async (id: number) => {
  const response = await apiClient.delete(
    `/api/bus-operators/management/${id}`
  );
  return response.data;
};
