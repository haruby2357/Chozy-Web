import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type { FeedsResult, GetFeedsParams } from "./types";

export async function getFeeds(params: GetFeedsParams) {
  const res = await axiosInstance.get<ApiResponse<FeedsResult>>(
    "/community/feeds",
    { params },
  );
  return res.data;
}
