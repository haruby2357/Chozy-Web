// 상품페이지 상품 목록 조회
import axiosInstance from "../../../axiosInstance";
import type { HomeProductsRequest, HomeProductsOuterResult } from "./types";
import type { ApiResponse } from "../../../client/types";

export async function getHomeProducts(request: HomeProductsRequest) {
  const params = new URLSearchParams();

  Object.entries(request).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    params.set(key, String(value));
  });

  const qs = params.toString();
  const url = qs ? `/home/products?${qs}` : "/home/products";

  const res =
    await axiosInstance.get<ApiResponse<HomeProductsOuterResult>>(url);
  return res.data;
}
