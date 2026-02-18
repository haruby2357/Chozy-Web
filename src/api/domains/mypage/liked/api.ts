// 마이페이지 설정 - 좋아요 누른 게시글 목록 조회
import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type { LikedFeedsResult } from "./types";

export type LikedFeedsQuery = {
  page?: number; // default 0
  size?: number; // default 20
  sort?: "latest" | string; // default latest
};

export async function getLikedFeeds(query: LikedFeedsQuery = {}) {
  const { page = 0, size = 20, sort = "latest" } = query;

  const res = await axiosInstance.get<ApiResponse<LikedFeedsResult>>(
    `/me/feeds/liked`,
    { params: { page, size, sort } },
  );

  return res.data;
}
