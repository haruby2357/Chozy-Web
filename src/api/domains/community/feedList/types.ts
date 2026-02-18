export type FeedTab = "RECOMMEND" | "FOLLOWING";
export type FeedContentType = "ALL" | "POST" | "REVIEW";

export type FeedKind = "ORIGINAL" | "QUOTE";
export type ReactionType = "LIKE" | "DISLIKE" | "NONE";

export type MediaContentType = "image/jpeg" | "image/png" | string;

export type FeedImage = {
  imageUrl: string;
  sortOrder: number;
  contentType: MediaContentType;
};

export type FeedUser = {
  name: string;
  userId: string;
  profileImageUrl: string | null;
};

export type FeedReview = {
  vendor: string;
  title: string;
  rating: number; // 0~5
  productUrl: string | null;
};

export type FeedQuote = {
  feedId: number;
  user: FeedUser;
  text: string;
  hashTags: string[];
};

export type FeedContents = {
  text: string;
  images: FeedImage[];

  // contentType=REVIEW일 때만 존재할 수 있음
  review?: FeedReview | null;

  // kind=QUOTE일 때만 존재할 수 있음
  quote?: FeedQuote | null;
};

export type FeedCounts = {
  viewCount: number;
  commentCount: number;
  likeCount: number;
  dislikeCount: number;
  quoteCount: number;
};

export type FeedMyState = {
  reactionType: ReactionType;
  bookmarked: boolean;
  reposted: boolean;
  following: boolean;
};

export type FeedItem = {
  feedId: number;
  kind: FeedKind;
  contentType: Exclude<FeedContentType, "ALL">; // 실제 응답은 POST/REVIEW
  mine: boolean;
  createdAt: string;

  user: FeedUser;
  contents: FeedContents;

  counts: FeedCounts;
  myState: FeedMyState;
};

export type FeedsResult = {
  feeds: FeedItem[];
  hasNext: boolean;
  nextCursor: string | null;
};

export type GetFeedsParams = {
  tab: FeedTab;
  contentType: FeedContentType;
  search?: string;

  // 명세에 “cursor 기반 페이징”만 있고 요청 파라미터명이 안 보이어서
  // 일단 cursor로 넣어둠(백엔드가 다른 이름이면 여기만 바꾸면 됨)
  cursor?: string;
};
