import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type { ApiPopularKeyword } from "./types";

export async function getPopularKeywords() {
  const res = await axiosInstance.get<ApiResponse<ApiPopularKeyword[]>>(
    "/home/searches/popular",
  );
  return res.data;
}
