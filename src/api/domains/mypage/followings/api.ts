// 팔로잉 목록 요청
import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type { FollowingListResult } from "./types";

export type GetMyFollowingsParams = {
  page?: number; // default 0
  size?: number; // default 20
};

export async function getMyFollowings(params: GetMyFollowingsParams = {}) {
  const { page = 0, size = 20 } = params;

  const res = await axiosInstance.get<ApiResponse<FollowingListResult>>(
    "/users/me/followings",
    { params: { page, size } },
  );

  return res.data;
}
