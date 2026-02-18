// 팔로잉/팔로워 목록 조회
import axiosInstance from "../../../axiosInstance";
import type { FollowListResultRaw, FollowListResult } from "./types";
import { parseFollowList } from "./parser";

type ApiResponse<T> = {
  code: number;
  message: string;
  timestamp: string;
  result: T;
  success: boolean;
};

export async function getMyFollowings(params?: {
  page?: number;
  size?: number;
}) {
  const res = await axiosInstance.get<ApiResponse<FollowListResultRaw>>(
    "/users/me/followings",
    { params },
  );

  if (!res.data.success)
    throw new Error(res.data.message ?? "팔로잉 조회 실패");

  const parsed: FollowListResult = parseFollowList(res.data.result);
  return { ...res.data, result: parsed };
}

export async function getMyFollowers(params?: {
  page?: number;
  size?: number;
}) {
  const res = await axiosInstance.get<ApiResponse<FollowListResultRaw>>(
    "/users/me/followers",
    { params },
  );

  if (!res.data.success)
    throw new Error(res.data.message ?? "팔로워 조회 실패");

  const parsed: FollowListResult = parseFollowList(res.data.result);
  return { ...res.data, result: parsed };
}
