// 팔로잉/팔로워 목록 조회
export type FollowStatus = "FOLLOWING" | "NOT_FOLLOWING" | "REQUESTED" | string;

export type FollowUserRaw = {
  userId: number;
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  isAccountPublic: boolean;

  myFollowStatus: FollowStatus;
  isFollowingByMe: boolean;
  isFollowingMe: boolean;

  isBlocked: boolean;
  isCloseFriend: boolean;

  followedAt: string; // ISO
};

export type FollowListResultRaw = {
  items: FollowUserRaw[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type FollowUser = {
  userPk: number;
  loginId: string;
  nickname: string;
  profileImg: string | null;

  isAccountPublic: boolean;

  myFollowStatus: FollowStatus;
  isFollowingByMe: boolean;
  isFollowingMe: boolean;

  isBlocked: boolean;
  isCloseFriend: boolean;

  followedAt: string;
};

export type FollowListResult = Omit<FollowListResultRaw, "items"> & {
  items: FollowUser[];
};
