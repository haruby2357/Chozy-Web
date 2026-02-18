import heartOn from "../../../assets/goodsPage/heartOn.svg";
import heartOff from "../../../assets/goodsPage/heartOff.svg";
import { saveRecentProduct } from "../../../api/domains/goodsPage/search";

type ProductSize = "md" | "sm";

type ProductProps = {
  size?: ProductSize;
  productId: number;
  vendor?: string;

  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;

  status: boolean;

  isSoldOut?: boolean;

  onToggleLike?: (productId: number) => void;
};

const calcFinalPrice = (originalPrice: number, discountRate: number) =>
  Math.round((originalPrice * (100 - discountRate)) / 100);

const SIZE_MAP: Record<ProductSize, { w: string; h: string; nameW: string }> = {
  md: { w: "w-[177px]", h: "h-[177px]", nameW: "w-[177px]" },
  sm: { w: "w-[140px]", h: "h-[140px]", nameW: "w-[140px]" },
};

const VENDOR_LABEL: Record<string, string> = {
  COUPANG: "쿠팡",
  ALI: "알리익스프레스",
};

function formatVendor(vendor?: string) {
  if (!vendor) return "";
  const key = vendor.trim().toUpperCase();
  return VENDOR_LABEL[key] ?? vendor;
}

export default function Product({
  size = "md",
  productId,
  vendor,
  name,
  originalPrice,
  discountRate,
  imageUrl,
  productUrl,
  status,
  isSoldOut = false,
  onToggleLike,
}: ProductProps) {
  const hasDiscount = discountRate > 0;
  const finalPrice = hasDiscount
    ? calcFinalPrice(originalPrice, discountRate)
    : originalPrice;

  const s = SIZE_MAP[size];
  const vendorLabel = formatVendor(vendor);

  const openProduct = async () => {
    if (isSoldOut) return;

    try {
      await saveRecentProduct(productId);
    } catch {
      // 저장 실패해도 이동
    }

    window.open(productUrl, "_blank");
  };
  return (
    <div className={`flex flex-col gap-2 ${s.w}`}>
      {/* 상품사진 */}
      <div className="relative w-full flex justify-center">
        <div className={`relative w-full ${s.h}`}>
          {vendorLabel ? (
            <div
              className="
                absolute top-2 left-2 z-10
                px-2 py-[2px]
                rounded-[2px]
                bg-[#F9F9F9]
                text-[12px] font-medium text-[#787878]
                max-w-[70%] truncate
              "
              title={vendorLabel}
            >
              {vendorLabel}
            </div>
          ) : null}

          <img
            src={imageUrl}
            alt={name}
            onClick={() => void openProduct()}
            className={[
              "w-full h-full object-cover rounded-[8px]",
              isSoldOut ? "cursor-default" : "cursor-pointer",
            ].join(" ")}
          />

          {/* 품절 오버레이 */}
          {/* {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="inline-flex px-[16px] py-[12px] justify-center items-center gap-[10px] rounded-[4px] bg-[rgba(87,87,87,0.90)]">
                <span className="text-white text-[14px] font-normal leading-[140%]">
                  품절된 상품이에요.
                </span>
              </div>
            </div>
          )} */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.(productId);
            }}
            className="absolute bottom-3 right-3"
            aria-label={status ? "좋아요 해제" : "좋아요"}
          >
            <img src={status ? heartOn : heartOff} alt="좋아요" />
          </button>
        </div>
      </div>

      {/* 상품명 */}
      <p
        onClick={() => void openProduct()}
        className={[
          "w-full text-[14px] font-semibold line-clamp-1",
          isSoldOut ? "cursor-default" : "cursor-pointer",
        ].join(" ")}
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
          <div className="flex items-baseline gap-1">
            <span className="text-[#191919] text-[18px] font-bold">
              {originalPrice.toLocaleString()}원
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
