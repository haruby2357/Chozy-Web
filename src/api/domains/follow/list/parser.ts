// 팔로잉/팔로워 목록 조회
import type {
  FollowListResultRaw,
  FollowListResult,
  FollowUserRaw,
  FollowUser,
} from "./types";

export function parseFollowUser(raw: FollowUserRaw): FollowUser {
  return {
    userPk: raw.userId,
    loginId: raw.loginId,
    nickname: raw.nickname,
    profileImg: raw.profileImageUrl ?? null,

    isAccountPublic: raw.isAccountPublic,

    myFollowStatus: raw.myFollowStatus,
    isFollowingByMe: raw.isFollowingByMe,
    isFollowingMe: raw.isFollowingMe,

    isBlocked: raw.isBlocked,
    isCloseFriend: raw.isCloseFriend,

    followedAt: raw.followedAt,
  };
}

export function parseFollowList(raw: FollowListResultRaw): FollowListResult {
  return {
    ...raw,
    items: (raw.items ?? []).map(parseFollowUser),
  };
}
