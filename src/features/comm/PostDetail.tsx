import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import DetailHeader from "../../components/DetailHeader";
import CommentRow from "./components/CommentRow";
import CommentInput from "./components/CommentInput";

import FeedHeader from "./components/FeedHeader";
import FeedBody from "./components/FeedBody";
import FeedActions from "./components/FeedActions";
import FeedQuoteSheet from "./components/FeedQuoteSheet";

import etc from "../../assets/community/etc.svg";
import comment from "../../assets/community/comment.svg";
import quotation from "../../assets/community/quotation.svg";
import completeRepost from "../../assets/community/completeRepost.svg";
import goodOn from "../../assets/community/good-on.svg";
import goodOff from "../../assets/community/good-off.svg";
import badOn from "../../assets/community/bad-on.svg";
import badOff from "../../assets/community/bad-off.svg";
import bookmarkOn from "../../assets/community/bookmark-on.svg";
import bookmarkOff from "../../assets/community/bookmark-off.svg";
import share from "../../assets/community/repost.svg";
import toastmsg from "../../assets/community/toastmsg.svg";
import dummyProfile from "../../assets/all/dummyProfile.svg";

import {
  getFeedDetail,
  mapApiResultToUi,
  pickIsMine,
  type UiFeedDetailResult,
  type UiCommentItem,
  type Reaction,
} from "../../api/domains/community/feedDetail";
import {
  toggleFeedReaction,
  toggleFeedBookmark,
  toggleCommentReaction,
} from "../../api/domains/community/actions/api";

import { followUser, unfollowUser } from "../../api/domains/follow";
import { createFeedComment } from "../../api/domains/community/comments/api";

type ToastState = { text: string; icon?: string } | null;

