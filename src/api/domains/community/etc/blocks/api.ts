import axiosInstance from "../../../../axiosInstance";
import type { ApiResponse } from "../../../../client/types";
import type { BlockUserResult } from "./types";

// 사용자 차단
export async function blockUser(targetUserId: number) {
  const res = await axiosInstance.post<ApiResponse<BlockUserResult>>(
    `/users/me/blocks/${targetUserId}`,
  );
  return res.data;
}
