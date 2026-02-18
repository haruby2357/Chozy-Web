// 팔로잉 목록 요청
export type FollowStatus = "FOLLOWING" | "REQUESTED" | "NONE";

export type FollowingItem = {
  userId: number;
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  isAccountPublic: boolean;

  myFollowStatus?: FollowStatus;

  isFollowedByMe: boolean;
  isFollowingMe: boolean;

  isBlocked: boolean;
  isCloseFriend: boolean;

  followedAt: string;
};

export type FollowingListResult = {
  items: FollowingItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};
