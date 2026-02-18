import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";
import type {
  LikeToggleResult,
  BookmarkToggleResult,
  CommentLikeToggleResult,
  PostRequest,
  PostCreateResult,
  ReviewRequest,
  ReviewCreateResult,
  RepostCreateResult,
  RepostDeleteResult,
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

// 사담 작성
export async function createPost(userId: number, postData: PostRequest) {
  const res = await axiosInstance.post<ApiResponse<PostCreateResult>>(
    `/community/feeds/post?userId=${userId}`,
    postData,
  );
  return res.data;
}

// 리뷰 작성
export async function createReview(userId: number, reviewData: ReviewRequest) {
  const res = await axiosInstance.post<ApiResponse<ReviewCreateResult>>(
    `/community/feeds/review?userId=${userId}`,
    reviewData,
  );
  return res.data;
}

// 리포스트 생성
export async function createRepost(feedId: number) {
  const res = await axiosInstance.post<ApiResponse<RepostCreateResult>>(
    `/community/feeds/${feedId}/repost`,
  );
  return res.data;
}

// 리포스트 취소
export async function deleteRepost(feedId: number) {
  const res = await axiosInstance.delete<ApiResponse<RepostDeleteResult>>(
    `/community/feeds/${feedId}/repost`,
  );
  return res.data;
}
