// 프로필 조회
export type MyProfile = {
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
  statusMessage: string;
  isAccountPublic: boolean;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  isBirthPublic: boolean;
  isHeightPublic: boolean;
  isWeightPublic: boolean;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  bookmarkCount: number;
};

// 내 후기 & 북마크 목록 조회
export type MyPageFeedItem = {
  feedId: number;
  kind: "ORIGINAL" | "QUOTE";
  contentType: "POST" | "REVIEW";
  createdAt: string;

  user: {
    userId: string;
    name: string;
    profileImageUrl: string | null;
  };

  contents: {
    text: string | null;
    images: { imageUrl: string; sortOrder?: number; contentType?: string }[];
    review: {
      vendor: string;
      title: string;
      rating: number;
      productUrl: string | null;
    } | null;
    quote: any | null;
  };

  counts: {
    viewCount: number;
    commentCount: number;
    likeCount: number;
    dislikeCount: number;
    quoteCount: number;
  };

  myState: {
    reactionType: "LIKE" | "DISLIKE" | "NONE";
    isBookmarked: boolean;
    isReposted: boolean;
  };

  // 북마크 탭에서만 내려올 수 있음
  bookmarkedAt?: string;
};

export type MyPageFeedsResult = {
  feeds: MyPageFeedItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};
