import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import DetailHeader from "../../components/DetailHeader";
import StarRating from "./components/StarRating";
import CommentRow from "./components/CommentRow";
import CommentInput from "./components/CommentInput";
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

type Reaction = "LIKE" | "DISLIKE" | "NONE";

type FeedUser = {
  profileImg: string;
  userName: string;
  userId: string;
};

type FeedCounts = {
  comments: number;
  likes: number;
  dislikes: number;
  quotes: number;
};

type FeedMyState = {
  reaction: Reaction;
  isbookmarked: boolean;
  isreposted: boolean;
};

type PostContentDetail = {
  text: string;
  contentImgs: string[];
  hashTags: string[];
};

type ReviewContentDetail = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs: string[];
  hashTags: string[];
};

type FeedDetail =
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

export type CommentItem = {
  commentId: number;
  user: FeedUser;
  quote: string;
  content: string;
  counts: FeedCounts;
  myState: FeedMyState;
  createdAt: string;
  comment?: CommentItem[];
};

type FeedDetailResult = {
  feed: FeedDetail;
  comments: CommentItem[];
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

type ToastState = { text: string; icon?: string } | null;

type LikeToggleResult = {
  feedId: number;
  reaction: Reaction; // "LIKE" | "DISLIKE" | "NONE"
  counts: {
    likes: number;
    dislikes: number;
  };
};

type CommentLikeToggleResult = {
  commentId: number;
  reaction: Reaction;
  counts: { likes: number; dislikes: number };
};

type BookmarkToggleResult = {
  feedId: number;
  isBookmarked: boolean;
};

export default function PostDetail() {
  const { feedId } = useParams();
  const [detail, setDetail] = useState<FeedDetailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  // 명세서에 follow 여부 추가될 경우 초기값 그걸로 받아오기
  const [isFollowing, setIsFollowing] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    if (!feedId) return;

    const run = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/community/feeds/${feedId}/detail`);
        const data: ApiResponse<FeedDetailResult> = await res.json();

        if (data.code === 1000) {
          setDetail(data.result);
          setComments(data.result.comments ?? []);
        } else {
          setDetail(null);
          setComments([]);
        }
      } catch (e) {
        // (선택) 네트워크/파싱 에러 등일 때도 초기화
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
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
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

  const tags = (feed.content.hashTags ?? []).filter(Boolean);

  // 댓글 작성
  const handleAddComment = (text: string) => {
    const newComment: CommentItem = {
      commentId: Date.now(), // 임시 id (서버 붙이면 서버 id로 교체)
      user: {
        profileImg: feed.user.profileImg, // 사용자 정보에 대한 명세서 나오면 교체
        userName: feed.user.userName,
        userId: feed.user.userId,
      },
      quote: "",
      content: text,
      createdAt: new Date().toISOString(),
      counts: { comments: 0, likes: 0, dislikes: 0, quotes: 0 },
      myState: { reaction: "NONE", isbookmarked: false, isreposted: false },
      comment: [],
    };
    shouldScrollRef.current = true;
    setComments((prev) => [...prev, newComment]);
  };

  // 토스트 메시지
  const showToast = (text: string, icon?: string) => {
    setToast({ text, icon });
    window.setTimeout(() => setToast(null), 2000);
  };

  // 명세서 상 팔로우 요청/취소
  type FollowStatus = "FOLLOWING" | "NONE";

  type FollowResponse = {
    targetUserId: string;
    followStatus: FollowStatus;
  };

  const handleToggleFollow = async () => {
    const targetUserId = feed.user.userId; // MSW에서는 일단 문자열

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
    } catch (e) {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // 게시글 좋아요/싫어요
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
            myState: {
              ...prev.feed.myState,
              reaction: data.result.reaction,
            },
          },
        };
      });
    } catch (e) {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // 게시글 댓글 좋아요/싫어요
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
    } catch (e) {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  // 게시글 북마크 토글
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
    } catch (e) {
      showToast("처리 중 오류가 발생했어요.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <DetailHeader title="게시글" />
      <div className="flex-1 min-h-0 scroll-available overflow-y-auto scrollbar-hide pb-15">
        <div className="bg-white">
          {/* 프로필 */}
          <div className="flex flex-row justify-between items-center px-3 py-4">
            <div className="flex flex-row gap-[8px]">
              <img
                src={feed.user.profileImg}
                alt="프로필"
                className="w-10 h-10 rounded-[40px] border border-[#F9F9F9]"
              />
              <div className="flex flex-col gap-[2px]">
                <span className="text-[#191919] text-[14px] font-medium">
                  {feed.user.userName}
                </span>
                <span className="text-[#B5B5B5] text-[12px]">
                  @{feed.user.userId}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-[8px]">
              <button
                type="button"
                onClick={handleToggleFollow}
                className={
                  isFollowing
                    ? "flex items-center justify-center px-2 py-1 bg-white w-20 h-7 rounded-[40px] text-[14px] text-[#787878] border border-[#DADADA]"
                    : "flex items-center justify-center px-2 py-1 bg-[#800025] w-14 h-7 rounded-[40px] text-[14px] text-[#FFF]"
                }
              >
                {isFollowing ? "팔로우 중" : "팔로우"}
              </button>

              <button type="button">
                <img src={etc} alt="더보기" />
              </button>
            </div>
          </div>

          {/* 리뷰 정보(리뷰일 때만) */}
          {feed.type === "REVIEW" && (
            <div className="px-4">
              <div className="flex flex-row gap-1 mb-1">
                <span className="text-[#800025] text-[16px] font-semibold">
                  {feed.content.vendor}
                </span>
                <span className="text-[#191919] text-[16px] font-medium">
                  {feed.content.title}
                </span>
              </div>
              <div className="flex flex-row gap-1">
                <StarRating rating={feed.content.rating} />
                <span className="text-[#B5B5B5] text-[13px]">
                  {feed.content.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* 본문 */}
          <div className="flex flex-col gap-4 px-4 py-2">
            <div className="text-[14px] text-[#191919] whitespace-pre-line">
              {feed.content.text}
            </div>
            {/* 해시태그 */}
            {!!tags.length && (
              <div className="flex flex-wrap gap-1">
                {tags.map((t, idx) => (
                  <span
                    key={`${t}-${idx}`}
                    className="px-[6px] py-[2px] rounded-[4px] bg-[rgba(102,2,31,0.05)] text-[rgba(102,2,31,0.80)] text-[14px]"
                  >
                    {t.startsWith("#") ? t : `#${t}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 pb-4 pt-2 flex flex-col">
            {/* 사진 */}
            {!!(feed.content.contentImgs ?? []).filter(Boolean).length && (
              <div className="mb-2 flex gap-[2px] overflow-x-auto scrollbar-hide">
                {(feed.content.contentImgs ?? [])
                  .filter(Boolean)
                  .map((imgString, index) => (
                    <img key={index} src={imgString} alt="게시글이미지" />
                  ))}
              </div>
            )}
            {/* 작성날짜&조회수 */}
            {/* 명세서 수정 후 반영 예정 */}
            <div className="flex flex-row justify-between items-center text-[#B5B5B5] text-[13px] mb-5">
              <span>2025년 11월 10일 20:10</span>
              <span>조회수 202회</span>
            </div>
            {/* 포스트 상태바 */}
            <div className="pl-1 flex items-center justify-between mt-5">
              <div className="flex gap-3">
                {/* 댓글 */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={comment} alt="댓글수" className="w-6 h-6 block" />
                  </span>
                  <span className="text-[13px] leading-none">
                    {feed.counts.comments}
                  </span>
                </button>

                {/* 인용 */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img
                      src={quotation}
                      alt="인용수"
                      className="w-6 h-6 block"
                    />
                  </span>
                  <span className="text-[13px] leading-none">
                    {feed.counts.quotes}
                  </span>
                </button>

                {/* 좋아요 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleReaction(true);
                  }}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0 pb-[5px] pl-1 pr-[3px]">
                    <img
                      src={feed.myState.reaction === "LIKE" ? goodOn : goodOff}
                      alt="좋아요수"
                      className="w-6 h-6 block"
                    />
                  </span>
                  <span className="text-[13px] leading-none">
                    {feed.counts.likes}
                  </span>
                </button>

                {/* 싫어요 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleReaction(false);
                  }}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0 pt-[5px] pl-1 pr-[3px]">
                    <img
                      src={feed.myState.reaction === "DISLIKE" ? badOn : badOff}
                      alt="싫어요수"
                      className="w-6 h-6 block"
                    />
                  </span>
                  <span className="text-[13px] leading-none">
                    {feed.counts.dislikes}
                  </span>
                </button>
              </div>

              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark();
                  }}
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                >
                  <img
                    src={feed.myState.isbookmarked ? bookmarkOn : bookmarkOff}
                    alt="북마크"
                    className="w-6 h-6 block"
                  />
                </button>
                <span className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={share} alt="공유" className="w-6 h-6 block" />
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* 댓글 */}
        <div
          className={
            comments.length === 0
              ? "px-3 py-1 min-h-[200px] flex items-center justify-center"
              : "px-3 py-1 min-h-[200px]"
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
      />
    </div>
  );
}
