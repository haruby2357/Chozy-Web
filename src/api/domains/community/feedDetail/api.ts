import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type { ApiFeedDetailResult } from "./types";

export async function getFeedDetail(feedId: number) {
  const res = await axiosInstance.get<ApiResponse<ApiFeedDetailResult>>(
    `/community/feeds/${feedId}/detail`,
  );
  return res.data;
}
