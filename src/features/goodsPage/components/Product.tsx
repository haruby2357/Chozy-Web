import heartOn from "../../../assets/goodsPage/heartOn.svg";
import heartOff from "../../../assets/goodsPage/heartOff.svg";
import star from "../../../assets/goodsPage/star.svg";

type ProductProps = {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number; // 0이면 할인 없음
  imageUrl: string;
  productUrl: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  status: boolean; // 좋아요(찜) 상태로 사용
  onToggleLike?: (productId: number) => void;
};

const calcFinalPrice = (originalPrice: number, discountRate: number) =>
  Math.round((originalPrice * (100 - discountRate)) / 100);

export default function Product({
  productId,
  name,
  originalPrice,
  discountRate,
  imageUrl,
  productUrl,
  rating,
  reviewCount,
  deliveryFee,
  status,
  onToggleLike,
}: ProductProps) {
  const hasDiscount = discountRate > 0;
  const finalPrice = hasDiscount
    ? calcFinalPrice(originalPrice, discountRate)
    : originalPrice;

  console.log("Product props", {
    productId,
    originalPrice,
    discountRate,
    rating,
    reviewCount,
    deliveryFee,
  });
  return (
    <div className="flex flex-col gap-2 mx-auto">
      {/* 상품사진 */}
      <div className="relative w-full flex justify-center">
        <div className="relative w-[177px] h-[177px]">
          <img
            src={imageUrl}
            alt={name}
            onClick={() => window.open(productUrl, "_blank")}
            className="cursor-pointer"
          />

          <button
            type="button"
            onClick={() => onToggleLike?.(productId)}
            className="absolute bottom-3 right-3"
            aria-label={status ? "좋아요 해제" : "좋아요"}
          >
            <img src={status ? heartOn : heartOff} alt="좋아요" />
          </button>
        </div>
      </div>

      {/* 상품명 */}
      <p
        onClick={() => window.open(productUrl, "_blank")}
        className="w-[177px] text-[14px] font-semibold line-clamp-1 cursor-pointer"
      >
        {name}
      </p>

      {/* 상품가격 */}
      <div>
        {hasDiscount ? (
          <div className="flex flex-col gap-[2px]">
            <span className="text-[14px] text-[#B5B5B5] line-through">
              {originalPrice.toLocaleString()}원
            </span>
            <div className="flex flex-row gap-1">
              <span className="text-[#66021F] text-[18px] font-bold">
                {discountRate}%
              </span>
              <span className="text-[#191919]">
                <span className="text-[18px] font-bold">
                  {finalPrice.toLocaleString()}
                </span>
                <span className="text-[16px] font-semibold">원</span>
              </span>
            </div>
          </div>
        ) : (
          <span>{originalPrice.toLocaleString()}원</span>
        )}
      </div>

      <div>
        {/* 별점/리뷰 */}
        <div className="flex flex-row gap-[2px] items-center">
          <img src={star} alt="평점" className="inline" />
          <span className="text-[#B5B5B5] text-[13px]">
            <span>{rating}</span>
            <span>
              ({reviewCount > 9999 ? "9,999+" : reviewCount.toLocaleString()})
            </span>
          </span>
        </div>

        {/* 배달비 */}
        <span className="text-[#B5B5B5] text-[13px]">
          {deliveryFee === 0
            ? "무료배송"
            : `배송비 ${deliveryFee.toLocaleString()}원`}
        </span>
      </div>
    </div>
  );
}
