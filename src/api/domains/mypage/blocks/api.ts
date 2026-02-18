import axiosInstance from "../../../axiosInstance";
import type { BlockedAccountsResult, UnblockResult } from "./types";
import type { ApiResponse } from "../../../client/types";

type GetBlockedAccountsParams = {
  page?: number; // default 0
  size?: number; // default 20
};

// 마이페이지 차단한 계정 목록 조회
export async function getBlockedAccounts(
  params: GetBlockedAccountsParams = {},
) {
  const { page = 0, size = 20 } = params;

  const res = await axiosInstance.get<ApiResponse<BlockedAccountsResult>>(
    "/users/me/blocks",
    { params: { page, size } },
  );

  return res.data;
}

// 마이페이지 차단 해제
export async function unblockUser(targetUserId: number) {
  const res = await axiosInstance.delete<ApiResponse<UnblockResult>>(
    `/users/me/blocks/${targetUserId}`,
  );

  return res.data;
}
