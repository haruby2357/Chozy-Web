export type ApiResponse<T> = {
  code: number;
  message: string;
  timestamp: string;
  result: T;
  success: boolean;
};

export type RecentKeyword = {
  keywordId: number;
  keyword: string;
};

export type RecentKeywordsResult = {
  keywords: RecentKeyword[];
};

export type PopularKeyword = {
  keywordId: number;
  keyword: string;
  previousRank: number;
  currentRank: number;
};

export type RecommendKeyword = {
  keywordId: number;
  keyword: string;
};

export type RecentProduct = {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  isFavorited: boolean;
};