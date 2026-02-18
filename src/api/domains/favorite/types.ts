export type LikeItem = {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  status: boolean; // 명세상 품절 여부
};

export type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp?: string;
  result: T;
};
