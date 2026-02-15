export type Reaction = "LIKE" | "DISLIKE" | "NONE";

/** =========================
 *  UI에서 사용하는 타입
 *  ========================= */
export type FeedUser = {
  profileImg: string;
  userName: string;
  userId: string;
};

export type FeedCounts = {
  comments: number;
  likes: number;
  dislikes: number;
  quotes: number;
};

export type FeedMyState = {
  reaction: Reaction;
  isbookmarked: boolean;
  isreposted: boolean;
};

export type PostContentDetail = {
  text: string;
  contentImgs: string[];
  hashTags: string[];
};

export type ReviewContentDetail = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs: string[];
  hashTags: string[];
};

export type FeedDetail =
  | {
      feedId: number;
      type: "POST";
      user: FeedUser;
      content: PostContentDetail;
      counts: FeedCounts;
      myState: FeedMyState;
    }
  | {
      feedId: number;
      type: "REVIEW";
      user: FeedUser;
      content: ReviewContentDetail;
      counts: FeedCounts;
      myState: FeedMyState;
    };

export type Mention = {
  userId: string;
  name: string;
  startIndex: number; // UTF-16
  length: number; // UTF-16
};

export type ReplyTo = null | { userId: string; name: string };

export type CommentItem = {
  commentId: number;
  user: FeedUser;

  quote: string;

  content: string;
  mentions: Mention[];
  replyTo: ReplyTo;

  counts: FeedCounts;
  myState: FeedMyState;
  createdAt: string;

  comment?: CommentItem[];
};

export type FeedDetailResult = {
  feed: FeedDetail;
  comments: CommentItem[];
};

export type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

export type ToastState = { text: string; icon?: string } | null;

/** =========================
 *  서버 명세 타입
 *  ========================= */
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

export type ApiFeedContents = {
  vendor?: string;
  productUrl?: string;
  title?: string;
  rating?: number;
  content: string;
  feedImages?: ApiFeedImage[];
  hashTags?: string[];
};

export type ApiFeed = {
  feedId: number;
  kind: "ORIGINAL" | "REPOST" | "QUOTE";
  contentType: "REVIEW" | "POST";
  isMine: boolean;
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
    isBookmarked: boolean;
    isReposted: boolean;
    isFollowing: boolean;
  };
};

export type ApiMention = {
  userId: string;
  name: string;
  startIndex: number;
  length: number;
};

export type ApiReplyTo = null | {
  userId: string;
  name: string;
};

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

// 결과 타입
export type LikeToggleResult = {
  feedId: number;
  reaction: Reaction;
  counts: {
    likes: number;
    dislikes: number;
  };
};

export type CommentLikeToggleResult = {
  commentId: number;
  reaction: Reaction;
  counts: { likes: number; dislikes: number };
};

export type BookmarkToggleResult = {
  feedId: number;
  isBookmarked: boolean;
};

export type ReplyTarget = null | {
  parentCommentId: number;
  loginId: string;
  showBar: boolean;
};
