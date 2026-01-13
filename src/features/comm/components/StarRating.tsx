import starOn from "../../../assets/community/star-on.svg";
import starOff from "../../../assets/community/star-off.svg";
import starHalf from "../../../assets/community/star-half.svg";

type Props = {
  rating: number; // 0.0 ~ 5.0 (0.5 단위)
};

export default function StarRating({ rating }: Props) {
  const fullCount = Math.floor(rating); // 꽉 찬 별
  const hasHalf = rating - fullCount >= 0.5; // 반 별 여부
  const emptyCount = 5 - fullCount - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-[2px]">
      {/* 꽉 찬 별 */}
      {Array.from({ length: fullCount }).map((_, i) => (
        <img
          key={`full-${i}`}
          src={starOn}
          alt="별점"
          className="w-[14px] h-[14px]"
        />
      ))}

      {/* 반 별 */}
      {hasHalf && (
        <img src={starHalf} alt="반 별" className="w-[14px] h-[14px]" />
      )}

      {/* 빈 별 */}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <img
          key={`empty-${i}`}
          src={starOff}
          alt="빈 별"
          className="w-[14px] h-[14px]"
        />
      ))}
    </div>
  );
}
