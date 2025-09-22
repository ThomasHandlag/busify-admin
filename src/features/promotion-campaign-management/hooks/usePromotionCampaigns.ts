import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  createPromotionCampaign,
  updatePromotionCampaign,
  deletePromotionCampaign,
  restorePromotionCampaign,
  getAllPromotionCampaigns,
  filterCampaignsOnFrontend,
  paginateCampaigns,
  getPromotionCampaignById,
  type PromotionCampaignCreateDTO,
  type PromotionCampaignUpdateDTO,
  type PromotionCampaignFilterParams,
} from "../../../app/api/promotion-campaign";

// Error type for better type safety
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

// Query keys
const PROMOTION_CAMPAIGN_KEYS = {
  all: ["promotion-campaigns"] as const,
  details: () => [...PROMOTION_CAMPAIGN_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PROMOTION_CAMPAIGN_KEYS.details(), id] as const,
};

// Hooks
export const usePromotionCampaigns = (
  params: PromotionCampaignFilterParams
) => {
  return useQuery({
    queryKey: PROMOTION_CAMPAIGN_KEYS.all,
    queryFn: () => getAllPromotionCampaigns(),
    select: (response) => {
      const allCampaigns = response.result.campaigns;

      // Apply frontend filtering
      const filteredCampaigns = filterCampaignsOnFrontend(allCampaigns, params);

      // Apply frontend pagination
      const paginatedResult = paginateCampaigns(
        filteredCampaigns,
        params.page || 1,
        params.size || 20
      );

      return paginatedResult;
    },
  });
};

export const usePromotionCampaign = (id: number) => {
  return useQuery({
    queryKey: PROMOTION_CAMPAIGN_KEYS.detail(id),
    queryFn: () => getPromotionCampaignById(id),
    select: (response) => response.result,
    enabled: !!id,
  });
};

export const useCreatePromotionCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PromotionCampaignCreateDTO) =>
      createPromotionCampaign(data),
    onSuccess: (response) => {
      console.log("Create campaign mutation success:", response);
      message.success("Tạo chiến dịch thành công!");
      queryClient.invalidateQueries({ queryKey: PROMOTION_CAMPAIGN_KEYS.all });
    },
    onError: (error: unknown) => {
      console.error("Create campaign mutation error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.message || "Có lỗi xảy ra khi tạo chiến dịch";
      message.error(errorMessage);
    },
  });
};

export const useUpdatePromotionCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: PromotionCampaignUpdateDTO;
    }) => updatePromotionCampaign(id, data),
    onSuccess: (response, variables) => {
      console.log("Update campaign mutation success:", response);
      message.success("Cập nhật chiến dịch thành công!");
      queryClient.invalidateQueries({ queryKey: PROMOTION_CAMPAIGN_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PROMOTION_CAMPAIGN_KEYS.detail(variables.id),
      });
    },
    onError: (error: unknown) => {
      console.error("Update campaign mutation error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật chiến dịch";
      message.error(errorMessage);
    },
  });
};

export const useDeletePromotionCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePromotionCampaign(id),
    onSuccess: (response) => {
      console.log("Delete campaign mutation success:", response);
      message.success("Xóa chiến dịch thành công!");
      queryClient.invalidateQueries({ queryKey: PROMOTION_CAMPAIGN_KEYS.all });
    },
    onError: (error: unknown) => {
      console.error("Delete campaign mutation error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.message || "Có lỗi xảy ra khi xóa chiến dịch";

      // Handle both 200 and 204 response codes as success
      if (
        apiError?.response?.status === 200 ||
        apiError?.response?.status === 204
      ) {
        message.success("Xóa chiến dịch thành công!");
        queryClient.invalidateQueries({
          queryKey: PROMOTION_CAMPAIGN_KEYS.all,
        });
        return;
      }

      message.error(errorMessage);
    },
  });
};

export const useRestorePromotionCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => restorePromotionCampaign(id),
    onSuccess: (response) => {
      console.log("Restore campaign mutation success:", response);
      message.success("Khôi phục chiến dịch thành công!");
      queryClient.invalidateQueries({
        queryKey: PROMOTION_CAMPAIGN_KEYS.all,
      });
    },
    onError: (error: unknown) => {
      console.error("Restore campaign mutation error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.message ||
        "Có lỗi xảy ra khi khôi phục chiến dịch";
      message.error(errorMessage);
    },
  });
};
