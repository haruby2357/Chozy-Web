// 상품페이지의 메인페이지
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import Nav from "../../components/Nav";
import Category from "./components/Category";
import SearchBar from "../../components/SearchBar";
import Product from "./components/Product";
import ScrollToTop from "./components/ScrollToTop";

import cloth from "../../assets/goodsPage/category/cloth.svg";
import beauty from "../../assets/goodsPage/category/beauty.svg";
import diy from "../../assets/goodsPage/category/diy.svg";
import game from "../../assets/goodsPage/category/game.svg";
import cooking from "../../assets/goodsPage/category/cooking.svg";
import pet from "../../assets/goodsPage/category/pet.svg";
import electronics from "../../assets/goodsPage/category/electronics.svg";
import car from "../../assets/goodsPage/category/car.svg";

import { getPopularKeywords } from "../../api/domains/goodsPage/topKeyword/api";
import { getRecommendProducts } from "../../api/domains/goodsPage";

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
  vendor: string;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  status: boolean;
};

const categories: {
  imgSrc: string;
  label: string;
  apiCategory: ApiCategory;
}[] = [
  { imgSrc: cloth, label: "의류/잡화", apiCategory: "FASHION" },
  { imgSrc: beauty, label: "뷰티/건강", apiCategory: "BEAUTY" },
  { imgSrc: diy, label: "취미/DIY", apiCategory: "HOBBY" },
  { imgSrc: game, label: "완구/게임", apiCategory: "TOYS" },
  { imgSrc: cooking, label: "홈데코/주방", apiCategory: "HOME" },
  { imgSrc: pet, label: "반려동물", apiCategory: "PET" },
  { imgSrc: electronics, label: "전자제품", apiCategory: "ELECTRONICS" },
  { imgSrc: car, label: "자동차용품", apiCategory: "AUTOMOTIVE" },
];

function Home() {
  const navigate = useNavigate();

  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loadingProducts] = useState(false);

  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  // 추천 상품 요청 URL (명세 기반)
  const loadRecommend = async (nextPage: number) => {
    if (loading || !hasNext) return;

    setLoading(true);
    try {
      const data = await getRecommendProducts({
        page: nextPage,
        size: 20,
      });

      const result = data.result.result;

      const mappedItems: ApiProduct[] = (result.items ?? []).map((p: any) => ({
        productId: p.productId,
        vendor: p.vendor,
        name: p.name,
        originalPrice: p.originalPrice,
        discountRate: p.discountRate,
        imageUrl: p.imageUrl,
        productUrl: p.productUrl,
        status: !!p.isFavorited,
      }));

      setProductList((prev) => {
        const next = [...prev, ...mappedItems];
        const uniq = new Map<number, (typeof next)[number]>();
        next.forEach((it) => uniq.set(it.productId, it));
        return Array.from(uniq.values());
      });

      setHasNext(result.hasNext);
      setPage(result.page);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommend(0);
  }, []);

  // 인기 검색어
  useEffect(() => {
    (async () => {
      try {
        const data = await getPopularKeywords();
        setPopularKeywords(
          (data.result ?? []).slice(0, 10).map((k: any) => k.keyword),
        );
      } catch (e) {
        console.error("인기검색어 로딩 실패:", e);
        setPopularKeywords([]);
      }
    })();
  }, []);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext) {
          loadRecommend(page + 1);
        }
      },
      { threshold: 1 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [page, hasNext]);

  // 하트 토글(서버 연동 전): status 토글
  const handleToggleLike = (productId: number) => {
    setProductList((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, status: !item.status } : item,
      ),
    );
  };

  return (
    <>
      <div className="relative h-full">
        <Header />
        <div className="scroll-available h-full overflow-y-auto overflow-x-hidden pt-[48px] scrollbar-hide">
          <main className="flex flex-col gap-3">
            {/* 검색창 && 인기검색어 */}
            <div className="flex flex-col px-4 pt-2 pb-3 gap-3 shadow-[0_4px_10px_0_rgba(0,0,0,0.04)] bg-[#F9F9F9]">
              <SearchBar />

              <div className="flex items-center gap-3">
                <span className="font-semibold text-[14px] whitespace-nowrap">
                  인기 검색어
                </span>

                <div className="flex flex-1 min-w-0 gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {popularKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => {
                        navigate(
                          `/home/products?search=${encodeURIComponent(keyword)}`,
                        );
                      }}
                      className="flex-shrink-0 text-[#787878] text-[14px]"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 카테고리 선택 */}
            <div className="w-full bg-white grid grid-cols-4 grid-rows-2 px-4 gap-2">
              {categories.map((c) => (
                <Category
                  key={c.apiCategory}
                  imgSrc={c.imgSrc}
                  label={c.label}
                  onClick={() => {
                    navigate(`/home/products?category=${c.apiCategory}`);
                  }}
                />
              ))}
            </div>

            {/* 상품 추천 */}
            <div className="pt-4 px-4 flex flex-col bg-white gap-4">
              <p className="font-semibold text-[16px]">이런 상품은 어떠세요?</p>

              {loadingProducts && (
                <p className="text-[14px] text-[#787878]">
                  상품 불러오는 중...
                </p>
              )}

              {!loadingProducts && productList.length === 0 && (
                <p className="text-[14px] text-[#787878]">
                  추천 상품이 없습니다.
                </p>
              )}

              <div
                className="grid gap-x-1 gap-y-4 
            [grid-template-columns:repeat(auto-fill,minmax(177px,1fr))]
            justify-items-center"
              >
                {productList.map((p) => (
                  <Product
                    key={p.productId}
                    productId={p.productId}
                    vendor={p.vendor}
                    imageUrl={p.imageUrl}
                    productUrl={p.productUrl}
                    name={p.name}
                    originalPrice={p.originalPrice}
                    discountRate={p.discountRate}
                    status={p.status}
                    onToggleLike={handleToggleLike}
                  />
                ))}
              </div>
              <div ref={observerRef} />
            </div>
          </main>
        </div>
        <Nav scrollTargetSelector=".scroll-available" />
        <ScrollToTop scrollTargetSelector=".scroll-available" />
      </div>
    </>
  );
}

export default Home;
