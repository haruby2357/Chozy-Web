import type { FeedCounts, FeedMyState } from "../types";

type Props = {
  counts: FeedCounts;
  myState: FeedMyState;

  createdAtText: string;
  viewCount: number;

  // icons
  commentIcon: string;
  quotationIcon: string;
  goodOnIcon: string;
  goodOffIcon: string;
  badOnIcon: string;
  badOffIcon: string;
  bookmarkOnIcon: string;
  bookmarkOffIcon: string;
  shareIcon: string;

  onToggleLike: () => void;
  onToggleDislike: () => void;
  onToggleBookmark: () => void;
  onClickComment?: () => void;
};

export default function FeedActions({
  counts,
  myState,
  createdAtText,
  viewCount,

  commentIcon,
  quotationIcon,
  goodOnIcon,
  goodOffIcon,
  badOnIcon,
  badOffIcon,
  bookmarkOnIcon,
  bookmarkOffIcon,
  shareIcon,

  onToggleLike,
  onToggleDislike,
  onToggleBookmark,
  onClickComment,
}: Props) {
  return (
    <div className="px-4 pb-4 pt-2 flex flex-col">
      {/* 작성날짜&조회수 */}
      <div className="flex flex-row justify-between items-center text-[#B5B5B5] text-[13px] mb-5">
        <span>{createdAtText || "—"}</span>
        <span>조회수 {viewCount}회</span>
      </div>

      {/* 포스트 상태바 */}
      <div className="pl-1 flex items-center justify-between mt-5">
        <div className="flex gap-3">
          {/* 댓글 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClickComment?.();
            }}
            className="flex items-center gap-[3px] leading-none"
          >
            <span className="w-6 h-6 flex items-center justify-center shrink-0">
              <img src={commentIcon} alt="댓글수" className="w-6 h-6 block" />
            </span>
            <span className="text-[13px] leading-none">{counts.comments}</span>
          </button>

          {/* 인용 */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-[3px] leading-none"
          >
            <span className="w-6 h-6 flex items-center justify-center shrink-0">
              <img src={quotationIcon} alt="인용수" className="w-6 h-6 block" />
            </span>
            <span className="text-[13px] leading-none">{counts.quotes}</span>
          </button>

          {/* 좋아요 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className="flex items-center gap-[3px] leading-none"
          >
            <span className="w-6 h-6 flex items-center justify-center shrink-0 pb-[5px] pl-1 pr-[3px]">
              <img
                src={myState.reaction === "LIKE" ? goodOnIcon : goodOffIcon}
                alt="좋아요수"
                className="w-6 h-6 block"
              />
            </span>
            <span className="text-[13px] leading-none">{counts.likes}</span>
          </button>

          {/* 싫어요 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleDislike();
            }}
            className="flex items-center gap-[3px] leading-none"
          >
            <span className="w-6 h-6 flex items-center justify-center shrink-0 pt-[5px] pl-1 pr-[3px]">
              <img
                src={myState.reaction === "DISLIKE" ? badOnIcon : badOffIcon}
                alt="싫어요수"
                className="w-6 h-6 block"
              />
            </span>
            <span className="text-[13px] leading-none">{counts.dislikes}</span>
          </button>
        </div>

        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className="w-6 h-6 flex items-center justify-center shrink-0"
          >
            <img
              src={myState.isbookmarked ? bookmarkOnIcon : bookmarkOffIcon}
              alt="북마크"
              className="w-6 h-6 block"
            />
          </button>

          <span className="w-6 h-6 flex items-center justify-center shrink-0">
            <img src={shareIcon} alt="공유" className="w-6 h-6 block" />
          </span>
        </div>
      </div>
    </div>
  );
}
