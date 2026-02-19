import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type { OtherProfileResult } from "./types";

export async function getOtherProfile(targetUserId: number) {
  const res = await axiosInstance.get<ApiResponse<OtherProfileResult>>(
    `/users/${targetUserId}/profile`,
  );
  return res.data;
}
