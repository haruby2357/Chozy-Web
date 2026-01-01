import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar2 from "../../components/SearchBar2";
import Sort, { type SortKey } from "./components/Sort";
import Product from "./components/Product";

import FilterSheet from "./components/filter/FIlterSheet";
import type { FilterTab } from "./components/filter/types";

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

  // API 요청 URL 생성
  const requestUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    else if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    return `/home/products?${params.toString()}`;
  }, [category, search, sort]);

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
    setSearchParams(nextParams);
  };

  // 좋아요 토글(서버 연동 전): status 토글
  const handleToggleLike = (productId: number) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, status: !p.status } : p
      )
    );
  };

  const isEmpty = !loading && productList.length === 0;

  return (
    <div className="h-full bg-white">
      <SearchBar2 />

      <div className="h-full overflow-y-auto scrollbar-hide pt-[68px]">
        {/* 추후 필터 컴포넌트 삽입 */}
        <div className="h-1 bg-[#f9f9f9]" />

        {/* DEV ONLY: 필터 바텀시트 테스트 진입 버튼 */}
        <div className="bg-white px-4 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setFilterDefaultTab("price");
              setFilterOpen(true);
            }}
            className="px-3 py-2 text-[14px] font-medium bg-[#F2F2F2] rounded"
          >
            필터 테스트(가격)
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterDefaultTab("rating");
              setFilterOpen(true);
            }}
            className="px-3 py-2 text-[14px] font-medium bg-[#F2F2F2] rounded"
          >
            필터 테스트(별점)
          </button>
        </div>

        <FilterSheet
          open={filterOpen}
          onOpenChange={setFilterOpen}
          defaultTab={filterDefaultTab}
          onConfirm={(state) => {
            // TODO: 필터 버튼 라벨/검색 파라미터로 연결
            console.log("필터 확인:", state);
          }}
        />

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
              justify-items-start"
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