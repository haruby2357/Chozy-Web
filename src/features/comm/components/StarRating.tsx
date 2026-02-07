// 커뮤니티 별점 컴포넌트

import starOnIcon from "../../../assets/community/star-on.svg";
import starOffIcon from "../../../assets/community/star-off.svg";
interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  isInteractive?: boolean;
  size?: "sm" | "md";
}

export default function StarRating({
  rating,
  onRatingChange,
  isInteractive = false,
  size = "md",
}: StarRatingProps) {
  const filledCount = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyCount = 5 - Math.ceil(rating);

  // 디스플레이 전용 (size: sm)
  if (!isInteractive) {
    return (
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: filledCount }).map((_, i) => (
          <img
            key={`on-${i}`}
            src={starOnIcon}
            alt="별점"
            className="w-[14px] h-[14px]"
          />
        ))}

        {hasHalfStar && (
          <div className="relative w-[14px] h-[14px]">
            {/* 빈 별 */}
            <img
              src={starOffIcon}
              alt="빈 별"
              className="absolute top-0 left-0 w-[14px] h-[14px]"
            />
            {/* 반 채운 별 */}
            <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
              <img
                src={starOnIcon}
                alt="반 별"
                className="w-[14px] h-[14px] max-w-none"
              />
            </div>
          </div>
        )}

        {Array.from({ length: emptyCount }).map((_, i) => (
          <img
            key={`off-${i}`}
            src={starOffIcon}
            alt="빈 별"
            className="w-[14px] h-[14px]"
          />
        ))}
      </div>
    );
  }

  const starSize = size === "sm" ? "w-10 h-10" : "w-10 h-10";

  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`relative ${starSize} cursor-pointer`}
          onClick={(e) => {
            if (!onRatingChange) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            onRatingChange(x < rect.width / 2 ? star - 0.5 : star);
          }}
        >
          {/* 기본 빈 별 배경 */}
          <img src={starOffIcon} alt="빈 별" className="w-full h-full" />
          {/* 꽉 찬 별 */}
          {rating >= star && (
            <img
              src={starOnIcon}
              alt="채워진 별"
              className="absolute w-full h-full top-0 left-0"
            />
          )}
          {/* 반 별 */}
          {rating === star - 0.5 && (
            <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
              <img
                src={starOnIcon}
                alt="반 별"
                className="w-10 h-10 max-w-none"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
