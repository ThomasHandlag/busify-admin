import apiClient from ".";

export interface Review {
  reviewId: number;
  rating: number;
  customerName: string;
  customerEmail: string;
  comment: string;
  createdAt: string;
}

export interface ReviewResponse {
  code: number;
  message: string;
  result: {
    reviews: Review[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ReviewFilterParams {
  rating?: number;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
}

export interface ReviewSearchParams {
  customerName?: string;
  comment?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export const getAllReviews = async (
  params: PaginationParams
): Promise<ReviewResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    const response = await apiClient.get(
      `api/reviews?${searchParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách đánh giá" + error);
  }
};

export const filterReviews = async (
  params: ReviewFilterParams & PaginationParams
): Promise<ReviewResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.rating) searchParams.append("rating", params.rating.toString());
    if (params.minRating)
      searchParams.append("minRating", params.minRating.toString());
    if (params.maxRating)
      searchParams.append("maxRating", params.maxRating.toString());
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    const response = await apiClient.get(
      `api/reviews/filter?${searchParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể lọc đánh giá" + error);
  }
};

export const searchReviews = async (
  params: ReviewSearchParams & PaginationParams
): Promise<ReviewResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.customerName)
      searchParams.append("customerName", params.customerName);
    if (params.comment) searchParams.append("comment", params.comment);
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    const response = await apiClient.get(
      `api/reviews/search?${searchParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể tìm kiếm đánh giá" + error);
  }
};
