import { http, HttpResponse } from "msw";

const ok = (result: unknown) => ({
  isSuccess: true,
  code: 1000,
  message: "요청에 성공하였습니다.",
  timestamp: new Date().toISOString(),
  result,
});

type Category =
  | "FASHION"
  | "BEAUTY"
  | "HOBBY"
  | "TOYS"
  | "HOME"
  | "PET"
  | "ELECTRONICS"
  | "AUTOMOTIVE";

type Sort = "RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "RATING";

type Product = {
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

type ProductInternal = Product & { category: Category };

//ESLINT 문법 비활성화 -> ESLINT가 값 버리기가 안되서 조치
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const omitCategory = ({ category, ...rest }: ProductInternal): Product => rest;

const finalPrice = (p: ProductInternal) =>
  Math.round((p.originalPrice * (100 - p.discountRate)) / 100);

const num = (v: string | null, fallback?: number) => {
  if (v === null || v.trim() === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const isCategory = (v: string | null): v is Category =>
  v === "FASHION" ||
  v === "BEAUTY" ||
  v === "HOBBY" ||
  v === "TOYS" ||
  v === "HOME" ||
  v === "PET" ||
  v === "ELECTRONICS" ||
  v === "AUTOMOTIVE";

const isSort = (v: string | null): v is Sort =>
  v === "RELEVANCE" ||
  v === "PRICE_ASC" ||
  v === "PRICE_DESC" ||
  v === "RATING";

const relevanceScore = (name: string, q: string) => {
  const idx = name.indexOf(q);
  return idx < 0 ? -1 : 1000 - idx;
};

const PRODUCTS: ProductInternal[] = [
  {
    productId: 1,
    category: "FASHION",
    name: "니트 라운드넥 스웨터",
    originalPrice: 59000,
    discountRate: 30,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.6,
    reviewCount: 1240,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 2,
    category: "FASHION",
    name: "가을 오버핏 후드",
    originalPrice: 49000,
    discountRate: 10,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.1,
    reviewCount: 320,
    deliveryFee: 3000,
    status: false,
  },
  {
    productId: 3,
    category: "FASHION",
    name: "트위드 자켓",
    originalPrice: 129000,
    discountRate: 15,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.8,
    reviewCount: 980,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 4,
    category: "FASHION",
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
    category: "FASHION",
    name: "레이어드 티셔츠",
    originalPrice: 29000,
    discountRate: 0,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 3.6,
    reviewCount: 82,
    deliveryFee: 3000,
    status: true,
  },
  {
    productId: 6,
    category: "BEAUTY",
    name: "니아신아마이드 세럼 10%",
    originalPrice: 18000,
    discountRate: 20,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.7,
    reviewCount: 5020,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 7,
    category: "BEAUTY",
    name: "수분 진정 크림",
    originalPrice: 22000,
    discountRate: 40,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.0,
    reviewCount: 410,
    deliveryFee: 3000,
    status: false,
  },
  {
    productId: 8,
    category: "BEAUTY",
    name: "비타민C 앰플",
    originalPrice: 27000,
    discountRate: 10,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 3.9,
    reviewCount: 210,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 9,
    category: "BEAUTY",
    name: "니치 향수 30ml",
    originalPrice: 59000,
    discountRate: 5,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.3,
    reviewCount: 95,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 10,
    category: "ELECTRONICS",
    name: "무선 이어폰",
    originalPrice: 79000,
    discountRate: 35,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.2,
    reviewCount: 1440,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 11,
    category: "ELECTRONICS",
    name: "휴대폰 케이스",
    originalPrice: 15000,
    discountRate: 0,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 3.3,
    reviewCount: 70,
    deliveryFee: 3000,
    status: false,
  },
  {
    productId: 12,
    category: "ELECTRONICS",
    name: "기계식 키보드",
    originalPrice: 99000,
    discountRate: 20,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.9,
    reviewCount: 820,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 13,
    category: "HOME",
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
    productId: 14,
    category: "HOME",
    name: "방한 담요",
    originalPrice: 25000,
    discountRate: 30,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.4,
    reviewCount: 520,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 15,
    category: "PET",
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
  {
    productId: 16,
    category: "HOBBY",
    name: "니퍼 공구 세트",
    originalPrice: 32000,
    discountRate: 5,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.0,
    reviewCount: 140,
    deliveryFee: 0,
    status: false,
  },
  {
    productId: 17,
    category: "TOYS",
    name: "미니 블록 세트",
    originalPrice: 27000,
    discountRate: 20,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 3.8,
    reviewCount: 65,
    deliveryFee: 3000,
    status: false,
  },
  {
    productId: 18,
    category: "AUTOMOTIVE",
    name: "차량용 거치대",
    originalPrice: 19000,
    discountRate: 0,
    imageUrl: "/src/assets/goodsPage/examProd.svg",
    productUrl: "https://www.naver.com/",
    rating: 4.2,
    reviewCount: 510,
    deliveryFee: 0,
    status: false,
  },
];

const RECENT_VIEWED: Product[] = PRODUCTS.slice(0, 10).map(omitCategory);

const RECENT_KEYWORDS = [
  { keywordId: 101, keyword: "가을 상의" },
  { keywordId: 102, keyword: "크리스마스 니트" },
  { keywordId: 103, keyword: "폰케이스" },
  { keywordId: 104, keyword: "자켓" },
  { keywordId: 105, keyword: "니트 가디건" },
  { keywordId: 106, keyword: "방한용품" },
  { keywordId: 107, keyword: "겨울 장갑" },
  { keywordId: 108, keyword: "겨울목도리" },
  { keywordId: 109, keyword: "니트 원피스" },
  { keywordId: 110, keyword: "레이어드티" },
  { keywordId: 111, keyword: "니아신아마이드" },
  { keywordId: 112, keyword: "향수" },
  { keywordId: 113, keyword: "무선 이어폰" },
  { keywordId: 114, keyword: "담요" },
  { keywordId: 115, keyword: "강아지 옷" },
];

const POPULAR_KEYWORDS = [
  { keywordId: 201, keyword: "가을상의", previousRank: 3, currentRank: 1 },
  { keywordId: 202, keyword: "겨울목도리", previousRank: 2, currentRank: 2 },
  { keywordId: 203, keyword: "겨울 장갑", previousRank: 1, currentRank: 3 },
  { keywordId: 204, keyword: "방한용품", previousRank: 4, currentRank: 4 },
  { keywordId: 205, keyword: "겨울원피스", previousRank: 6, currentRank: 5 },
  { keywordId: 206, keyword: "레이어드티", previousRank: 5, currentRank: 6 },
  { keywordId: 207, keyword: "앙고라가디건", previousRank: 10, currentRank: 7 },
  { keywordId: 208, keyword: "트위드자켓", previousRank: 8, currentRank: 8 },
  { keywordId: 209, keyword: "니트", previousRank: 9, currentRank: 9 },
  { keywordId: 210, keyword: "폰케이스", previousRank: 7, currentRank: 10 },
  { keywordId: 211, keyword: "니트 가디건", previousRank: 14, currentRank: 11 },
  { keywordId: 212, keyword: "니트 원피스", previousRank: 12, currentRank: 12 },
  {
    keywordId: 213,
    keyword: "니아신아마이드",
    previousRank: 15,
    currentRank: 13,
  },
  { keywordId: 214, keyword: "무선 이어폰", previousRank: 11, currentRank: 14 },
  { keywordId: 215, keyword: "향수", previousRank: 13, currentRank: 15 },
];

const RECOMMEND_KEYWORDS = [
  { keywordId: 301, keyword: "니트" },
  { keywordId: 302, keyword: "니트 가디건" },
  { keywordId: 303, keyword: "니트 원피스" },
  { keywordId: 304, keyword: "니트 조끼" },
  { keywordId: 305, keyword: "니트 베스트" },
  { keywordId: 306, keyword: "니트 머플러" },
  { keywordId: 307, keyword: "니트 스커트" },
  { keywordId: 308, keyword: "니트 팬츠" },
  { keywordId: 309, keyword: "니치 향수" },
  { keywordId: 310, keyword: "니아신아마이드" },
  { keywordId: 311, keyword: "미니 니트백" },
  { keywordId: 312, keyword: "가을 상의" },
  { keywordId: 313, keyword: "트위드자켓" },
  { keywordId: 314, keyword: "겨울목도리" },
  { keywordId: 315, keyword: "무선 이어폰" },
  { keywordId: 316, keyword: "방한용품" },
];

export const handlers = [
  // GET 요청: 데이터 가져오기 (ex. 사용자 프로필)
  http.get("https://api.example.com/user", () => {
    console.log("MSW: 가짜 유저 데이터를 보냅니다!");
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),

  // POST 요청: 데이터 보내기 (ex. 로그인)
  http.post("https://api.example.com/login", async ({ request }) => {
    const info = await request.json();
    console.log("MSW: 로그인 요청을 받았습니다:", info);

    return HttpResponse.json(
      { message: "로그인 성공!", user: info },
      { status: 201 }
    );
  }),

  // 상품 목록 조회
  // query: category | search, sort, minPrice, maxPrice, minRating, maxRating
  // response: 전체 반환
  http.get("/home/products", ({ request }) => {
    const url = new URL(request.url);

    const categoryParam = url.searchParams.get("category");
    const searchParam = (url.searchParams.get("search") ?? "")
      .replace(/^"|"$/g, "")
      .trim();

    const sortParam = url.searchParams.get("sort");
    const sort: Sort = isSort(sortParam) ? sortParam : "RELEVANCE";

    const minPrice = num(url.searchParams.get("minPrice"));
    const maxPrice = num(url.searchParams.get("maxPrice"));
    const minRating = num(url.searchParams.get("minRating"));
    const maxRating = num(url.searchParams.get("maxRating"));

    const category = isCategory(categoryParam) ? categoryParam : undefined;

    let items = [...PRODUCTS];

    if (category) {
      items = items.filter((p) => p.category === category);
    } else if (searchParam) {
      items = items.filter((p) => p.name.includes(searchParam));
    }

    if (minPrice !== undefined)
      items = items.filter((p) => finalPrice(p) >= minPrice);
    if (maxPrice !== undefined)
      items = items.filter((p) => finalPrice(p) <= maxPrice);

    if (minRating !== undefined)
      items = items.filter((p) => p.rating >= minRating);
    if (maxRating !== undefined)
      items = items.filter((p) => p.rating <= maxRating);

    if (sort === "PRICE_ASC") {
      items.sort((a, b) => finalPrice(a) - finalPrice(b));
    } else if (sort === "PRICE_DESC") {
      items.sort((a, b) => finalPrice(b) - finalPrice(a));
    } else if (sort === "RATING") {
      items.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
    } else {
      if (searchParam) {
        items.sort((a, b) => {
          const sa = relevanceScore(a.name, searchParam);
          const sb = relevanceScore(b.name, searchParam);
          if (sb !== sa) return sb - sa;
          return b.rating - a.rating;
        });
      } else {
        items.sort(
          (a, b) =>
            b.rating - a.rating ||
            b.reviewCount - a.reviewCount ||
            a.productId - b.productId
        );
      }
    }

    const result: Product[] = items.map(omitCategory);

    return HttpResponse.json(ok(result));
  }),

  // 최근 본 상품 조회
  // response: 10개
  http.get("/home/products/recent", () => {
    return HttpResponse.json(ok(RECENT_VIEWED));
  }),

  // 최근 검색어 조회
  // response: 최대 10개
  http.get("/home/search/recent", () => {
    return HttpResponse.json(ok(RECENT_KEYWORDS.slice(0, 10)));
  }),

  // 인기 검색어 조회
  // response: 최대 10개
  http.get("/home/search/popular", () => {
    return HttpResponse.json(ok(POPULAR_KEYWORDS.slice(0, 10)));
  }),

  // 검색어 자동 완성
  // query: keyword
  // response: 최대 10개
  http.get("/home/search/recommed", ({ request }) => {
    const url = new URL(request.url);
    const keyword = (url.searchParams.get("keyword") ?? "")
      .replace(/^"|"$/g, "")
      .trim();

    const filtered = keyword
      ? RECOMMEND_KEYWORDS.filter((k) => k.keyword.includes(keyword))
      : RECOMMEND_KEYWORDS;

    return HttpResponse.json(ok(filtered.slice(0, 10)));
  }),
];

// 커뮤니티 게시글 목록 조회
type FeedTab = "RECOMMEND" | "FOLLOWING";
type FeedContentType = "ALL" | "POST" | "REVIEW";
type Reaction = "LIKE" | "DISLIKE" | "NONE";

type FeedUser = {
  profileImg: string;
  userName: string;
  userId: string;
};

type PostContent = {
  text: string;
  contentImgs: string[];
};

type FeedCounts = {
  comments: number;
  likes: number;
  dislikes: number;
  quotes: number;
};

type FeedMyState = {
  reaction: Reaction;
  isbookmarked: boolean;
  isreposted: boolean;
};

type ReviewContentBase = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs?: string[];
};

type QuotedReviewContent = ReviewContentBase & {
  user: FeedUser;
};

type ReviewContent = ReviewContentBase & {
  quoteContent?: QuotedReviewContent;
};

type FeedItemBase = {
  feedId: number;
  user: FeedUser;
  counts: FeedCounts;
  myState: FeedMyState;
};

type FeedItem =
  | (FeedItemBase & { type: "POST"; content: PostContent })
  | (FeedItemBase & { type: "REVIEW"; content: ReviewContent });

const fail = () => ({
  isSuccess: true,
  code: 4000,
  message: "요청에 실패했습니다.",
  timestamp: new Date().toISOString(),
});

const isFeedTab = (v: string | null): v is FeedTab =>
  v === "RECOMMEND" || v === "FOLLOWING";

const isFeedContentType = (v: string | null): v is FeedContentType =>
  v === "ALL" || v === "POST" || v === "REVIEW";

const FEEDS: FeedItem[] = [
  {
    feedId: 1,
    type: "POST",
    user: {
      profileImg: "https://cdn.example.com/users/12/profile.jpg",
      userName: "이수아",
      userId: "KUIT_PM",
    },
    content: {
      text: "자력도 짱짱하고 디자인도 깔끔합니다. 로켓배송이라 다음 날 받아서 설치했네요 가격은 좀 있지만 제품은 좋아요~ 구매 추천합니다.",
      contentImgs: [
        "/src/assets/goodsPage/examProd.svg",
        "/src/assets/goodsPage/examProd.svg",
        "/src/assets/goodsPage/examProd.svg",
      ],
    },
    counts: {
      comments: 67,
      likes: 67,
      dislikes: 67,
      quotes: 67,
    },
    myState: {
      reaction: "LIKE", // LIKE | DISLIKE | NONE
      isbookmarked: false,
      isreposted: true,
    },
  },
  {
    feedId: 2,
    type: "REVIEW",
    user: {
      profileImg: "https://cdn.example.com/users/12/profile.jpg",
      userName: "이수아",
      userId: "KUIT_PM",
    },
    content: {
      vendor: "알리",
      title: "Toocki 67W GaN USB C 충전기",
      rating: 4.0,
      text: "노트북이랑 휴대폰을 같이 충전할 수 있는 충전기를 찾다가 구매했어요. 여러 기기를 동시에 연결해도 발열이 심하지 않고 충전 속도도 안정적인 편이라 만족하면서 쓰고 있습니다. 크기가 생각보다 작아서 가방에 넣고 다니기에도 부담 없고, 콘센트에 꽂았을 때도 흔들림이 크지 않아서 좋았어요. 케이블을 여러 개 챙기지 않아도 된다는 점이 특히 편리했고, 디자인도 과하지 않아서 어디에 두어도 잘 어울립니다. 아직 오래 사용한 건 아니지만 지금까지는 전반적으로 만족스러운 제품이에요. \n\n노트북이랑 휴대폰을 같이 충전할 수 있는 충전기를 찾다가 구매했어요. 여러 기기를 동시에 연결해도 발열이 심하지 않고 충전 속도도 안정적인 편이라 만족하면서 쓰고 있습니다. 크기가 생각보다 작아서 가방에 넣고 다니기에도 부담 없고, 콘센트에 꽂았을 때도 흔들림이 크지 않아서 좋았어요.",
      contentImgs: ["/src/assets/goodsPage/examProd.svg"],
    },
    counts: {
      comments: 67,
      likes: 67,
      dislikes: 67,
      quotes: 67,
    },
    myState: {
      reaction: "DISLIKE", // LIKE | DISLIKE | NONE
      isbookmarked: true,
      isreposted: true,
    },
  },
  {
    feedId: 3,
    type: "REVIEW",
    user: {
      profileImg: "https://cdn.example.com/users/12/profile.jpg",
      userName: "이수아",
      userId: "KUIT_PM",
    },
    content: {
      vendor: "알리",
      title: "Toocki 67W GaN USB C 충전기",
      rating: 4.5,
      text: "자력도 짱짱하고 디자인도 깔끔합니다. 로켓배송이라 다음 날 받아서 설치했네요 가격은 좀 있지만 제품은 좋아요~ 구매 추천합니다.",
      quoteContent: {
        user: {
          profileImg: "https://cdn.example.com/users/12/profile.jpg",
          userName: "이수아",
          userId: "KUIT_PM",
        },
        vendor: "알리",
        title: "Toocki 67W GaN USB C 충전기",
        rating: 4.0,
        text: "자력도 짱짱하고 디자인도 깔끔합니다. 로켓배송이라 다음 날 받아서 설치했네요 가격은 좀 있지만 제품은 좋아요~ 구매 추천합니다.",
        contentImgs: [
          "/src/assets/goodsPage/examProd.svg",
          "/src/assets/goodsPage/examProd.svg",
          "/src/assets/goodsPage/examProd.svg",
        ],
      },
    },
    counts: {
      comments: 67,
      likes: 67,
      dislikes: 67,
      quotes: 67,
    },
    myState: {
      reaction: "NONE", // LIKE | DISLIKE | NONE
      isbookmarked: true,
      isreposted: true,
    },
  },
];

// 커뮤니티 피드 조회
// path: /community/feeds?tab={tab}&contentType={contentType}
// tab: RECOMMEND | FOLLOWING
// contentType: ALL | POST | REVIEW
handlers.push(
  http.get("/community/feeds", ({ request }) => {
    const url = new URL(request.url);

    const tabParam = url.searchParams.get("tab");
    const contentTypeParam = url.searchParams.get("contentType");

    // 유효성 검사 실패 -> 실패 응답
    if (!isFeedTab(tabParam) || !isFeedContentType(contentTypeParam)) {
      return HttpResponse.json(fail(), { status: 400 });
    }

    // tab에 따라 다른 데이터 주고 싶으면 여기에서 분기 가능
    // (일단은 동일 데이터 반환)
    let items = [...FEEDS];

    if (contentTypeParam === "POST") {
      items = items.filter((f) => f.type === "POST");
    } else if (contentTypeParam === "REVIEW") {
      items = items.filter((f) => f.type === "REVIEW");
    }

    return HttpResponse.json(ok(items));
  })
);

// 커뮤니티 게시글 상세보기
type PostContentDetail = {
  text: string;
  contentImgs: string[];
  hashTags: string[]; // "#a #b ..."
};

type ReviewContentDetail = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs: string[];
  hashTags: string[];
};

type FeedDetail =
  | {
      feedId: number;
      type: "POST";
      user: FeedUser;
      content: PostContentDetail;
      counts: FeedCounts;
      myState: FeedMyState;
    }
  | {
      feedId: number;
      type: "REVIEW";
      user: FeedUser;
      content: ReviewContentDetail;
      counts: FeedCounts;
      myState: FeedMyState;
    };

// type ApiResponse<T> = {
//   isSuccess: boolean;
//   code: number;
//   message: string;
//   timestamp: string;
//   result: T;
// };

type CommentItem = {
  commentId: number;
  user: FeedUser;
  quote: string; // "아이디" 같은 값
  content: string;
  counts: FeedCounts;
  myState: FeedMyState;
  createdAt: string;
  // 대댓글
  comment?: CommentItem[];
};

type FeedDetailResult = {
  feed: FeedDetail;
  comments: CommentItem[];
};

// key = feedId
const FEED_DETAIL_MAP: Record<number, FeedDetailResult> = {
  1: {
    feed: {
      feedId: 1,
      type: "POST",
      user: {
        profileImg: "https://cdn.example.com/users/12/profile.jpg",
        userName: "이수아",
        userId: "KUIT_PM",
      },
      content: {
        text: "자력도 짱짱하고 디자인도 깔끔합니다. 로켓배송이라 다음 날 받아서 설치했네요 가격은 좀 있지만 제품은 좋아요~ 구매 추천합니다.",
        contentImgs: [
          "/src/assets/goodsPage/examProd.svg",
          "/src/assets/goodsPage/examProd.svg",
          "/src/assets/goodsPage/examProd.svg",
        ],
        hashTags: [
          "#제품명이미지",
          "#제품명이미지",
          "#제품명이미지",
          "#제품명이미지",
        ],
      },
      counts: { comments: 67, likes: 67, dislikes: 67, quotes: 67 },
      myState: { reaction: "LIKE", isbookmarked: true, isreposted: true },
    },
    comments: [],
  },
  2: {
    feed: {
      feedId: 2,
      type: "REVIEW",
      user: {
        profileImg: "https://cdn.example.com/users/12/profile.jpg",
        userName: "이수아",
        userId: "KUIT_PM",
      },
      content: {
        vendor: "알리",
        title: "Toocki 67W GaN USB C 충전기",
        rating: 4.0,
        text: "노트북이랑 휴대폰을 같이 충전할 수 있는 충전기를 찾다가 구매했어요. 여러 기기를 동시에 연결해도 발열이 심하지 않고 충전 속도도 안정적인 편이라 만족하면서 쓰고 있습니다. 크기가 생각보다 작아서 가방에 넣고 다니기에도 부담 없고, 콘센트에 꽂았을 때도 흔들림이 크지 않아서 좋았어요. 케이블을 여러 개 챙기지 않아도 된다는 점이 특히 편리했고, 디자인도 과하지 않아서 어디에 두어도 잘 어울립니다. 아직 오래 사용한 건 아니지만 지금까지는 전반적으로 만족스러운 제품이에요. \n\n노트북이랑 휴대폰을 같이 충전할 수 있는 충전기를 찾다가 구매했어요. 여러 기기를 동시에 연결해도 발열이 심하지 않고 충전 속도도 안정적인 편이라 만족하면서 쓰고 있습니다. 크기가 생각보다 작아서 가방에 넣고 다니기에도 부담 없고, 콘센트에 꽂았을 때도 흔들림이 크지 않아서 좋았어요.",
        contentImgs: [
          "/src/assets/goodsPage/examProd.svg",
          "/src/assets/goodsPage/examProd.svg",
          "/src/assets/goodsPage/examProd.svg",
        ],
        hashTags: [
          "#제품명이미지",
          "#제품명이미지",
          "#제품명이미지",
          "#제품명이미지",
        ],
      },
      counts: { comments: 67, likes: 67, dislikes: 67, quotes: 67 },
      myState: { reaction: "LIKE", isbookmarked: true, isreposted: true },
    },
    comments: [
      {
        commentId: 1,
        user: {
          profileImg: "https://cdn.example.com/users/12/profile.jpg",
          userName: "이수아",
          userId: "KUIT_PM",
        },
        quote: "아이디",
        content: "감사합니다~~",
        counts: { comments: 0, likes: 1, dislikes: 0, quotes: 0 },
        myState: { reaction: "LIKE", isbookmarked: false, isreposted: false },
        createdAt: "2025-02-19T23:35:34.861172",
      },
      {
        commentId: 2,
        user: {
          profileImg: "/src/assets/goodsPage/examProd.svg",
          userName: "이수아",
          userId: "KUIT_PM",
        },
        quote: "아이디",
        content: "감사합니다~~",
        counts: { comments: 2, likes: 0, dislikes: 0, quotes: 0 },
        myState: { reaction: "NONE", isbookmarked: false, isreposted: false },
        createdAt: "2026-01-13T23:35:34.861172",
        comment: [
          {
            commentId: 3,
            user: {
              profileImg: "/src/assets/goodsPage/examProd.svg",
              userName: "이수아",
              userId: "KUIT_PM",
            },
            quote: "아이디",
            content: "대댓글 1",
            counts: { comments: 0, likes: 0, dislikes: 0, quotes: 0 },
            myState: {
              reaction: "NONE",
              isbookmarked: false,
              isreposted: false,
            },
            createdAt: "2026-01-16T23:35:34.861172",
          },
          {
            commentId: 4,
            user: {
              profileImg: "/src/assets/goodsPage/examProd.svg",
              userName: "이수아",
              userId: "KUIT_PM",
            },
            quote: "아이디",
            content: "대댓글 2",
            counts: { comments: 0, likes: 0, dislikes: 0, quotes: 0 },
            myState: {
              reaction: "NONE",
              isbookmarked: false,
              isreposted: false,
            },
            createdAt: "2026-01-16T23:35:34.861172",
          },
          {
            commentId: 5,
            user: {
              profileImg: "/src/assets/goodsPage/examProd.svg",
              userName: "이수아",
              userId: "KUIT_PM",
            },
            quote: "아이디",
            content: "대댓글 3",
            counts: { comments: 0, likes: 0, dislikes: 0, quotes: 0 },
            myState: {
              reaction: "NONE",
              isbookmarked: false,
              isreposted: false,
            },
            createdAt: "2026-01-16T23:35:34.861172",
          },
          {
            commentId: 6,
            user: {
              profileImg: "/src/assets/goodsPage/examProd.svg",
              userName: "이수아",
              userId: "KUIT_PM",
            },
            quote: "아이디",
            content: "대댓글 4",
            counts: { comments: 0, likes: 0, dislikes: 0, quotes: 0 },
            myState: {
              reaction: "NONE",
              isbookmarked: false,
              isreposted: false,
            },
            createdAt: "2026-01-16T23:35:34.861172",
          },
        ],
      },
    ],
  },
};

handlers.push(
  http.get("/community/feeds/:feedId/detail", ({ params }) => {
    const id = Number(params.feedId);
    const data = FEED_DETAIL_MAP[id];

    if (!data) {
      return HttpResponse.json(
        {
          isSuccess: true,
          code: 4040,
          message: "존재하지 않는 피드입니다.",
          timestamp: new Date().toISOString(),
          result: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(ok(data), { status: 200 });
  })
);

// 팔로우 요청/취소
// src/mocks/handlers.ts

type FollowStatus = "FOLLOWING" | "NONE";

const followMap = new Map<string, FollowStatus>();
// key: targetUserId, value: status

handlers.push(
  http.post("/users/me/followings/:targetUserId", ({ params }) => {
    const targetUserId = String(params.targetUserId);
    followMap.set(targetUserId, "FOLLOWING");

    return HttpResponse.json(
      {
        targetUserId,
        followStatus: "FOLLOWING",
        requestedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }),

  http.delete("/users/me/followings/:targetUserId", ({ params }) => {
    const targetUserId = String(params.targetUserId);
    followMap.set(targetUserId, "NONE");

    return HttpResponse.json(
      {
        targetUserId,
        followStatus: "NONE",
        unfollowedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  })
);

// 리뷰 작성
// path: /community/reviews/create
// method: POST
handlers.push(
  http.post("/community/reviews/create", async ({ request }) => {
    try {
      const requestBody = (await request.json()) as {
        productUrl: string;
        rating: number;
        content: string;
        img: Array<{ fileName: string; contentType: string }>;
      };

      const { productUrl, rating, content, img } = requestBody;

      // 필수 필드 검증
      if (!productUrl || rating === undefined || !content) {
        return HttpResponse.json(
          {
            isSuccess: false,
            code: 4000,
            message: "요청에 실패했습니다.",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // 성공 응답
      const reviewId = Math.floor(Math.random() * 100000);
      return HttpResponse.json(
        ok({
          reviewId,
          message: "리뷰를 성공적으로 게시했어요.",
        })
      );
    } catch (error) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: 4000,
          message: "요청에 실패했습니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
  })
);
