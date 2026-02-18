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

// 사담 작성 요청 데이터
export type PostRequest = {
  content: string;
  hashTags: string[]; // JSON string 형태
  img: { fileName: string; contentType: string }[] | null;
};

// 사담 작성 결과 (응답의 result 필드)
export type PostCreateResult = {
  feedId: number;
};
