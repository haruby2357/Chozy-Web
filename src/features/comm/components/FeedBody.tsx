import StarRating from "./StarRating";
import type { FeedDetail } from "../types";

type Props = {
  feed: FeedDetail;
};

export default function FeedBody({ feed }: Props) {
  const tags = (feed.content.hashTags ?? []).filter(Boolean);
  const images = (feed.content.contentImgs ?? []).filter(Boolean);

  return (
    <>
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

      {/* 사진 */}
      {!!images.length && (
        <div className="px-4 pb-2">
          <div className="mb-2 flex gap-[2px] overflow-x-auto scrollbar-hide">
            {images.map((src, index) => (
              <img key={index} src={src} alt="게시글이미지" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
