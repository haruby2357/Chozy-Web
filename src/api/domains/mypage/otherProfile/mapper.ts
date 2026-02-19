import type { OtherProfileResult } from "./types";

export type OtherProfileUi = {
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;

  backgroundImageUrl: string | null;

  statusMessage: string;

  // 공개여부
  isAccountPublic: boolean;
  isBirthPublic: boolean;
  isHeightPublic: boolean;
  isWeightPublic: boolean;

  // 값
  birthDate: string;
  heightCm: number;
  weightKg: number;

  // 카운트
  reviewCount: number;
  followerCount: number;
  followingCount: number;
};

export function toUiOtherProfile(r: OtherProfileResult): OtherProfileUi {
  return {
    loginId: r.loginId,
    nickname: r.nickname,
    profileImageUrl: r.profileImageUrl ?? null,
    backgroundImageUrl: null,

    statusMessage: r.statusMessage ?? "",

    isAccountPublic: !!r.accountPublic,
    isBirthPublic: !!r.birthPublic,
    isHeightPublic: !!r.heightPublic,
    isWeightPublic: !!r.weightPublic,

    birthDate: r.birthDate ?? "",
    heightCm: r.height ?? 0,
    weightKg: r.weight ?? 0,

    reviewCount: r.reviewCount ?? 0,
    followerCount: r.followerCount ?? 0,
    followingCount: r.followingCount ?? 0,
  };
}
