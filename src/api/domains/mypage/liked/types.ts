// 마이페이지 설정 - 좋아요 누른 게시글 목록 조회
export type Reaction = "LIKE" | "DISLIKE" | "NONE";

export type LikedFeedUser = {
  profileImageUrl: string | null;
  name: string;
  userId: string;
};

export type LikedFeedImage = {
  imageUrl: string;
  sortOrder: number;
  contentType: string;
};

export type LikedQuote = {
  feedId: number;
  user: LikedFeedUser;
  text: string;
  hashTags: string[];
};

export type LikedReview = {
  vendor: string;
  title: string;
  rating: number;
  productUrl: string;
};

export type LikedContents = {
  text: string;
  images: LikedFeedImage[];
  review?: LikedReview | null;
  quote?: LikedQuote | null;
};

export type LikedFeed = {
  feedId: number;
  kind: "ORIGINAL" | "REPOST" | "QUOTE";
  contentType: "POST" | "REVIEW";
  createdAt: string;

  user: LikedFeedUser;
  contents: LikedContents;

  counts: {
    viewCount: number;
    commentCount: number;
    likeCount: number;
    dislikeCount: number;
    quoteCount: number;
  };

  myState: {
    reactionType: Reaction;
    bookmarked: boolean;
    reposted: boolean;
    following: boolean;
  };

  likedAt: string;
};

export type LikedFeedsResult = {
  feeds: LikedFeed[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};
