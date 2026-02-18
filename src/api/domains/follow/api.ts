import axiosInstance from "../../axiosInstance";
import type { ApiResponse } from "../../client/types";
import type { FollowResponse, UnfollowResponse } from "./types";

export async function followUser(targetUserId: number) {
  const res = await axiosInstance.post<ApiResponse<FollowResponse>>(
    `/users/me/followings/${targetUserId}`,
  );
  return res.data;
}

export async function unfollowUser(targetUserId: number) {
  const res = await axiosInstance.delete<ApiResponse<UnfollowResponse>>(
    `/users/me/followings/${targetUserId}`,
  );
  return res.data;
}
