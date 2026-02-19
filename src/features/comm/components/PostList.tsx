import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StarRating from "./StarRating";
import ShareBottomSheet from "./ShareBottomSheet";
import FeedEtcSheet from "./FeedEtcSheet";
import FeedQuoteSheet from "./FeedQuoteSheet";

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
import completeRepostIcon from "../../../assets/community/completeRepost.svg";

import { toUiFeedItem } from "../../../api/domains/mypage/mapper";
import type {
  FeedItem,
  ReviewContent,
} from "../../../api/domains/community/feedList/feedUi";
import {
  toggleFeedReaction,
  toggleFeedBookmark,
} from "../../../api/domains/community/actions";
import {
  createRepost,
  deleteRepost,
} from "../../../api/domains/community/actions";

type ContentType = "ALL" | "POST" | "REVIEW";
type EmptyVariant = "community" | "mypage";

type PostListProps = {
  contentType: ContentType;
  fetchFeeds: () => Promise<{ code: number; result: { feeds: any[] } }>;
  emptyVariant?: EmptyVariant;
  emptyText?: string;
  mapItem?: (raw: any) => FeedItem;
  searchKeyword?: string;
  reloadKey?: string | number;
};

type PostContent = {
  text: string;
  contentImgs: string[];
};

function hasQuote(
  c: PostContent | ReviewContent,
): c is (ReviewContent | PostContent) & { quote: unknown } {
  return "quote" in c && !!(c as Record<string, unknown>).quote;
}

function renderHighlighted(text: string, keyword?: string) {
  if (!keyword || keyword.trim().length === 0) return text;

  const q = keyword.trim();
  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();

  const ranges: Array<{ s: number; e: number }> = [];
  let from = 0;

  while (true) {
    const idx = lowerText.indexOf(lowerQ, from);
    if (idx === -1) break;
    ranges.push({ s: idx, e: idx + lowerQ.length });
    from = idx + lowerQ.length;
  }

  if (ranges.length === 0) return text;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((r, i) => {
    if (cursor < r.s) {
      nodes.push(<span key={`pre-${i}`}>{text.slice(cursor, r.s)}</span>);
    }
    nodes.push(
      <span key={`hit-${i}`} className="text-[#800020] font-semibold">
        {text.slice(r.s, r.e)}
      </span>,
    );
    cursor = r.e;
  });

  if (cursor < text.length) {
    nodes.push(<span key="tail">{text.slice(cursor)}</span>);
  }

  return nodes;
}

