export type RecommendVendor = "COUPANG" | "ALI" | string;

export type RecommendItem = {
  productId: number;
  vendor: RecommendVendor;
  name: string;
  originalPrice: number;
  discountRate: number;
  discountedPrice: number;
  imageUrl: string;
  productUrl: string;
  isFavorited: boolean;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  size: number;
  hasNext: boolean;
};

export type RecommendResult = {
  result: PagedResult<RecommendItem>;
};
