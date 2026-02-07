import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar2 from "../../components/SearchBar2";
import Sort, { type SortKey } from "./components/Sort";
import Product from "./components/Product";

import FilterSheet from "./components/filter/FIlterSheet";
import type {
  FilterTab,
  FilterSheetState,
  PricePresetKey,
} from "./components/filter/types";

type ApiCategory =
  | "FASHION"
  | "BEAUTY"
  | "HOBBY"
  | "TOYS"
  | "HOME"
  | "PET"
  | "ELECTRONICS"
  | "AUTOMOTIVE";

type ApiProduct = {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  status: boolean;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

const isCategory = (v: string | null): v is ApiCategory =>
  v === "FASHION" ||
  v === "BEAUTY" ||
  v === "HOBBY" ||
  v === "TOYS" ||
  v === "HOME" ||
  v === "PET" ||
  v === "ELECTRONICS" ||
  v === "AUTOMOTIVE";

const readNum = (sp: URLSearchParams, key: string) => {
  const raw = sp.get(key);
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};

//가격 preset 복원용
const PRESET_RANGE: Record<PricePresetKey, [number, number]> = {
  under10k: [0, 10000],
  "1to30k": [10000, 30000],
  "30to50k": [30000, 50000],
  "50to100k": [50000, 100000],
  over100k: [100000, 100000],
};

const findPricePreset = (
  min: number,
  max: number,
): PricePresetKey | undefined => {
  return (Object.keys(PRESET_RANGE) as PricePresetKey[]).find((k) => {
    const [a, b] = PRESET_RANGE[k];
    return a === min && b === max;
  });
};

export default function SearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const searchParam = (searchParams.get("search") ?? "")
    .replace(/^"|"$/g, "")
    .trim();

  const category = isCategory(categoryParam) ? categoryParam : null;
  const search = category ? "" : searchParam;
  const sort = (searchParams.get("sort") ?? "RELEVANCE") as SortKey;

  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // 필터 바텀시트 테스트용 상태(DEV ONLY)
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDefaultTab, setFilterDefaultTab] = useState<FilterTab>("price");

  // URL에서 필터값 읽기
  const minPriceQ = readNum(searchParams, "minPrice");
  const maxPriceQ = readNum(searchParams, "maxPrice");
  const minRatingQ = readNum(searchParams, "minRating");
  const maxRatingQ = readNum(searchParams, "maxRating");

  const filterInitial: Partial<FilterSheetState> = useMemo(() => {
    const hasPrice = minPriceQ !== undefined && maxPriceQ !== undefined;
    const hasRating = minRatingQ !== undefined && maxRatingQ !== undefined;

    const next: Partial<FilterSheetState> = {};

    if (hasPrice) {
      const preset = findPricePreset(minPriceQ!, maxPriceQ!);
      if (preset) {
        next.priceMode = "preset";
        next.pricePreset = preset;
      } else {
        next.priceMode = "custom";
        next.pricePreset = undefined;
      }
      next.priceMin = minPriceQ!;
      next.priceMax = maxPriceQ!;
    } else {
      next.priceMode = "all";
      next.pricePreset = undefined;
      next.priceMin = 0;
      next.priceMax = 100000;
    }

    if (hasRating) {
      next.ratingMode = "custom";
      next.ratingMin = minRatingQ!;
      next.ratingMax = maxRatingQ!;
    } else {
      next.ratingMode = "all";
      next.ratingMin = 0.0;
      next.ratingMax = 5.0;
    }

    return next;
  }, [minPriceQ, maxPriceQ, minRatingQ, maxRatingQ]);

  // API 요청 URL 생성
  const requestUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    else if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    if (minPriceQ !== undefined && maxPriceQ !== undefined) {
      params.set("minPrice", String(minPriceQ));
      params.set("maxPrice", String(maxPriceQ));
    }

    if (minRatingQ !== undefined && maxRatingQ !== undefined) {
      params.set("minRating", String(minRatingQ));
      params.set("maxRating", String(maxRatingQ));
    }

    return `/home/products?${params.toString()}`;
  }, [category, search, sort, minPriceQ, maxPriceQ, minRatingQ, maxRatingQ]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(requestUrl);
        const data: ApiResponse<ApiProduct[]> = await res.json();
        setProductList(data.result ?? []);
      } catch (e) {
        console.error("상품 목록 로딩 실패:", e);
        setProductList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [requestUrl]);

  const handleSortChange = (nextSort: SortKey) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sort", nextSort);
    setSearchParams(nextParams, { replace: true });
  };

  // 좋아요 토글(서버 연동 전): status 토글
  const handleToggleLike = (productId: number) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, status: !p.status } : p,
      ),
    );
  };

  const isEmpty = !loading && productList.length === 0;

  return (
    <div className="relative h-full bg-white flex flex-col">
      <SearchBar2 backBehavior="BACK" focusNavigateTo="/home/search" />

      <div className="flex-1 overflow-y-auto scrollbar-hide pt-[68px]">
        {/* DEV ONLY: 필터 바텀시트 테스트 진입 버튼 */}
        <div className="bg-white px-4 pb-[9px] flex gap-2">
          <button
            type="button"
            onClick={() => {
              setFilterDefaultTab("price");
              setFilterOpen(true);
            }}
            className="px-3 py-2 text-[14px] font-medium bg-[#F2F2F2] rounded"
          >
            가격
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterDefaultTab("rating");
              setFilterOpen(true);
            }}
            className="px-3 py-2 text-[14px] font-medium bg-[#F2F2F2] rounded"
          >
            별점
          </button>
        </div>

        <FilterSheet
          open={filterOpen}
          onOpenChange={setFilterOpen}
          defaultTab={filterDefaultTab}
          initial={filterInitial}
          onConfirm={(state) => {
            const next = new URLSearchParams(searchParams);

            // 가격
            if (state.priceMode === "all") {
              next.delete("minPrice");
              next.delete("maxPrice");
            } else {
              // 나중에 연동 시 preset/custom 모두 최종 min/max만 서버로 전송하면 됨
              next.set("minPrice", String(state.priceMin ?? 0));
              next.set("maxPrice", String(state.priceMax ?? 100000));
            }

            // 별점
            if (state.ratingMode === "all") {
              next.delete("minRating");
              next.delete("maxRating");
            } else {
              next.set("minRating", String(state.ratingMin ?? 0.0));
              next.set("maxRating", String(state.ratingMax ?? 5.0));
            }

            setSearchParams(next, { replace: true });
          }}
        />

        <div className="h-1 bg-[#f9f9f9]" />

        {isEmpty ? (
          <div className="bg-white px-4">
            <div className="pt-[225px] flex flex-col items-center justify-center gap-10">
              <div className="w-[100px] h-[100px] bg-[#D9D9D9]" />
              <p className="text-[16px] font-medium text-[#575757]">
                검색 결과가 없어요.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white pt-4 px-4 flex flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <span className="text-[#B5B5B5] font-medium text-[14px]">
                {loading ? "불러오는 중..." : `전체 ${productList.length}개`}
              </span>
              <Sort value={sort} onChange={handleSortChange} />
            </div>

            <p className="text-[#B5B5B5] text-[14px] font-medium">
              상품을 클릭하면 해당 상품 사이트로 이동합니다.
            </p>

            <div
              className="grid gap-x-1 gap-y-4 
              [grid-template-columns:repeat(auto-fill,minmax(177px,1fr))]
              justify-items-center"
            >
              {productList.map((p) => (
                <Product
                  key={p.productId}
                  productId={p.productId}
                  name={p.name}
                  originalPrice={p.originalPrice}
                  discountRate={p.discountRate}
                  imageUrl={p.imageUrl}
                  productUrl={p.productUrl}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  deliveryFee={p.deliveryFee}
                  status={p.status}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
