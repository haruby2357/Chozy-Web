import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type { CreateCommentBody, CreateCommentResult } from "./types";

export async function createFeedComment(
  feedId: number,
  body: CreateCommentBody,
) {
  const res = await axiosInstance.post<ApiResponse<CreateCommentResult>>(
    `/community/feeds/${feedId}/comments`,
    body,
  );
  return res.data;
}
