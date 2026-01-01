import type { FilterTab, PriceMode, RatingMode } from "./types";

export const SHEET_HEIGHT = {
  price: { all: 438, configured: 482 },
  rating: { all: 368, configured: 412 },
} as const;

export const OVERLAY_CLASS =
  "fixed left-1/2 top-0 -translate-x-1/2 w-[390px] h-[100dvh] bg-black/60";

export const SHEET_CLASS =
  "fixed left-1/2 bottom-0 -translate-x-1/2 w-[390px] z-[70] rounded-t-[20px] bg-white overflow-hidden flex flex-col";

export function isConfigured(mode: PriceMode | RatingMode) {
  return mode !== "all";
}

export function getSheetHeight(tab: FilterTab, mode: PriceMode | RatingMode) {
  const configured = isConfigured(mode);
  const base =
    tab === "price"
      ? configured
        ? SHEET_HEIGHT.price.configured
        : SHEET_HEIGHT.price.all
      : configured
        ? SHEET_HEIGHT.rating.configured
        : SHEET_HEIGHT.rating.all;

  return base + 20;
}
