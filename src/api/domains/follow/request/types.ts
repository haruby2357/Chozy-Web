// 팔로우 요청 목록 조회
export type FollowRequestFromUser = {
  userId: number;
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
};

export type FollowRequestItem = {
  requestId: number;
  fromUser: FollowRequestFromUser;
  requestedAt: string;
};

export type FollowRequestPage = {
  items: FollowRequestItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type FollowRequestProcessStatus = "ACCEPT" | "REJECT";

export type FollowRequestProcessBody = {
  status: FollowRequestProcessStatus;
};

export type FollowRequestProcessResult = {
  requestId: number;
  status: string;
  processedAt: string;
  fromUserId: number;
  toUserId: number;
};
