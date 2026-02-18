// 커뮤니티 게시글 상세 조회

/** =========================
 *  서버 명세 타입
 *  ========================= */
export type Reaction = "LIKE" | "DISLIKE" | "NONE";

export type ApiFeedUser = {
  profileImageUrl: string | null;
  name: string;
  userId: string;
};

export type ApiFeedImage = {
  imageUrl: string;
  sortOrder: number;
  contentType: string;
};

export type ApiFeedQuote = {
  feedId: number;
  user: ApiFeedUser;
  text: string;
  hashTags: string[];
};

export type ApiFeedContents = {
  // REVIEW일 때
  vendor?: string;
  productUrl?: string;
  title?: string;
  rating?: number;

  content: string;
  feedImages?: ApiFeedImage[];
  hashTags?: string[];

  quote?: ApiFeedQuote | null;
};

export type ApiFeed = {
  feedId: number;
  kind: "ORIGINAL" | "REPOST" | "QUOTE";
  contentType: "REVIEW" | "POST";

  isMine?: boolean;
  mine?: boolean;

  createdAt: string;

  user: ApiFeedUser;
  contents: ApiFeedContents;

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
};

export type ApiMention = {
  userId: string;
  name: string;
  startIndex: number;
  length: number;
};

export type ApiReplyTo = null | { userId: string; name: string };

export type ApiComment = {
  commentId: number;
  parentCommentId: number | null;
  depth: number;

  isMine: boolean;
  user: ApiFeedUser;

  content: string;

  replyTo: ApiReplyTo;
  mentions: ApiMention[];

  counts: {
    likeCount: number;
    dislikeCount: number;
    replyCount: number;
  };

  myState: {
    reactionType: Reaction;
  };

  status: "ACTIVE" | "DELETED";
  createdAt: string;
  updatedAt: string;

  replies: ApiComment[];
  hasMoreReplies?: boolean;
  nextRepliesCursor?: string | null;
};

export type ApiFeedDetailResult = {
  feed: ApiFeed;
  comments: ApiComment[];
};

/** =========================
 *  UI에서 사용하는 타입
 *  ========================= */
export type UiFeedUser = {
  profileImg: string | null;
  userName: string;
  userId: string;
};

export type UiFeedCounts = {
  comments: number;
  likes: number;
  dislikes: number;
  quotes: number;
  views: number;
};

export type UiFeedMyState = {
  reaction: Reaction;
  isbookmarked: boolean;
  isreposted: boolean;
  isfollowing?: boolean;
};

export type UiPostContentDetail = {
  text: string;
  contentImgs: string[];
  hashTags: string[];
  quote?: UiQuote;
};

export type UiReviewContentDetail = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs: string[];
  productUrl?: string | null;
  hashTags: string[];
  quote?: UiQuote;
};

export type UiQuote = {
  feedId: number;
  user: {
    profileImg: string;
    userName: string;
    userId: string;
  };
  text?: string;
  vendor?: string;
  title?: string;
  rating?: number;
  productUrl?: string | null;
  contentImgs?: string[];
};

export type UiFeedDetail =
  | {
      feedId: number;
      type: "POST" | "QUOTE" | "REPOST";
      createdAt: string;
      isMine: boolean;

      user: UiFeedUser;
      content: UiPostContentDetail;

      counts: UiFeedCounts;
      myState: UiFeedMyState;
    }
  | {
      feedId: number;
      type: "REVIEW";
      createdAt: string;
      isMine: boolean;

      user: UiFeedUser;
      content: UiReviewContentDetail;

      counts: UiFeedCounts;
      myState: UiFeedMyState;
    };

export type UiMention = ApiMention;
export type UiReplyTo = ApiReplyTo;

export type UiCommentItem = {
  commentId: number;
  user: UiFeedUser;

  // UI에서 “@누구에게 답글” 표시용
  quote: string;

  content: string;
  mentions: UiMention[];
  replyTo: UiReplyTo;

  counts: {
    comments: number;
    likes: number;
    dislikes: number;
    quotes: number;
  };

  myState: {
    reaction: Reaction;
    isbookmarked: boolean;
    isreposted: boolean;
  };

  createdAt: string;

  comment?: UiCommentItem[];
};

export type UiFeedDetailResult = {
  feed: UiFeedDetail;
  comments: UiCommentItem[];
};
