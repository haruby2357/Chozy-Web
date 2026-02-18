import axiosInstance from "../../../axiosInstance";
import type { RecommendResult } from "./types";
import type { ApiResponse } from "../../../client/types";

export async function getRecommendProducts(params?: {
  page?: number;
  size?: number;
}) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 12;

  const res = await axiosInstance.get<ApiResponse<RecommendResult>>(
    "/home/products/recommend",
    { params: { page, size } },
  );

  return res.data;
}
