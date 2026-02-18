// 게시글 댓글 작성 요청
export type CreateCommentBody = {
  content: string;

  // 대댓글이면 부모 댓글 ID, 최상위 댓글이면 null
  parentCommentId?: number | null;

  // UI에 "@USER_ID님에게 답글" 표시 대상 (없으면 null)
  replyToUserId?: string | null;

  // 실제 본문에서 @멘션한 사용자들 (없으면 빈 배열/undefined)
  mentions?: Array<{
    userId: string;
    startIndex: number;
    length: number;
  }>;
};

export type CreateCommentResult = {
  commentId: number;
  feedId?: number; // 서버가 주면 사용
  parentCommentId: number | null;
  content?: string; // 서버가 주면 사용
  createdAt: string;
};
