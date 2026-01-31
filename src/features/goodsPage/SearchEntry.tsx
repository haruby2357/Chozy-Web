import { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar2 from "../../components/SearchBar2";
import Product from "./components/Product";

import recentCancel from "../../assets/goodsPage/search/recentsearch_cancel.svg";
import popularUp from "../../assets/goodsPage/search/popular_up.svg";
import popularDown from "../../assets/goodsPage/search/popular_down.svg";
import popularStay from "../../assets/goodsPage/search/popular_stay.svg";
import clueIcon from "../../assets/goodsPage/search/clue.svg";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result?: T;
};

type RecentKeyword = {
  keywordId: number;
  keyword: string;
};

type PopularKeyword = {
  keywordId: number;
  keyword: string;
  previousRank: number;
  currentRank: number;
};

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

type RecommendKeyword = {
  keywordId: number;
  keyword: string;
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
      <span
        key={`hit-${i}`}
        className="text-[#800020] font-semibold"
      >
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

  const hasRecentKeywords = recentKeywords.length > 0;
  const hasPopularKeywords = popularKeywords.length > 0;
  const hasRecentProducts = recentProducts.length > 0;

  const [isComposing, setIsComposing] = useState(false); //한글 입력 조합 상태

  const [recommends, setRecommends] = useState<RecommendKeyword[]>([]);

  const trimmed = query.trim();
  const isBlankOnly = query.length > 0 && trimmed.length === 0;

  const shouldShowAutocomplete = trimmed.length >= 1 && !isBlankOnly; // 자동완성 노출 조건 : 1글자 이상 + 공백만 입력 제외

  const popularSlots = useMemo(() => {
    if (hasPopularKeywords) return popularKeywords.slice(0, 8);
    return Array.from({ length: 8 }).map((_, idx) => ({
      keywordId: -1 * (idx + 1),
      keyword: "",
      previousRank: 0,
      currentRank: 0,
    }));
  }, [hasPopularKeywords, popularKeywords]);

  const fetchJson = async <T,>(
    url: string,
    signal?: AbortSignal,
  ): Promise<T> => {
    const res = await fetch(url, { signal });
    const data = (await res.json()) as ApiResponse<T>;
    return (data.result ?? ([] as unknown as T)) as T;
  };

  const loadSections = useCallback(async () => {
    const [recent, popular, products] = await Promise.all([
      fetchJson<RecentKeyword[]>("/home/search/recent"),
      fetchJson<PopularKeyword[]>("/home/search/popular"),
      fetchJson<RecentProduct[]>("/home/products/recent"),
    ]);

    setRecentKeywords((recent ?? []).slice(0, 10));
    setPopularKeywords((popular ?? []).slice(0, 8));
    setRecentProducts((products ?? []).slice(0, 6));
  }, []);

  useEffect(() => {
    // SearchEntry 진입 시 기본 섹션 데이터 로드
    const id = window.setTimeout(() => {
      void loadSections();
    }, 0);

    return () => window.clearTimeout(id);
  }, [loadSections]);


  useEffect(() => {
    // 자동완성 숨김 조건
    if (!shouldShowAutocomplete || isComposing) {
      const id = window.setTimeout(() => {
        setRecommends([]);
      }, 0);
      return () => window.clearTimeout(id);
    }

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const list = await fetchJson<RecommendKeyword[]>(
            `/home/search/recommend?keyword=${encodeURIComponent(trimmed)}`,
          );
          const id = window.setTimeout(() => {
            setRecommends((list ?? []).slice(0, 10));
          }, 0);
          return () => window.clearTimeout(id);
        } catch {
          const id = window.setTimeout(() => {
            setRecommends([]);
          }, 0);
          return () => window.clearTimeout(id);
        }
      })();
    }, 200);

    return () => window.clearTimeout(timer);
  }, [shouldShowAutocomplete, isComposing, trimmed]);


  const saveSearchKeyword = async (keyword: string) => {
    // “검색 결과 화면으로 이동할 때” 1회 API 호출
    // Enter / 최근검색어 클릭 / 인기검색어 클릭 / (향후 자동완성 선택)
    await fetch("/home/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    }).catch(() => {});
  };

  const goToResults = (keyword: string) => {
    const url = `/home/products?search=${encodeURIComponent(keyword)}&source=manual`;
    navigate(url);
  };

  const runSearch = async (rawKeyword: string) => {
    const keyword = rawKeyword.trim();
    if (!keyword) return;

    await saveSearchKeyword(keyword);
    goToResults(keyword);
  };

  const onDeleteRecentKeyword = (keywordId: number) => {
    // 백엔드 삭제 API 명세가 없으므로 이번 PR에서는 클라이언트 state에서만 삭제 반영 -> 삭제 API 요청
    setRecentKeywords((prev) => prev.filter((k) => k.keywordId !== keywordId));
  };

  const onToggleRecentProductLike = (productId: number) => {
    setRecentProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, status: !p.status } : p,
      ),
    );
  };

  return (
    <div className="relative w-[390px] mx-auto bg-white min-h-screen">
      <SearchBar2
        autoFocus
        backBehavior="BACK"
        value={query}
        onChange={setQuery}
        onSubmitQuery={(q) => runSearch(q)}
        onCompositionChange={setIsComposing}
      />

      <main className="pt-[72px]">
        <section className="bg-white">
          <div className={`h-1 ${SECTION_GAP_BG}`} />
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#191919]">
                최근 검색어
              </h2>
            </div>

            <div className="mt-3">
              {!hasRecentKeywords ? (
                <p className="text-[14px] text-[#B9B9B9]">
                  검색 내역이 없어요.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {recentKeywords.slice(0, 10).map((k) => (
                    <li
                      key={k.keywordId}
                      className="flex items-center justify-between"
                    >
                      <button
                        type="button"
                        className="text-left text-[14px] text-[#191919] flex-1"
                        onClick={() => runSearch(k.keyword)}
                      >
                        {k.keyword}
                      </button>

                      <button
                        type="button"
                        aria-label="최근 검색어 삭제"
                        onClick={() => onDeleteRecentKeyword(k.keywordId)}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <img src={recentCancel} alt="삭제" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={`h-1 ${SECTION_GAP_BG}`} />

          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#191919]">
                인기 검색어
              </h2>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-[24px] gap-y-3">
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
                      w-[165px] flex items-center justify-between bg-transparent px-0 py-0
                      ${clickable ? "cursor-pointer" : "cursor-default"}
                    `}
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[12px] font-bold text-[#66021F]">
                        {rank}
                      </span>
                      <span className="text-[12px] text-[#191919] truncate">
                        {hasPopularKeywords ? k.keyword : ""}
                      </span>
                    </div>
                    <img src={icon} alt="trend" className="w-4 h-4 shrink-0" />
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
                        rating={p.rating}
                        reviewCount={p.reviewCount}
                        deliveryFee={p.deliveryFee}
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

        {/* 입력 중일때->자동완성 오버레이 : 현재는 스페이스바 눌러야 인식 가능, 이후 시간 여유 있으면 수정 */} 
        {shouldShowAutocomplete && !isComposing && (
          <div className="absolute inset-0 bg-white pt-[72px]">
            {/* 0개면 빈 화면 */}
            <div className="px-4 py-2">
              {recommends.slice(0, 10).map((item) => (
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
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
