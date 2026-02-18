import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";

type DeleteFeedResult = string;

export async function deleteFeed(feedId: number) {
  const res = await axiosInstance.delete<ApiResponse<DeleteFeedResult>>(
    `/community/feeds/${feedId}`,
  );
  return res.data;
}
