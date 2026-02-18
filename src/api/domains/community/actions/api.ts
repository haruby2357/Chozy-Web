import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type {
  LikeToggleResult,
  BookmarkToggleResult,
  CommentLikeToggleResult,
} from "./types";

// 피드 좋아요/싫어요 토글
export async function toggleFeedReaction(feedId: number, like: boolean) {
  const res = await axiosInstance.post<ApiResponse<LikeToggleResult>>(
    `/community/feeds/${feedId}/reactions`,
    { like },
  );
  return res.data;
}

// 피드 북마크 토글
export async function toggleFeedBookmark(feedId: number, bookmark: boolean) {
  const res = await axiosInstance.post<ApiResponse<BookmarkToggleResult>>(
    `/community/feeds/${feedId}/bookmarks`,
    { bookmark },
  );
  return res.data;
}

// 댓글 좋아요/싫어요 토글
export async function toggleCommentReaction(commentId: number, like: boolean) {
  const res = await axiosInstance.post<ApiResponse<CommentLikeToggleResult>>(
    `/community/comments/${commentId}/reactions`,
    { like },
  );
  return res.data;
}
