import axiosInstance from "../../axiosInstance";
import type { ApiResponse } from "../../client/types";
import type {
  MyProfile,
  MyPageFeedsResult,
  UpdateProfileRequest,
} from "./types";

// 프로필 조회
export async function getMyProfile() {
  const res = await axiosInstance.get<ApiResponse<MyProfile>>("/me/profile");
  return res.data;
}

// 내 후기 목록 조회
type GetMyFeedsParams = {
  page?: number; // default 0
  size?: number; // default 20
  sort?: "latest"; // default latest
};

export async function getMyFeeds(params: GetMyFeedsParams = {}) {
  const { page = 0, size = 20, sort = "latest" } = params;

  const res = await axiosInstance.get<ApiResponse<MyPageFeedsResult>>(
    "/me/feeds",
    { params: { page, size, sort } },
  );

  return res.data;
}

// 내 북마크 목록 조회
type GetMyBookmarksParams = {
  page?: number;
  size?: number;
};

export async function getMyBookmarks(params: GetMyBookmarksParams = {}) {
  const { page = 0, size = 20 } = params;

  const res = await axiosInstance.get<ApiResponse<MyPageFeedsResult>>(
    "/me/bookmarks",
    { params: { page, size } },
  );

  return res.data;
}

// 프로필 수정
export async function updateProfile(data: UpdateProfileRequest) {
  const res = await axiosInstance.patch<ApiResponse<MyProfile>>(
    "/me/profile",
    data,
  );
  return res.data;
}
