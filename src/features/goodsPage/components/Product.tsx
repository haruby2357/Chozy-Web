import heartOn from "../../../assets/goodsPage/heartOn.svg";
import heartOff from "../../../assets/goodsPage/heartOff.svg";
import star from "../../../assets/goodsPage/star.svg";

type ProductProps = {
  source: string;
  imgUrl: string;
  productUrl: string;
  name: string;
  price: number;
  discountRate?: number;
  discountPrice?: number;
  rating: number;
  reviewCnt: number;
  deliveryFee: number;
  liked: boolean;
  onToggleLike?: () => void;
};

export default function Product({
  source,
  imgUrl,
  productUrl,
  name,
  price,
  discountRate,
  discountPrice,
  rating,
  reviewCnt,
  deliveryFee,
  liked,
  onToggleLike,
}: ProductProps) {
  return (
    <div className="flex flex-col gap-2 mx-auto">
      {/* 상품사진 */}
      <div className="relative w-full flex justify-center">
        <div className="relative w-[177px] h-[177px]">
          <img
            src={imgUrl}
            alt={name}
            onClick={() => window.open(productUrl, "_blank")}
            className="cursor-pointer"
          />
          <span
            className="
        absolute top-[6px] left-[6px]
        items-center justify-center
        px-1 py-[2px]
        rounded-[2px]
        border border-[#F9F9F9]
        bg-white/70
        text-[#787878] text-[12px]"
          >
            {source}
          </span>
          <button onClick={onToggleLike} className="absolute bottom-3 right-3">
            <img src={liked ? heartOn : heartOff} alt="좋아요" />
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
        {discountPrice ? (
          <div className="flex flex-col gap-[2px]">
            <span className="text-[14px] text-[#B5B5B5] line-through">
              {price.toLocaleString()}원
            </span>
            <div className="flex flex-row gap-1">
              <span className="text-[#66021F] text-[18px] font-bold">
                {discountRate}%
              </span>
              <span className="text-[#191919]">
                <span className="text-[18px] font-bold">
                  {discountPrice.toLocaleString()}
                </span>
                <span className="text-[16px] font-semibold">원</span>
              </span>
            </div>
          </div>
        ) : (
          <span>{price.toLocaleString()}원</span>
        )}
      </div>
      <div>
        {/* 별점/리뷰 */}
        <div className="flex flex-row gap-[2px] items-center">
          <img src={star} alt="평점" className="inline" />
          <span className="text-[#B5B5B5] text-[13px]">
            <span>{rating}</span>
            <span>
              ({reviewCnt > 9999 ? "9,999+" : reviewCnt.toLocaleString()})
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
