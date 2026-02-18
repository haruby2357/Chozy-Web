export interface LikeItem {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  status: boolean;
}

export interface LikesPage {
  items: LikeItem[];
  page: number;
  size: number;
  hasNext: boolean;
}

export interface LikesResult {
  result: LikesPage;
}

export interface LikesResponse {
  code: number;
  message: string;
  timestamp: string;
  result: LikesResult;
  success: boolean;
}