type ReplyTarget = null | {
  parentCommentId: number;
  loginId: string;
  showBar: boolean;
};

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
  const navigate = useNavigate();
  const { feedId } = useParams();

  const numericFeedId = Number(feedId);

  const [detail, setDetail] = useState<UiFeedDetailResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState<UiCommentItem[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMine, setIsMine] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);

  // 작성일/조회수
  const [createdAtText, setCreatedAtText] = useState("");
  const [viewCount, setViewCount] = useState(0);

  // 인용 바텀시트
  const [quoteSheetOpen, setQuoteSheetOpen] = useState(false);

  // 댓글 입력
  const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  // 새 댓글 추가 시 아래로 스크롤
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(false);

  const showToast = (text: string, icon?: string) => {
    setToast({ text, icon });
    window.setTimeout(() => setToast(null), 2000);
  };

  const focusInput = () =>
    requestAnimationFrame(() => commentInputRef.current?.focus());

  // ------------------------------
  //  상세 조회
  // ------------------------------
  const fetchDetail = async () => {
    if (!feedId || Number.isNaN(numericFeedId)) return;

    setLoading(true);
    try {
      const data = await getFeedDetail(numericFeedId);

      if (data.code !== 1000) {
        setDetail(null);
        setComments([]);
        return;
      }

      const ui = mapApiResultToUi(data.result);
      setDetail(ui);
      setComments(ui.comments ?? []);

      const rawState = data.result.feed.myState as any;

      const serverFollowing =
        rawState?.following ??
        rawState?.isFollowing ??
        rawState?.isfollowing ??
        rawState?.followed ?? // 혹시 이런 이름이면
        false;

      setIsFollowing(!!serverFollowing);

      setCreatedAtText(formatKoreanDateTime(data.result.feed.createdAt));
      setViewCount(data.result.feed.counts?.viewCount ?? 0);
      setIsMine(pickIsMine(data.result.feed));
    } catch (e) {
      console.error(e);
      setDetail(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [feedId, numericFeedId]);

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

  // ------------------------------
  //  댓글/대댓글 로컬 추가 유틸
  // ------------------------------
  const addChildReply = (
    list: UiCommentItem[],
    parentId: number,
    child: UiCommentItem,
  ): UiCommentItem[] => {
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

  const handleAddComment = async (text: string) => {
    if (!text.trim()) return;

    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    try {
      const body = {
        content: text,
        parentCommentId: replyTarget ? replyTarget.parentCommentId : null,
        replyToUserId: replyTarget ? replyTarget.loginId : null,
        mentions: [],
      };

      const data = await createFeedComment(numericFeedId, body);

      if (data.code !== 1000) {
        throw new Error(data.message ?? "댓글 작성 실패");
      }

      setReplyTarget(null);
      shouldScrollRef.current = true;

      await fetchDetail();
    } catch (e) {
      console.error(e);
      showToast("댓글 작성에 실패했어요.");
    }
  };

  const inputPlaceholder = replyTarget
    ? `@${replyTarget.loginId}님에게 답글 남기기`
    : "게시글에 댓글 남기기";

  const handleClickPostComment = () => {
    setReplyTarget(null);
    focusInput();
  };

  // ------------------------------
  //  팔로우 토글
  // ------------------------------
  // const isFollowing = !!feed.myState.isfollowing;

  const handleToggleFollow = async () => {
    const targetPk = feed.user.userPk;
    if (!targetPk) return;

    const nextIsFollowing = !isFollowing;

    try {
      if (isFollowing) {
        const res = await unfollowUser(targetPk); // DELETE
        const next = res.result?.followStatus === "FOLLOWING";
        setIsFollowing(next);
      } else {
        const res = await followUser(targetPk); // POST
        const next = res.result?.followStatus === "FOLLOWING";
        setIsFollowing(next);
      }

      showToast(
        nextIsFollowing
          ? `@${feed.user.userId} 님을 팔로우했어요.`
          : "팔로우를 취소했어요.",
        nextIsFollowing ? toastmsg : undefined,
      );

      await fetchDetail();
    } catch (e: any) {
      console.error(e);

      if (e.response?.status === 409) {
        setIsFollowing(true);
        await fetchDetail();
        return;
      }

      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // ------------------------------
  //  게시글 좋아요/싫어요
  // ------------------------------
  const handleToggleReaction = async (like: boolean) => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    try {
      const data = await toggleFeedReaction(numericFeedId, like);

      if (data.code !== 1000) throw new Error(data.message);

      await fetchDetail();
    } catch (e) {
      console.error(e);
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // ------------------------------
  //  댓글 좋아요/싫어요
  // ------------------------------
  const updateCommentReaction = (
    list: UiCommentItem[],
    commentId: number,
    patch: { reaction: Reaction; likes: number; dislikes: number },
  ): UiCommentItem[] => {
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
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    try {
      const data = await toggleCommentReaction(commentId, like);

      if (data.code !== 1000) throw new Error(data.message);

      await fetchDetail();
    } catch (e) {
      console.error(e);
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // ------------------------------
  //  북마크 토글
  // ------------------------------
  const handleToggleBookmark = async () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    if (!detail) return;

    const current = detail.feed.myState.isbookmarked;
    const nextValue = !current;

    try {
      const data = await toggleFeedBookmark(numericFeedId, nextValue);
      if (data.code !== 1000) throw new Error(data.message);

      const after = await getFeedDetail(numericFeedId);
      console.log("after detail raw myState:", after.result.feed.myState);

      await fetchDetail();
    } catch (e) {
      console.error(e);
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // ------------------------------
  //  리포스트
  // ------------------------------
  const isReposted = detail.feed.myState.isreposted;

  const handleToggleRepost = async () => {
    if (!detail) return;

    const originFeedId = detail.feed.feedId;
    const contentType = detail.feed.type === "REVIEW" ? "REVIEW" : "POST";

    try {
      if (!isReposted) {
        const res = await fetch("/community/repost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "REPOST",
            content_type: contentType,
            originalFeedId: originFeedId,
          }),
        });
        if (!res.ok) throw new Error("repost failed");

        showToast("게시글을 리포스트했어요.", toastmsg);

        setDetail((prev) =>
          prev
            ? {
                ...prev,
                feed: {
                  ...prev.feed,
                  myState: { ...prev.feed.myState, isreposted: true },
                },
              }
            : prev,
        );
        return;
      }

      const res = await fetch(`/community/repost/${originFeedId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("repost cancel failed");

      showToast("리포스트를 취소했어요.");

      setDetail((prev) =>
        prev
          ? {
              ...prev,
              feed: {
                ...prev.feed,
                myState: { ...prev.feed.myState, isreposted: false },
              },
            }
          : prev,
      );
    } catch (e) {
      console.error(e);
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // ------------------------------
  //  렌더
  // ------------------------------
  return (
    <div className="relative h-screen flex flex-col">
      <DetailHeader title="게시글" />

      <div className="flex-1 flex flex-col bg-[#F9F9F9] min-h-0 scroll-available overflow-y-auto scrollbar-hide pb-15">
        <div className="bg-white">
          <FeedHeader
            feedId={numericFeedId}
            isMine={isMine}
            user={feed.user}
            isFollowing={isFollowing}
            onToggleFollow={handleToggleFollow}
            etcIcon={etc}
          />

          <FeedBody feed={feed} />

          <FeedActions
            counts={feed.counts}
            myState={feed.myState}
            createdAtText={createdAtText}
            viewCount={viewCount}
            commentIcon={comment}
            quotationIcon={quotation}
            completeRepostIcon={completeRepost}
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
            onClickQuote={() => setQuoteSheetOpen(true)}
          />
        </div>

        {/* 댓글 영역 */}
        <div
          className={
            comments.length === 0
              ? "flex-1 px-3 py-1 flex items-center justify-center bg-[#f9f9f9]"
              : "px-3 py-1 bg-[#f9f9f9]"
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

      {/* Toast */}
      {toast && (
        <div className="absolute inset-x-0 bottom-[84px] z-50 px-4">
          <div className="mx-auto w-full">
            <div className="h-12 rounded-[4px] bg-[#787878] px-4 flex items-center gap-[10px]">
              {toast.icon && (
                <img src={toast.icon} alt="" className="w-5 h-5 shrink-0" />
              )}
              <span className="text-[16px] text-white">{toast.text}</span>
            </div>
          </div>
        </div>
      )}

      <CommentInput
        profileImg={feed.user.profileImg ?? dummyProfile}
        onSubmit={handleAddComment}
        replyTo={replyTarget?.showBar ? replyTarget.loginId : null}
        onClearReply={() => setReplyTarget(null)}
        placeholderText={inputPlaceholder}
        inputRef={commentInputRef}
      />

      <FeedQuoteSheet
        open={quoteSheetOpen}
        onClose={() => setQuoteSheetOpen(false)}
        isReposted={isReposted}
        onRepost={handleToggleRepost}
        onQuote={() => {
          navigate(`/community/feeds/${numericFeedId}/quote`);
        }}
      />
    </div>
  );
}