export default function PostList({
  contentType,
  fetchFeeds,
  emptyVariant,
  emptyText,
  mapItem,
  searchKeyword,
  reloadKey,
}: PostListProps) {
  const navigate = useNavigate();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    text: string;
    icon?: string;
  } | null>(null);

  const showToast = (text: string, icon?: string) => {
    setToast({ text, icon });
    window.setTimeout(() => setToast(null), 2000);
  };

  const [openEtc, setOpenEtc] = useState(false);
  const [etcTarget, setEtcTarget] = useState<{
    feedId: number;
    isMine: boolean;
    authorUserId: string;
    authorUserPk: number;
  } | null>(null);

  // 인용 바텀시트
  const [quoteSheetOpen, setQuoteSheetOpen] = useState(false);
  const [quoteTargetFeedId, setQuoteTargetFeedId] = useState<number | null>(
    null,
  );

  const hasText = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  const hasNumber = (v: unknown): v is number =>
    typeof v === "number" && Number.isFinite(v);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const buildShareUrl = (feedId: number) => {
    // 배포 링크 고정
    return `https://chozy.net/community/feeds/${feedId}`;
  };

  const handleShare = async (feedId: number) => {
    const url = buildShareUrl(feedId);

    // 모바일 + Web Share API 지원
    if (isMobile() && navigator.share) {
      try {
        await navigator.share({
          title: "Chozy",
          text: "게시글 공유",
          url,
        });
        return;
      } catch (e) {
        console.log("share cancelled:", e);
        return;
      }
    }

    // PC 또는 Web Share 미지원 → 클립보드 복사
    try {
      await navigator.clipboard.writeText(url);

      showToast("링크가 복사되었습니다!");
    } catch (e) {
      console.error(e);
      showToast("링크 복사에 실패했어요.");
    }

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
      const nextItems = (result.feeds ?? []).map(mapItem ?? toUiFeedItem);
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
  }, [contentType, searchKeyword, reloadKey]);

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

  const filteredItems = items
    .filter((item) => {
      if (contentType === "ALL") return true;
      return item.type === contentType;
    })
    .filter((item) => {
      // 검색 키워드가 있으면 본문, 제목에서 검색
      if (!searchKeyword || searchKeyword.trim().length === 0) return true;

      const keyword = searchKeyword.trim().toLowerCase();
      const text = item.content.text?.toLowerCase() ?? "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const title = (item.content as any).title?.toLowerCase() ?? "";

      return text.includes(keyword) || title.includes(keyword);
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

  // 리포스트
  const targetItem = quoteTargetFeedId
    ? items.find((it) => it.feedId === quoteTargetFeedId)
    : undefined;

  const isReposted = targetItem?.myState?.isreposted ?? false;

  const handleToggleRepost = async () => {
    if (!quoteTargetFeedId) return;

    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    try {
      if (!isReposted) {
        const res = await createRepost(quoteTargetFeedId);
        if (res.code !== 1000) throw new Error(res.message ?? "리포스트 실패");
      } else {
        const res = await deleteRepost(quoteTargetFeedId);
        if (res.code !== 1000)
          throw new Error(res.message ?? "리포스트 취소 실패");
      }

      await loadFeeds();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        {filteredItems.map((item) => {
          console.log("feedId", item.feedId, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            kind: (item as any).kind,
            hasQuote: hasQuote(item.content),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            quoteContent: (item as any).content?.quoteContent,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isQuoted =
            (item as any).kind === "QUOTE" || (item as any).kind === "REPOST";

          return (
            <div
              key={item.feedId}
              onClick={() => navigate(`/community/feeds/${item.feedId}`)}
              className="px-[8px] py-3 bg-white"
            >
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
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      isMine: (item as any).isMine ?? false,
                      authorUserId: item.user.userId,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      authorUserPk: (item.user as any).userPk,
                    });
                    setOpenEtc(true);
                  }}
                >
                  <img src={etc} alt="더보기" />
                </button>
              </div>

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
                          {renderHighlighted(item.content.title, searchKeyword)}
                        </a>
                      ) : (
                        renderHighlighted(item.content.title, searchKeyword)
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

              <div className="flex flex-col gap-3">
                <div className="text-[14px] line-clamp-3 whitespace-pre-line">
                  {renderHighlighted(item.content.text, searchKeyword)}
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

              {isQuoted &&
                hasQuote(item.content) &&
                (() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const q = item.content.quote as any;
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

                      {hasNumber(q.rating) && (
                        <div className="flex flex-row gap-1">
                          <StarRating rating={q.rating} />
                          <span className="text-[#B5B5B5] text-[13px]">
                            {q.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {hasText(q.text) && (
                        <p className="text-[14px] line-clamp-4 whitespace-pre-line mt-2">
                          {q.text}
                        </p>
                      )}

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

              <div className="pl-1 flex items-center justify-between mt-5">
                <div className="flex gap-3">
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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuoteTargetFeedId(item.feedId);
                      setQuoteSheetOpen(true);
                    }}
                    className="flex items-center gap-[3px] leading-none"
                  >
                    <span className="w-6 h-6 flex items-center justify-center shrink-0">
                      <img
                        src={
                          item.myState.isreposted
                            ? completeRepostIcon
                            : quotation
                        }
                        alt="인용수"
                        className="w-6 h-6 block"
                      />
                    </span>

                    <span className="text-[13px] leading-none">
                      {item.counts.quotes}
                    </span>
                  </button>

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
        }}
        isMine={etcTarget?.isMine ?? false}
        feedId={etcTarget?.feedId ?? 0}
        authorUserPk={etcTarget?.authorUserPk ?? 0}
        onBlocked={loadFeeds}
      />

      <FeedQuoteSheet
        open={quoteSheetOpen}
        onClose={() => setQuoteSheetOpen(false)}
        isReposted={isReposted}
        onRepost={handleToggleRepost}
        onQuote={() => {
          // TODO: 인용 작성 화면으로 이동
          // navigate(`/community/feeds/${numericFeedId}/quote`);
        }}
      />

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#787878] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          {toast.icon && <img src={toast.icon} alt="" className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}
    </>
  );
}
