import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StarRating from "./StarRating";
import ShareBottomSheet from "./ShareBottomSheet";
import FeedEtcSheet from "./FeedEtcSheet";

import comment from "../../../assets/community/comment.svg";
import quotation from "../../../assets/community/quotation.svg";
import goodOn from "../../../assets/community/good-on.svg";
import goodOff from "../../../assets/community/good-off.svg";
import badOn from "../../../assets/community/bad-on.svg";
import badOff from "../../../assets/community/bad-off.svg";
import bookmarkOn from "../../../assets/community/bookmark-on.svg";
import bookmarkOff from "../../../assets/community/bookmark-off.svg";
import share from "../../../assets/community/repost.svg";
import load from "../../../assets/community/loading.svg";
import etc from "../../../assets/community/etc.svg";
import dummyProfile from "../../../assets/all/dummyProfile.svg";

import { toUiFeedItem } from "../../../api/domains/mypage/mapper";
import type {
  FeedItem,
  ReviewContent,
} from "../../../api/domains/community/feedList/feedUi";
import {
  toggleFeedReaction,
  toggleFeedBookmark,
} from "../../../api/domains/community/actions";

type ContentType = "ALL" | "POST" | "REVIEW";
type EmptyVariant = "community" | "mypage";

type PostListProps = {
  contentType: ContentType;
  fetchFeeds: () => Promise<{ code: number; result: { feeds: any[] } }>;
  emptyVariant?: EmptyVariant;
  emptyText?: string;
};

type PostContent = {
  text: string;
  contentImgs: string[];
};

function hasQuote(
  c: PostContent | ReviewContent,
): c is (ReviewContent | PostContent) & { quote: any } {
  return "quote" in c && !!(c as any).quote;
}

