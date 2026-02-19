export type OtherProfileResult = {
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  statusMessage: string;

  birthDate: string | null;
  height: number | null;
  weight: number | null;

  reviewCount: number;
  followerCount: number;
  followingCount: number;

  accountPublic: boolean;
  birthPublic: boolean;
  heightPublic: boolean;
  weightPublic: boolean;
};
