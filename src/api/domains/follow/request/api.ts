import axiosInstance from "../../../axiosInstance";
import type {
  FollowRequestPage,
  FollowRequestProcessBody,
  FollowRequestProcessResult,
  FollowRequestProcessStatus,
} from "./types";
import type { ApiResponse } from "../../favorite";

// 팔로우 요청 목록 조회
export async function getMyFollowRequests(params?: {
  page?: number;
  size?: number;
}) {
  const res = await axiosInstance.get<ApiResponse<FollowRequestPage>>(
    "/users/me/follow-requests",
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
      },
    },
  );

  return res.data;
}

// 팔로우 요청 처리
export async function processFollowRequest(
  requestId: number,
  status: FollowRequestProcessStatus,
) {
  const body: FollowRequestProcessBody = { status };

  const res = await axiosInstance.patch<
    ApiResponse<FollowRequestProcessResult>
  >(`/users/follow-requests/${requestId}`, body);

  return res.data;
}
