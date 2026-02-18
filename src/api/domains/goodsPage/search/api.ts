import axiosInstance from "../../../axiosInstance";
import type {
  ApiResponse,
  RecentKeyword,
  RecentKeywordsResult,
  PopularKeyword,
  RecommendKeyword,
  RecentProduct,
} from "./types";

const getUserId = (): number => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("accessToken이 없습니다.");

  const payload = JSON.parse(atob(token.split(".")[1])) as {
    sub?: string | number;
  };

  const userId = Number(payload.sub);
  if (!Number.isFinite(userId)) {
    throw new Error("유효하지 않은 userId");
  }

  return userId;
};

export const getRecentKeywords = async (): Promise<RecentKeyword[]> => {
  const userId = getUserId();

  const { data } = await axiosInstance.get<ApiResponse<RecentKeywordsResult>>(
    "/home/searches/recent",
    { params: { userId } },
  );

  if (!data.success) throw new Error(data.message);
  return data.result.keywords ?? [];
};

export const getPopularKeywords = async (): Promise<PopularKeyword[]> => {
  const { data } = await axiosInstance.get<ApiResponse<PopularKeyword[]>>(
    "/home/searches/popular",
  );

  if (!data.success) throw new Error(data.message);
  return data.result ?? [];
};

export const getRecommendKeywords = async (
  keyword: string,
  signal?: AbortSignal,
): Promise<RecommendKeyword[]> => {
  const { data } = await axiosInstance.get<ApiResponse<RecentKeywordsResult>>(
    "/home/searches/recommend",
    { params: { keyword }, signal },
  );

  if (!data.success) throw new Error(data.message);
  return data.result.keywords ?? [];
};

export const saveSearchKeyword = async (keyword: string) => {
  const userId = getUserId();

  const { data } = await axiosInstance.post<ApiResponse<unknown>>(
    "/home/searches",
    { keyword },
    { params: { userId } },
  );

  if (!data.success) throw new Error(data.message);
};

export const deleteAllRecentKeywords = async () => {
  const userId = getUserId();

  const { data } = await axiosInstance.delete<ApiResponse<unknown>>(
    "/home/searches/recent",
    { params: { userId } },
  );

  if (!data.success) throw new Error(data.message);
};

export const deleteRecentKeyword = async (keywordId: number) => {
  const { data } = await axiosInstance.delete<ApiResponse<unknown>>(
    `/home/searches/recent/${keywordId}`,
  );

  if (!data.success) throw new Error(data.message);
};

export const getRecentProducts = async (): Promise<RecentProduct[]> => {
  const userId = getUserId();

  const { data } = await axiosInstance.get<ApiResponse<RecentProduct[]>>(
    "/home/products/recent",
    { params: { userId } },
  );

  if (!data.success) throw new Error(data.message);
  return data.result ?? [];
};

export const saveRecentProduct = async (productId: number) => {
  const userId = getUserId();

  const { data } = await axiosInstance.post<ApiResponse<unknown>>(
    "/home/products/recent",
    { productId },
    { params: { userId } },
  );

  if (!data.success) throw new Error(data.message);
};
