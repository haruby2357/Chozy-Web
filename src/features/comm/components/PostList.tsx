import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import comment from "../../../assets/community/comment.svg";
import quotation from "../../../assets/community/quotation.svg";
import goodOn from "../../../assets/community/good-on.svg";
import goodOff from "../../../assets/community/good-off.svg";
import badOn from "../../../assets/community/bad-on.svg";
import badOff from "../../../assets/community/bad-off.svg";
import bookmarkOn from "../../../assets/community/bookmark-on.svg";
import bookmarkOff from "../../../assets/community/bookmark-off.svg";
import repost from "../../../assets/community/repost.svg";

type Tab = "RECOMMEND" | "FOLLOWING";
type ContentType = "ALL" | "POST" | "REVIEW";
type Reaction = "LIKE" | "DISLIKE" | "NONE";

type PostProps = {
  tab: Tab;
  contentType: ContentType;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

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

type PostContent = {
  text: string;
  contentImgs: string[];
};

type ReviewContentBase = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs: string[];
};

type QuotedReviewContent = ReviewContentBase & {
  user: FeedUser;
};

type ReviewContent = ReviewContentBase & {
  quoteContent?: QuotedReviewContent;
};

type FeedItemBase = {
  feedId: number;
  user: FeedUser;
  counts: FeedCounts;
  myState: FeedMyState;
};

export type FeedItem =
  | (FeedItemBase & { type: "POST"; content: PostContent })
  | (FeedItemBase & { type: "REVIEW"; content: ReviewContent });

function hasQuoteContent(
  c: PostContent | ReviewContent
): c is ReviewContent & { quoteContent: QuotedReviewContent } {
  return "quoteContent" in c && !!(c as any).quoteContent;
}

export default function PostList({ tab, contentType }: PostProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/community/feeds?tab=${tab}&contentType=${contentType}`
        );
        const data: ApiResponse<FeedItem[]> = await res.json();

        if (data.code === 1000) setItems(data.result);
        else setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [tab, contentType]);

  const filteredItems = items.filter((item) => {
    if (contentType === "ALL") return true;
    return item.type === contentType;
  });

  if (loading) return <div className="px-4 py-3">로딩중...</div>;

  if (!loading && filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-45">
        <div className="w-25 h-25 bg-[#D9D9D9]" />

        <p className="mt-10 text-[#787878] text-[16px] font-medium text-center leading-normal whitespace-pre-line">
          {tab === "FOLLOWING"
            ? "팔로우 중인 친구가 없어요.\n마음에 드는 이웃을 찾아보세요:)"
            : "아직 게시글이 없어요.\n첫 글을 작성해보세요:)"}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {filteredItems.map((item) => (
        <div
          key={item.feedId}
          role="button"
          onClick={() => navigate(`/community/feeds/${item.feedId}`)}
          className="px-[8px] py-3 bg-white"
        >
          {/* 프로필 */}
          <div className="flex flex-row gap-[8px] mb-[8px]">
            <img
              src={item.user.profileImg}
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

          {/* 리뷰일 때만 */}
          {item.type === "REVIEW" && (
            <div className="mb-3">
              <div className="flex flex-row gap-1 mb-1">
                <span className="text-[#800025] text-[16px] font-semibold">
                  {item.content.vendor}
                </span>
                <span className="text-[#191919] text-[16px] font-medium">
                  {item.content.title}
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

          {/* 인용 글일 결우 */}
          {hasQuoteContent(item.content) && (
            <div className="mt-5 rounded-[4px] border border-[#DADADA] px-[8px] py-3">
              <div className="flex flex-row gap-[8px] mb-[8px]">
                <img
                  src={item.content.quoteContent.user.profileImg}
                  alt="인용 프로필"
                  className="w-8 h-8 rounded-full border border-[#F9F9F9]"
                />
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[#191919] text-[13px] font-medium">
                    {item.content.quoteContent.user.userName}
                  </span>
                  <span className="text-[#B5B5B5] text-[11px]">
                    @{item.content.quoteContent.user.userId}
                  </span>
                </div>
              </div>

              <div className="flex flex-row gap-1 mb-1">
                <span className="text-[#800025] text-[16px] font-semibold">
                  {item.content.quoteContent.vendor}
                </span>
                <span className="text-[#191919] text-[16px] font-medium">
                  {item.content.quoteContent.title}
                </span>
              </div>

              <div className="flex flex-row gap-1">
                <StarRating rating={item.content.quoteContent.rating} />
                <span className="text-[#B5B5B5] text-[13px]">
                  {item.content.quoteContent.rating.toFixed(1)}
                </span>
              </div>

              <p className="text-[14px] line-clamp-4 whitespace-pre-line mt-2">
                {item.content.quoteContent.text}
              </p>

              {!!item.content.quoteContent.contentImgs?.filter(Boolean)
                .length && (
                <div className="mt-3 flex gap-[2px] overflow-x-auto scrollbar-hide">
                  {item.content.quoteContent.contentImgs
                    .filter(Boolean)
                    .map((src, idx) => (
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
          )}

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
                  <img src={quotation} alt="인용수" className="w-6 h-6 block" />
                </span>
                <span className="text-[13px] leading-none">
                  {item.counts.quotes}
                </span>
              </button>

              {/* 좋아요 */}
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-[3px] leading-none"
              >
                <span className="w-6 h-6 flex items-center justify-center shrink-0 pb-[5px] pl-1 pr-[3px]">
                  <img
                    src={item.myState.reaction === "LIKE" ? goodOn : goodOff}
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
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-[3px] leading-none"
              >
                <span className="w-6 h-6 flex items-center justify-center shrink-0 pt-[5px] pl-1 pr-[3px]">
                  <img
                    src={item.myState.reaction === "DISLIKE" ? badOn : badOff}
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
                onClick={(e) => e.stopPropagation()}
                className="w-6 h-6 flex items-center justify-center shrink-0"
              >
                <img
                  src={item.myState.isbookmarked ? bookmarkOn : bookmarkOff}
                  alt="북마크"
                  className="w-6 h-6 block"
                />
              </button>
              <span className="w-6 h-6 flex items-center justify-center shrink-0">
                <img src={repost} alt="재게시" className="w-6 h-6 block" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
