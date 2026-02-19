import axiosInstance from "../../../../axiosInstance";
import type { ApiResponse } from "../../../favorite";
import type { MuteResult } from "./types";

export async function muteUser(targetUserId: number, userId?: number) {
  const res = await axiosInstance.post<ApiResponse<MuteResult>>(
    `/users/me/mutes/${targetUserId}`,
    null,
    userId ? { params: { userId } } : undefined,
  );
  return res.data;
}
