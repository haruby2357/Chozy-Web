import { http, HttpResponse } from "msw";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result?: T;
};

const ok = <T,>(result: T): ApiResponse<T> => ({
  isSuccess: true,
  code: 1000,
  message: "요청에 성공하였습니다.",
  timestamp: new Date().toISOString(),
  result,
});

const fail = (code = 4000, message = "요청에 실패했습니다."): ApiResponse<never> => ({
  isSuccess: true,
  code,
  message,
  timestamp: new Date().toISOString(),
});

const isEmptyMode = (requestUrl: string) => {
  const url = new URL(requestUrl);
  return url.searchParams.get("mode") === "empty";
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

// stateful (POST로 recent가 갱신되도록)
let nextKeywordId = 1000;

let recentKeywords: RecentKeyword[] = [
  { keywordId: 101, keyword: "가을 상의" },
  { keywordId: 102, keyword: "크리스마스 니트" },
  { keywordId: 103, keyword: "폰케이스" },
  { keywordId: 104, keyword: "자켓" },
];

const popularKeywords: PopularKeyword[] = [
  { keywordId: 201, keyword: "가을상의", previousRank: 3, currentRank: 1 },
  { keywordId: 202, keyword: "겨울목도리", previousRank: 2, currentRank: 2 },
  { keywordId: 203, keyword: "겨울 장갑", previousRank: 1, currentRank: 3 },
  { keywordId: 204, keyword: "방한용품", previousRank: 4, currentRank: 4 },
  { keywordId: 205, keyword: "겨울원피스", previousRank: 6, currentRank: 5 },
  { keywordId: 206, keyword: "레이어드티", previousRank: 5, currentRank: 6 },
  { keywordId: 207, keyword: "앙고라가디건", previousRank: 10, currentRank: 7 },
  { keywordId: 208, keyword: "트위드자켓", previousRank: 8, currentRank: 8 },
];

const recentProducts: RecentProduct[] = [
  {
    productId: 1,
    name: "아디다스 어쩌고저쩌고 신발",
    originalPrice: 36100,
    discountRate: 42,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 3.5,
    reviewCount: 360,
    deliveryFee: 3000,
    status: false,
  },
  {
    productId: 2,
    name: "퓨마 어쩌고저쩌고 신발",
    originalPrice: 36100,
    discountRate: 42,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 3.5,
    reviewCount: 360,
    deliveryFee: 3000,
    status: true,
  },
  {
    productId: 3,
    name: "초록 블라우스",
    originalPrice: 36100,
    discountRate: 42,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 3.5,
    reviewCount: 360,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 4,
    name: "겨울 니트 원피스",
    originalPrice: 89000,
    discountRate: 25,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.4,
    reviewCount: 610,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 5,
    name: "니트 쿠션 커버",
    originalPrice: 19000,
    discountRate: 15,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.1,
    reviewCount: 230,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 6,
    name: "강아지 니트 스웨터",
    originalPrice: 21000,
    discountRate: 10,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.5,
    reviewCount: 310,
    deliveryFee: 3000,
    status: false,
  },
];

const recommendKeywords: RecommendKeyword[] = [
  { keywordId: 301, keyword: "니트" },
  { keywordId: 302, keyword: "크롭 니트" },
  { keywordId: 303, keyword: "니트 가디건" },
  { keywordId: 304, keyword: "니트 원피스" },
  { keywordId: 305, keyword: "니트 조끼" },
  { keywordId: 306, keyword: "니트 베스트" },
  { keywordId: 307, keyword: "니트 머플러" },
  { keywordId: 308, keyword: "니트 스커트" },
  { keywordId: 309, keyword: "니트 팬츠" },
  { keywordId: 310, keyword: "가을 상의" },
  { keywordId: 311, keyword: "트위드자켓" },
  { keywordId: 312, keyword: "겨울목도리" },
];

export const searchHandlers = [
  // POST /home/search (검색 결과 화면으로 이동할 때 "1회만 호출"은 UI에서 보장)
  http.post("/home/search", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      keyword?: unknown;
    };
    const keyword = String(body.keyword ?? "").trim();

    if (!keyword) {
      return HttpResponse.json(fail(4000, "요청에 실패했습니다."), {
        status: 400,
      });
    }

    // 중복 제거 후 prepend, 최대 10개 유지
    recentKeywords = recentKeywords.filter((k) => k.keyword !== keyword);
    recentKeywords.unshift({ keywordId: nextKeywordId++, keyword });
    recentKeywords = recentKeywords.slice(0, 10);

    return HttpResponse.json(ok("검색어가 성공적으로 저장됐습니다."));
  }),

  // GET /home/search/recent
  http.get("/home/search/recent", ({ request }) => {
    if (isEmptyMode(request.url)) return HttpResponse.json(ok([]));
    return HttpResponse.json(ok(recentKeywords.slice(0, 10)));
  }),

  // GET /home/search/popular (8개 고정)
  http.get("/home/search/popular", ({ request }) => {
    if (isEmptyMode(request.url)) return HttpResponse.json(ok([]));
    return HttpResponse.json(ok(popularKeywords.slice(0, 8)));
  }),

  // GET /home/products/recent (6개 제한)
  http.get("/home/products/recent", ({ request }) => {
    if (isEmptyMode(request.url)) return HttpResponse.json(ok([]));
    return HttpResponse.json(ok(recentProducts.slice(0, 6)));
  }),

  // GET /home/search/recommend?keyword=...
  // result: RecommendKeyword[] (최대 10개)
  http.get("/home/search/recommend", ({ request }) => {
    if (isEmptyMode(request.url)) return HttpResponse.json(ok([]));

    const url = new URL(request.url);
    const keyword = (url.searchParams.get("keyword") ?? "")
      .replace(/^"|"$/g, "")
      .trim();

    const filtered = keyword
      ? recommendKeywords.filter((k) => k.keyword.includes(keyword))
      : recommendKeywords;

    return HttpResponse.json(ok(filtered.slice(0, 10)));
  }),
];

