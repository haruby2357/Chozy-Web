// 상품페이지 상품 목록 조회
export type GoodsCategory =
  | "FASHION"
  | "BEAUTY"
  | "HOBBY"
  | "TOYS"
  | "HOME"
  | "PET"
  | "ELECTRONICS"
  | "AUTOMOTIVE";

export type GoodsSort = "RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "RATING";

export type HomeProductsRequest = {
  category?: GoodsCategory;
  search?: string;
  sort?: GoodsSort;

  minPrice?: number;
  maxPrice?: number;

  minRating?: number;
  maxRating?: number;
};

export type HomeProductItem = {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  isFavorited: boolean;
};

export type HomeProductsPage = {
  items: HomeProductItem[];
  page: number;
  size: number;
  hasNext: boolean;
};

export type HomeProductsOuterResult = {
  result: HomeProductsPage;
};
