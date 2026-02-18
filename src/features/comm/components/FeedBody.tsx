import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import type { UiFeedDetail } from "../../../api/domains/community/feedDetail";
import dummyProfile from "../../../assets/all/dummyProfile.svg";

type Props = {
  feed: UiFeedDetail;
};

const hasText = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const hasNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

export default function FeedBody({ feed }: Props) {
  const navigate = useNavigate();

  const tags = (feed.content.hashTags ?? []).filter(Boolean);
  const images = (feed.content.contentImgs ?? []).filter(Boolean);

  const isQuoted = feed.type === "QUOTE" || feed.type === "REPOST";

  // quote는 POST/REVIEW에도 optional로 들어올 수 있어서 안전하게 꺼냄
  const q = feed.content.quote;

  const showQuoteBox =
    isQuoted &&
    !!q &&
    (hasText(q.text) ||
      hasText(q.vendor) ||
      hasText(q.title) ||
      hasNumber(q.rating) ||
      ((q.contentImgs ?? []).filter(Boolean).length ?? 0) > 0);

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
              {feed.content.productUrl ? (
                <a
                  href={feed.content.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="underline underline-offset-2"
                >
                  {feed.content.title}
                </a>
              ) : (
                feed.content.title
              )}
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

        {/* QUOTE/REPOST 인용 박스 */}
        {showQuoteBox && q && (
          <div
            className="cursor-pointer rounded-[4px] border border-[#DADADA] px-2 py-3"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/community/feeds/${q.feedId}`);
            }}
          >
            <div className="flex flex-row gap-[8px] mb-[8px]">
              <img
                src={q.user.profileImg || dummyProfile}
                alt="인용 프로필"
                className="w-8 h-8 rounded-full border border-[#F9F9F9]"
              />
              <div className="flex flex-col gap-[2px]">
                {hasText(q.user.userName) && (
                  <span className="text-[#191919] text-[13px] font-medium">
                    {q.user.userName}
                  </span>
                )}
                {hasText(q.user.userId) && (
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

            {!!(q.contentImgs ?? []).filter(Boolean).length && (
              <div className="mt-3 flex gap-[2px] overflow-x-auto scrollbar-hide">
                {(q.contentImgs ?? []).filter(Boolean).map((src, idx) => (
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
