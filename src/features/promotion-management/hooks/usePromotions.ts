import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  createPromotion,
  updatePromotion,
  deletePromotion,
  filterPromotions,
  getPromotionById,
  type PromotionFilterParams,
  type PromotionRequestDTO,
  type PromotionFilterResponseDTO,
} from "../../../app/api/promotion";

// Query Keys
export const promotionKeys = {
  all: ["promotions"] as const,
  lists: () => [...promotionKeys.all, "list"] as const,
  list: (filters: PromotionFilterParams) =>
    [...promotionKeys.lists(), filters] as const,
  details: () => [...promotionKeys.all, "detail"] as const,
  detail: (id: number) => [...promotionKeys.details(), id] as const,
};

// Hook để fetch promotions với filter và pagination
export const usePromotions = (params: PromotionFilterParams) => {
  return useQuery({
    queryKey: promotionKeys.list(params),
    queryFn: async () => {
      const response = await filterPromotions(params);
      if (response.code === 200) {
        return response.result as PromotionFilterResponseDTO;
      }
      throw new Error(response.message || "Failed to fetch promotions");
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để fetch promotion by ID
export const usePromotion = (id: number) => {
  return useQuery({
    queryKey: promotionKeys.detail(id),
    queryFn: async () => {
      const response = await getPromotionById(id);
      if (response.code === 200) {
        return response.result;
      }
      throw new Error(response.message || "Failed to fetch promotion");
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook để create promotion
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PromotionRequestDTO) => {
      const response = await createPromotion(data);
      if (response.code !== 200 && response.code !== 201) {
        throw new Error(response.message || "Failed to create promotion");
      }
      return response.result;
    },
    onSuccess: () => {
      // Invalidate and refetch promotion lists
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      message.success("Tạo mã giảm giá thành công!");
    },
    onError: (error: Error) => {
      message.error(`Không thể tạo mã giảm giá: ${error.message}`);
    },
  });
};

// Hook để update promotion
export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<PromotionRequestDTO>;
    }) => {
      const response = await updatePromotion(id, data);
      if (response.code !== 200) {
        throw new Error(response.message || "Failed to update promotion");
      }
      return response.result;
    },
    onSuccess: (data, variables) => {
      // Update the specific promotion in cache
      queryClient.setQueryData(promotionKeys.detail(variables.id), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      message.success("Cập nhật mã giảm giá thành công!");
    },
    onError: (error: Error) => {
      message.error(`Không thể cập nhật mã giảm giá: ${error.message}`);
    },
  });
};

// Hook để delete promotion
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deletePromotion(id);
      console.log("Delete promotion hook response:", response);

      // Accept both 200 and 204 as success codes for delete operations
      if (response.code !== 200 && response.code !== 204) {
        console.error(
          "Delete failed with code:",
          response.code,
          "message:",
          response.message
        );
        throw new Error(response.message || "Failed to delete promotion");
      }
      return response.result;
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: promotionKeys.detail(deletedId) });
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      message.success("Xóa mã giảm giá thành công!");
    },
    onError: (error: Error) => {
      console.error("Delete promotion error:", error);
      message.error(`Không thể xóa mã giảm giá: ${error.message}`);
    },
  });
};