export default function PostList({
  contentType,
  fetchFeeds,
  emptyVariant,
  emptyText,
}: PostListProps) {
  const navigate = useNavigate();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [openEtc, setOpenEtc] = useState(false);
  const [etcTarget, setEtcTarget] = useState<{
    feedId: number;
    isMine: boolean;
    authorUserId: string;
  } | null>(null);

  const hasText = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  const hasNumber = (v: unknown): v is number =>
    typeof v === "number" && Number.isFinite(v);

  // 공유
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const buildShareUrl = (feedId: number) => {
    // 배포 링크 고정(원하면 window.location.origin로 변경 가능)
    return `https://chozy.net/community/feeds/${feedId}`;
  };

  const handleShare = async (feedId: number) => {
    const url = buildShareUrl(feedId);

    // ✅ 폰 + Web Share 지원이면 -> OS 공유 시트
    if (isMobile() && navigator.share) {
      try {
        await navigator.share({
          title: "Chozy",
          text: "게시글 공유",
          url,
        });
        return;
      } catch (e) {
        // 취소해도 정상 흐름
        console.log("share cancelled/failed:", e);
        return;
      }
    }

    // ✅ PC(또는 미지원) -> 바텀시트(링크복사)
    setShareUrl(url);
    setShareOpen(true);
  };

  // 게시글 목록 조회
  const loadFeeds = async () => {
    try {
      setLoading(true);
      const data = await fetchFeeds();

      if (data.code !== 1000) {
        setItems([]);
        return;
      }

      const result = data.result;
      const nextItems = (result.feeds ?? []).map(toUiFeedItem);

      setItems(nextItems);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, [fetchFeeds]);

  // 게시글 좋아요/싫어요 토글
  const handleToggleReaction = async (feedId: number, like: boolean) => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    try {
      const data = await toggleFeedReaction(feedId, like);

      if (data.code !== 1000) throw new Error(data.message);

      await loadFeeds();
    } catch (e) {
      console.error(e);
    }
  };

  // 게시글 북마크 토글
  const handleToggleBookmark = async (feedId: number, current: boolean) => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    const nextValue = !current;

    try {
      const data = await toggleFeedBookmark(feedId, nextValue);

      if (data.code !== 1000) throw new Error(data.message);

      await loadFeeds();
    } catch (e) {
      console.error(e);
    }
  };

  // NOTE: 서버가 contentType 필터링을 이미 해줄 수 있지만,
  // UI에서 한 번 더 안전하게 필터링
  const filteredItems = items.filter((item) => {
    if (contentType === "ALL") return true;
    return item.type === contentType;
  });

  if (loading) return <div className="px-4 py-3">로딩중...</div>;

  if (!loading && filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        {emptyVariant === "community" && <img src={load} alt="empty" />}

        <p
          className={
            emptyVariant === "community"
              ? "mt-6 text-[#787878] text-[16px] font-medium text-center leading-normal whitespace-pre-line"
              : "mt-10 text-[#B5B5B5] text-[16px] font-medium text-center leading-normal whitespace-pre-line"
          }
        >
          {emptyText ?? "목록이 없어요."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        {filteredItems.map((item) => {
          console.log("feedId", item.feedId, {
            kind: (item as any).kind,
            hasQuote: hasQuote(item.content),
            quoteContent: (item as any).content?.quoteContent,
          });

          const isQuoted =
            (item as any).kind === "QUOTE" || (item as any).kind === "REPOST";

          return (
            <div
              key={item.feedId}
              role="button"
              onClick={() => navigate(`/community/feeds/${item.feedId}`)}
              className="px-[8px] py-3 bg-white"
            >
              {/* 프로필 */}
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[8px] mb-[8px]">
                  <img
                    src={item.user.profileImg ?? dummyProfile}
                    alt="프로필"
                    className="w-10 h-10 rounded-[40px] border border-[#F9F9F9]"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[#191919] text-[14px] font-medium">
                      {item.user.userName}
                    </span>
                    <span className="text-[#B5B5B5] text-[12px]">
                      @{item.user.userId}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEtcTarget({
                      feedId: item.feedId,
                      isMine: (item as any).isMine ?? false,
                      authorUserId: item.user.userId,
                    });
                    setOpenEtc(true);
                  }}
                >
                  <img src={etc} alt="더보기" />
                </button>
              </div>

              {/* 리뷰일 때만 */}
              {item.type === "REVIEW" && (
                <div className="mb-3">
                  <div className="flex flex-row gap-1 mb-1">
                    <span className="text-[#800025] text-[16px] font-semibold">
                      {item.content.vendor}
                    </span>
                    <span className="text-[#191919] text-[16px] font-medium">
                      {item.content.productUrl ? (
                        <a
                          href={item.content.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="underline underline-offset-2"
                        >
                          {item.content.title}
                        </a>
                      ) : (
                        item.content.title
                      )}
                    </span>
                  </div>
                  <div className="flex flex-row gap-1">
                    <StarRating rating={item.content.rating} />
                    <span className="text-[#B5B5B5] text-[13px]">
                      {item.content.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

              {/* 본문 */}
              <div className="flex flex-col gap-3">
                <div className="text-[14px] line-clamp-3 whitespace-pre-line">
                  {item.content.text}
                </div>
                {!!(item.content.contentImgs ?? []).filter(Boolean).length && (
                  <div className="mt-3 flex gap-[2px] overflow-x-auto scrollbar-hide">
                    {(item.content.contentImgs ?? [])
                      .filter(Boolean)
                      .map((imgString, index) => (
                        <img key={index} src={imgString} alt="게시글이미지" />
                      ))}
                  </div>
                )}
              </div>

              {/* 인용 글일 경우 */}
              {isQuoted &&
                hasQuote(item.content) &&
                (() => {
                  const q = item.content.quote;
                  const hasAny =
                    hasText(q?.text) ||
                    hasText(q?.vendor) ||
                    hasText(q?.title) ||
                    hasNumber(q?.rating) ||
                    (q?.contentImgs?.filter(Boolean).length ?? 0) > 0;

                  if (!hasAny) return null;

                  return (
                    <div
                      className="cursor-pointer mt-5 rounded-[4px] border border-[#DADADA] px-2 mx-3 py-3"
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof q.feedId === "number") {
                          navigate(`/community/feeds/${q.feedId}`);
                        }
                      }}
                    >
                      <div className="flex flex-row gap-[8px] mb-[8px]">
                        <img
                          src={q.user?.profileImg ?? dummyProfile}
                          alt="인용 프로필"
                          className="w-8 h-8 rounded-full border border-[#F9F9F9]"
                        />
                        <div className="flex flex-col gap-[2px]">
                          {hasText(q.user?.userName) && (
                            <span className="text-[#191919] text-[13px] font-medium">
                              {q.user.userName}
                            </span>
                          )}
                          {hasText(q.user?.userId) && (
                            <span className="text-[#B5B5B5] text-[11px]">
                              @{q.user.userId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* vendor / title: 있는 것만 */}
                      {(hasText(q.vendor) || hasText(q.title)) && (
                        <div className="flex flex-row gap-1 mb-1">
                          {hasText(q.vendor) && (
                            <span className="text-[#800025] text-[16px] font-semibold">
                              {q.vendor}
                            </span>
                          )}
                          {hasText(q.title) && (
                            <span className="text-[#191919] text-[16px] font-medium">
                              {q.title}
                            </span>
                          )}
                        </div>
                      )}

                      {/* rating: 있을 때만 */}
                      {hasNumber(q.rating) && (
                        <div className="flex flex-row gap-1">
                          <StarRating rating={q.rating} />
                          <span className="text-[#B5B5B5] text-[13px]">
                            {q.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* text: 있을 때만 */}
                      {hasText(q.text) && (
                        <p className="text-[14px] line-clamp-4 whitespace-pre-line mt-2">
                          {q.text}
                        </p>
                      )}

                      {/* images: 있을 때만 */}
                      {!!q.contentImgs?.filter(Boolean).length && (
                        <div className="mt-3 flex gap-[2px] overflow-x-auto scrollbar-hide">
                          {q.contentImgs
                            .filter(Boolean)
                            .map((src: string, idx: number) => (
                              <img
                                key={idx}
                                src={src}
                                alt="인용 이미지"
                                className="w-full aspect-square rounded-[4px] object-cover"
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

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
                      <img
                        src={comment}
                        alt="댓글수"
                        className="w-6 h-6 block"
                      />
                    </span>
                    <span className="text-[13px] leading-none">
                      {item.counts.comments}
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
                      {item.counts.quotes}
                    </span>
                  </button>

                  {/* 좋아요 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleReaction(item.feedId, true);
                    }}
                    className="flex items-center gap-[3px] leading-none"
                  >
                    <span className="w-6 h-6 flex items-center justify-center shrink-0 pb-[5px] pl-1 pr-[3px]">
                      <img
                        src={
                          item.myState.reaction === "LIKE" ? goodOn : goodOff
                        }
                        alt="좋아요수"
                        className="w-6 h-6 block"
                      />
                    </span>
                    <span className="text-[13px] leading-none">
                      {item.counts.likes}
                    </span>
                  </button>

                  {/* 싫어요 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleReaction(item.feedId, false);
                    }}
                    className="flex items-center gap-[3px] leading-none"
                  >
                    <span className="w-6 h-6 flex items-center justify-center shrink-0 pt-[5px] pl-1 pr-[3px]">
                      <img
                        src={
                          item.myState.reaction === "DISLIKE" ? badOn : badOff
                        }
                        alt="싫어요수"
                        className="w-6 h-6 block"
                      />
                    </span>
                    <span className="text-[13px] leading-none">
                      {item.counts.dislikes}
                    </span>
                  </button>
                </div>

                {/* 북마크 + 공유 */}
                <div className="flex gap-[8px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(
                        item.feedId,
                        item.myState.isbookmarked,
                      );
                    }}
                    className="w-6 h-6 flex items-center justify-center shrink-0"
                  >
                    <img
                      src={item.myState.isbookmarked ? bookmarkOn : bookmarkOff}
                      alt="북마크"
                      className="w-6 h-6 block"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(item.feedId);
                    }}
                    className="w-6 h-6 flex items-center justify-center shrink-0"
                  >
                    <img src={share} alt="공유" className="w-6 h-6 block" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ShareBottomSheet
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={shareUrl}
      />

      <FeedEtcSheet
        open={openEtc}
        onClose={() => {
          setOpenEtc(false);
          setEtcTarget(null);
        }}
        isMine={etcTarget?.isMine ?? false}
        feedId={etcTarget?.feedId ?? 0}
        authorUserId={etcTarget?.authorUserId ?? ""}
      />
    </>
  );
}
