
// 가격 필터 모드
// - all: 전체 가격대
// - custom: 사용자가 직접 지정한 가격대
// - preset: 미리 정의된 가격대(전체 외 선택지)

export type FilterTab = "price" | "rating";

export type PriceMode = "all" | "preset" | "custom";
export type RatingMode = "all" | "custom";

export type PricePresetKey =
  | "under10k"
  | "1to30k"
  | "30to50k"
  | "50to100k"
  | "over100k";

export type FilterSheetState = {
  tab: FilterTab;
  priceMode: PriceMode;
  ratingMode: RatingMode;
  pricePreset?: PricePresetKey;

  priceMin?: number;
  priceMax?: number;

  ratingMin?: number;
  ratingMax?: number;
};
