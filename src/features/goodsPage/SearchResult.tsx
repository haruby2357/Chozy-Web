import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar2 from "../../components/SearchBar2";
import Sort, { type SortKey } from "./components/Sort";
import Product from "./components/Product";

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

    nextParams.set("sort", nextSort); // sort만 교체
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
    <>
      <SearchBar2 />
      {/* 상품 검색 화면 완성 시 검색창 누르면 상품 검색 화면으로 이동 추가 */}
      <div className="pt-[68px]">
        {/* 추후 필터 컴포넌트 삽입 */}
        <div className="h-1" />

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
    </>
  );
}
