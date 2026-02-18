export type Reaction = "LIKE" | "DISLIKE" | "NONE";

// 피드 좋아요/싫어요 토글 결과
export type LikeToggleResult = {
  feedId: number;
  reaction: Reaction;
  counts: {
    likeCount: number;
    dislikeCount: number;
  };
};

// 북마크 토글 결과
export type BookmarkToggleResult = {
  feedId: number;
  isbookmarked: boolean;
};

// 댓글 좋아요/싫어요 토글 결과
export type CommentLikeToggleResult = {
  commentId: number;
  reaction: Reaction;
  counts: {
    likeCount: number;
    dislikeCount: number;
  };
};
