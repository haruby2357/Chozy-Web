import { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar2 from "../../components/SearchBar2";
import Product from "./components/Product";

import popularUp from "../../assets/goodsPage/search/popular_up.svg";
import popularDown from "../../assets/goodsPage/search/popular_down.svg";
import popularStay from "../../assets/goodsPage/search/popular_stay.svg";
import clueIcon from "../../assets/goodsPage/search/clue.svg";

import RecentKeywordsSection from "../../components/search/RecentKeywordsSection";

import {
  deleteAllRecentKeywords,
  deleteRecentKeyword,
  getPopularKeywords,
  getRecentKeywords,
  getRecentProducts,
  getRecommendKeywords,
  saveSearchKeyword,
} from "../../api/domains/goodsPage/search";

import type {
  RecentKeyword,
  PopularKeyword,
  RecommendKeyword,
} from "../../api/domains/goodsPage/search";

type RecentProduct = {
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

const SECTION_GAP_BG = "bg-[#F5F5F5]";

const trendIcon = (prev: number, curr: number) => {
  if (curr < prev) return popularUp;
  if (curr > prev) return popularDown;
  return popularStay;
};

function renderHighlighted(text: string, keyword: string) {
  const q = keyword.trim();
  if (!q) return text;

  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();

  const ranges: Array<{ s: number; e: number }> = [];
  let from = 0;

  while (true) {
    const idx = lowerText.indexOf(lowerQ, from);
    if (idx === -1) break;
    ranges.push({ s: idx, e: idx + lowerQ.length });
    from = idx + lowerQ.length;
  }

  if (ranges.length === 0) return text;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((r, i) => {
    if (cursor < r.s) {
      nodes.push(<span key={`pre-${i}`}>{text.slice(cursor, r.s)}</span>);
    }
    nodes.push(
      <span key={`hit-${i}`} className="text-[#800020] font-semibold">
        {text.slice(r.s, r.e)}
      </span>,
    );
    cursor = r.e;
  });

  if (cursor < text.length) {
    nodes.push(<span key="tail">{text.slice(cursor)}</span>);
  }

  return nodes;
}

export default function SearchEntry() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [recentKeywords, setRecentKeywords] = useState<RecentKeyword[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<PopularKeyword[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [recommends, setRecommends] = useState<RecommendKeyword[]>([]);

  // const hasRecentKeywords = recentKeywords.length > 0;
  const hasPopularKeywords = popularKeywords.length > 0;
  const hasRecentProducts = recentProducts.length > 0;

  const trimmed = query.trim();
  const isBlankOnly = query.length > 0 && trimmed.length === 0;

  // 자동완성 노출 조건: 1글자 이상 입력 + 공백만 입력 제외
  // query.length으로 기존 스페이스 입력 -> 실시간 감지로 변경
  const shouldShowAutocomplete = query.length >= 1 && !isBlankOnly;

  const popularSlots = useMemo(() => {
    if (hasPopularKeywords) return popularKeywords.slice(0, 8);
    return Array.from({ length: 8 }).map((_, idx) => ({
      keywordId: -1 * (idx + 1),
      keyword: "",
      previousRank: 0,
      currentRank: 0,
    }));
  }, [hasPopularKeywords, popularKeywords]);

  const onDeleteRecentKeyword = async (keywordId: number) => {
    const prev = recentKeywords;

    setRecentKeywords((curr) => curr.filter((k) => k.keywordId !== keywordId));

    try {
      await deleteRecentKeyword(keywordId); // 👈 여기
    } catch {
      setRecentKeywords(prev);
    }
  };

  const onClearRecentKeywords = async () => {
    const prev = recentKeywords;
    setRecentKeywords([]);

    try {
      await deleteAllRecentKeywords();
    } catch {
      setRecentKeywords(prev);
    }
  };

  const loadSections = useCallback(async () => {
    const [recentR, popularR, productsR] = await Promise.allSettled([
      getRecentKeywords(),
      getPopularKeywords(),
      getRecentProducts(),
    ]);

    setRecentKeywords(
      recentR.status === "fulfilled" ? recentR.value.slice(0, 10) : [],
    );

    setPopularKeywords(
      popularR.status === "fulfilled" ? popularR.value.slice(0, 8) : [],
    );

    const productsApi = productsR.status === "fulfilled" ? productsR.value : [];

    setRecentProducts(
      productsApi.slice(0, 6).map((p) => ({
        productId: p.productId,
        name: p.name,
        originalPrice: p.originalPrice,
        discountRate: p.discountRate,
        imageUrl: p.imageUrl,
        productUrl: p.productUrl,
        rating: 0,
        reviewCount: 0,
        deliveryFee: 0,
        status: p.isFavorited,
      })),
    );
  }, []);

  useEffect(() => {
    // SearchEntry 진입 시 기본 섹션 데이터 로드
    const id = window.setTimeout(() => {
      void loadSections();
    }, 0);

    return () => window.clearTimeout(id);
  }, [loadSections]);

  useEffect(() => {
    if (!shouldShowAutocomplete) return;

    const ac = new AbortController();

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const list = await getRecommendKeywords(trimmed, ac.signal);
          if (!ac.signal.aborted) setRecommends(list.slice(0, 10));
        } catch {
          if (!ac.signal.aborted) setRecommends([]);
        }
      })();
    }, 200);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
      setRecommends([]);
    };
  }, [trimmed, shouldShowAutocomplete]);

  const goToResults = (keyword: string) => {
     navigate(
       `/home/products?search=${encodeURIComponent(keyword)}&source=manual`,
     );
  };

  const runSearch = async (rawKeyword: string) => {
    const keyword = rawKeyword.trim();
    if (!keyword) return;

    try {
      await saveSearchKeyword(keyword);
    } catch {
      // 저장 실패해도 검색은 진행
    }

    goToResults(keyword);
  };

  const onToggleRecentProductLike = (productId: number) => {
    setRecentProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, status: !p.status } : p,
      ),
    );
  };

  return (
    <div className="relative h-full flex flex-col bg-white w-full overflow-x-hidden">
      <SearchBar2
        autoFocus
        backBehavior="BACK"
        value={query}
        onChange={setQuery}
        onSubmitQuery={(q) => runSearch(q)}
      />

      <main className="flex-1 overflow-y-auto scrollbar-hide pt-[72px]">
        <section className="bg-white">
          <div className={`h-1 ${SECTION_GAP_BG}`} />
          <RecentKeywordsSection
            items={recentKeywords}
            onSelect={(kw) => runSearch(kw)}
            onDeleteOne={onDeleteRecentKeyword}
            onDeleteAll={onClearRecentKeywords}
          />
          
          <div className={`h-1 ${SECTION_GAP_BG}`} />

          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#191919]">
                인기 검색어
              </h2>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
              {popularSlots.map((k, idx) => {
                const rank = idx + 1;
                const icon = hasPopularKeywords
                  ? trendIcon(k.previousRank, k.currentRank)
                  : popularStay;

                const clickable =
                  hasPopularKeywords && k.keyword.trim().length > 0;

                return (
                  <button
                    key={k.keywordId}
                    type="button"
                    disabled={!clickable}
                    onClick={() => runSearch(k.keyword)}
                    className={`
                      w-full min-w-0 flex items-center justify-between bg-transparent px-0 py-0
                      ${clickable ? "cursor-pointer" : "cursor-default"}
                    `}
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[12px] font-bold text-[#66021F] flex-shrink-0">
                        {rank}
                      </span>
                      <span className="text-[12px] text-[#191919] min-w-0 truncate">
                        {hasPopularKeywords ? k.keyword : ""}
                      </span>
                    </div>
                    <img
                      src={icon}
                      alt="trend"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`h-1 ${SECTION_GAP_BG}`} />

          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#191919]">
                최근 본 상품
              </h2>
            </div>

            <div className="mt-3">
              {!hasRecentProducts ? (
                <p className="text-[14px] text-[#B9B9B9]">
                  아직 둘러본 상품이 없어요.
                </p>
              ) : (
                <div className="-mx-4 px-4 flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] scroll-smooth">
                  {/* 스크롤바 숨기기, shift+휠로 가로 이동 가능 */}
                  <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                  {recentProducts.slice(0, 6).map((p) => (
                    <div
                      key={p.productId} // snap-start: 카드 단위 스냅
                      className="shrink-0 w-[140px] flex flex-col items-start gap-2 snap-start"
                    >
                      <Product
                        size="sm"
                        productId={p.productId}
                        name={p.name}
                        originalPrice={p.originalPrice}
                        discountRate={p.discountRate}
                        imageUrl={p.imageUrl}
                        productUrl={p.productUrl}
                        status={p.status}
                        onToggleLike={onToggleRecentProductLike}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 자동완성: 1글자 이상 입력 시 200ms 디바운싱 후 실시간 노출 */}
        {shouldShowAutocomplete && (
          <div
            className="absolute inset-0 bg-white pt-[72px] z-40"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="px-4 py-2">
              {recommends.length > 0 ? (
                recommends.slice(0, 10).map((item) => (
                  <button
                    key={item.keywordId}
                    type="button"
                    className="w-full h-[44px] flex items-center text-left gap-3"
                    onClick={() => runSearch(item.keyword)}
                  >
                    <img src={clueIcon} alt="" className="w-4 h-4 shrink-0" />
                    <span className="text-[16px] text-[#191919]">
                      {renderHighlighted(item.keyword, trimmed)}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-4 text-center text-[14px] text-[#B9B9B9]">
                  추천 검색어가 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
