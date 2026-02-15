import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import DetailHeader from "../../components/DetailHeader";
import CommentRow from "./components/CommentRow";
import CommentInput from "./components/CommentInput";

import FeedHeader from "./components/FeedHeader";
import FeedBody from "./components/FeedBody";
import FeedActions from "./components/FeedActions";

import etc from "../../assets/community/etc.svg";
import comment from "../../assets/community/comment.svg";
import quotation from "../../assets/community/quotation.svg";
import goodOn from "../../assets/community/good-on.svg";
import goodOff from "../../assets/community/good-off.svg";
import badOn from "../../assets/community/bad-on.svg";
import badOff from "../../assets/community/bad-off.svg";
import bookmarkOn from "../../assets/community/bookmark-on.svg";
import bookmarkOff from "../../assets/community/bookmark-off.svg";
import share from "../../assets/community/repost.svg";
import toastmsg from "../../assets/community/toastmsg.svg";

import { mapApiResultToUi } from "./api/feedDetail.mapper";
import type {
  ApiFeedDetailResult,
  ApiResponse,
  BookmarkToggleResult,
  CommentItem,
  CommentLikeToggleResult,
  FeedDetailResult,
  FeedUser,
  LikeToggleResult,
  ReplyTarget,
  Reaction,
  ToastState,
} from "./types";

function formatKoreanDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${yyyy}년 ${mm}월 ${dd}일 ${hh}:${min}`;
}

export default function PostDetail() {
  const { feedId } = useParams();

  const [detail, setDetail] = useState<FeedDetailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(false);

  const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  // 작성일/조회수 (명세 기반)
  const [createdAt, setCreatedAt] = useState<string>("");
  const [viewCount, setViewCount] = useState<number>(0);

  const showToast = (text: string, icon?: string) => {
    setToast({ text, icon });
    window.setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (!feedId) return;

    const run = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/community/feeds/${feedId}/detail`);
        const data: ApiResponse<ApiFeedDetailResult> = await res.json();
        console.log("detail raw:", data);
        console.log("result keys:", Object.keys(data?.result ?? {}));

        if (data.code === 1000) {
          const ui = mapApiResultToUi(data.result);

          setDetail(ui);
          setComments(ui.comments ?? []);

          setIsFollowing(data.result.feed.myState.isFollowing);
          setCreatedAt(formatKoreanDateTime(data.result.feed.createdAt));
          setViewCount(data.result.feed.counts.viewCount);
        } else {
          setDetail(null);
          setComments([]);
        }
      } catch {
        setDetail(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [feedId]);

  useEffect(() => {
    if (!shouldScrollRef.current) return;

    shouldScrollRef.current = false;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [comments]);

  const feed = detail?.feed;

  if (loading) {
    return (
      <>
        <DetailHeader title="게시글" />
        <div className="pt-[48px] px-4 py-6 bg-white min-h-screen">
          로딩중...
        </div>
      </>
    );
  }

  if (!feed) {
    return (
      <>
        <DetailHeader title="게시글" />
        <div className="pt-[48px] px-4 py-6 bg-white min-h-screen">
          데이터가 없어요.
        </div>
      </>
    );
  }

  /** ---------------------------
   * 댓글/대댓글 로컬 추가 유틸
   * -------------------------- */
  const addChildReply = (
    list: CommentItem[],
    parentId: number,
    child: CommentItem,
  ): CommentItem[] => {
    return list.map((c) => {
      if (c.commentId === parentId) {
        const nextChildren = [...(c.comment ?? []), child];
        return {
          ...c,
          comment: nextChildren,
          counts: { ...c.counts, comments: (c.counts.comments ?? 0) + 1 },
        };
      }
      if (c.comment && c.comment.length > 0) {
        return { ...c, comment: addChildReply(c.comment, parentId, child) };
      }
      return c;
    });
  };

  const handleAddComment = (text: string) => {
    const me: FeedUser = {
      profileImg: feed.user.profileImg,
      userName: feed.user.userName,
      userId: feed.user.userId,
    };

    const newItem: CommentItem = {
      commentId: Date.now(),
      user: me,
      quote: replyTarget?.loginId ?? "",
      content: text,
      createdAt: new Date().toISOString(),
      mentions: [],
      replyTo: null,
      counts: { comments: 0, likes: 0, dislikes: 0, quotes: 0 },
      myState: { reaction: "NONE", isbookmarked: false, isreposted: false },
      comment: [],
    };

    if (replyTarget) {
      setComments((prev) =>
        addChildReply(prev, replyTarget.parentCommentId, newItem),
      );
      setReplyTarget(null);
      return;
    }

    shouldScrollRef.current = true;
    setComments((prev) => [...prev, newItem]);
  };

  const inputPlaceholder = replyTarget
    ? `@${replyTarget.loginId}님에게 답글 남기기`
    : "게시글에 댓글 남기기";

  const focusInput = () =>
    requestAnimationFrame(() => commentInputRef.current?.focus());

  const handleClickPostComment = () => {
    setReplyTarget(null);
    focusInput();
  };

  /** ---------------------------
   * 팔로우 토글
   * -------------------------- */
  type FollowStatus = "FOLLOWING" | "NONE";
  type FollowResponse = { targetUserId: string; followStatus: FollowStatus };

  const handleToggleFollow = async () => {
    const targetUserId = feed.user.userId;

    try {
      const method = isFollowing ? "DELETE" : "POST";

      const res = await fetch(`/users/me/followings/${targetUserId}`, {
        method,
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("toggle follow failed");

      const data: FollowResponse = await res.json();

      const nextIsFollowing = data.followStatus === "FOLLOWING";
      setIsFollowing(nextIsFollowing);

      showToast(
        nextIsFollowing
          ? `@${feed.user.userId} 님을 팔로우했어요.`
          : "팔로우를 취소했어요.",
        nextIsFollowing ? toastmsg : undefined,
      );
    } catch {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  /** ---------------------------
   * 게시글 좋아요/싫어요
   * -------------------------- */
  const handleToggleReaction = async (like: boolean) => {
    if (!feedId || !detail) return;

    try {
      const res = await fetch(`/community/feeds/${feedId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ like }),
      });
      if (!res.ok) throw new Error("toggle reaction failed");

      const data: ApiResponse<LikeToggleResult> = await res.json();
      if (data.code !== 1000) throw new Error(data.message);

      setDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          feed: {
            ...prev.feed,
            counts: {
              ...prev.feed.counts,
              likes: data.result.counts.likes,
              dislikes: data.result.counts.dislikes,
            },
            myState: { ...prev.feed.myState, reaction: data.result.reaction },
          },
        };
      });
    } catch {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  /** ---------------------------
   * 댓글 좋아요/싫어요
   * -------------------------- */
  const updateCommentReaction = (
    list: CommentItem[],
    commentId: number,
    patch: { reaction: Reaction; likes: number; dislikes: number },
  ): CommentItem[] => {
    return list.map((c) => {
      if (c.commentId === commentId) {
        return {
          ...c,
          counts: { ...c.counts, likes: patch.likes, dislikes: patch.dislikes },
          myState: { ...c.myState, reaction: patch.reaction },
        };
      }
      if (c.comment && c.comment.length > 0) {
        return {
          ...c,
          comment: updateCommentReaction(c.comment, commentId, patch),
        };
      }
      return c;
    });
  };

  const handleToggleCommentReaction = async (
    commentId: number,
    like: boolean,
  ) => {
    try {
      const res = await fetch(`/community/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ like }),
      });
      if (!res.ok) throw new Error("toggle comment reaction failed");

      const data: ApiResponse<CommentLikeToggleResult> = await res.json();
      if (data.code !== 1000) throw new Error(data.message);

      setComments((prev) =>
        updateCommentReaction(prev, commentId, {
          reaction: data.result.reaction,
          likes: data.result.counts.likes,
          dislikes: data.result.counts.dislikes,
        }),
      );
    } catch {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  /** ---------------------------
   * 북마크 토글
   * -------------------------- */
  const handleToggleBookmark = async () => {
    if (!feedId || !detail) return;

    const current = detail.feed.myState.isbookmarked;
    const nextValue = !current;

    try {
      const res = await fetch(`/community/feeds/${feedId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmark: nextValue }),
      });
      if (!res.ok) throw new Error("toggle bookmark failed");

      const data: ApiResponse<BookmarkToggleResult> = await res.json();
      if (data.code !== 1000) throw new Error(data.message);

      setDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          feed: {
            ...prev.feed,
            myState: {
              ...prev.feed.myState,
              isbookmarked: data.result.isBookmarked,
            },
          },
        };
      });
    } catch {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <DetailHeader title="게시글" />

      <div className="flex-1 min-h-0 scroll-available overflow-y-auto scrollbar-hide pb-15">
        <div className="bg-white">
          <FeedHeader
            user={feed.user}
            isFollowing={isFollowing}
            onToggleFollow={handleToggleFollow}
            etcIcon={etc}
          />

          <FeedBody feed={feed} />

          <FeedActions
            counts={feed.counts}
            myState={feed.myState}
            createdAtText={createdAt}
            viewCount={viewCount}
            commentIcon={comment}
            quotationIcon={quotation}
            goodOnIcon={goodOn}
            goodOffIcon={goodOff}
            badOnIcon={badOn}
            badOffIcon={badOff}
            bookmarkOnIcon={bookmarkOn}
            bookmarkOffIcon={bookmarkOff}
            shareIcon={share}
            onToggleLike={() => handleToggleReaction(true)}
            onToggleDislike={() => handleToggleReaction(false)}
            onToggleBookmark={handleToggleBookmark}
            onClickComment={handleClickPostComment}
          />
        </div>

        {/* 댓글 영역 */}
        <div
          className={
            comments.length === 0
              ? "px-3 py-1 min-h-[200px] flex items-center justify-center bg-[#f9f9f9]"
              : "px-3 py-1 min-h-[200px] bg-[#f9f9f9]"
          }
        >
          {comments.length === 0 ? (
            <div className="text-[14px] text-[#B5B5B5]">
              가장 먼저 댓글을 달 수 있는 기회에요!
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {comments.map((c) => (
                <CommentRow
                  key={c.commentId}
                  item={c}
                  onToggleReaction={(commentId, like) =>
                    handleToggleCommentReaction(commentId, like)
                  }
                  onReplyClick={(loginId, parentCommentId, showBar) => {
                    setReplyTarget({ loginId, parentCommentId, showBar });
                    focusInput();
                  }}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-[84px] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[390px]">
          <div className="h-12 rounded-[4px] bg-[#787878] px-4 flex items-center gap-[10px]">
            {toast.icon && (
              <img src={toast.icon} alt="" className="w-5 h-5 shrink-0" />
            )}
            <span className="text-[16px] text-white">{toast.text}</span>
          </div>
        </div>
      )}

      <CommentInput
        profileImg={feed.user.profileImg}
        onSubmit={handleAddComment}
        replyTo={replyTarget?.showBar ? replyTarget.loginId : null}
        onClearReply={() => setReplyTarget(null)}
        placeholderText={inputPlaceholder}
        inputRef={commentInputRef}
      />
    </div>
  );
}
