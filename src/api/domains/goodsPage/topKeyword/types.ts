export type ApiPopularKeyword = {
  keywordId: number;
  keyword: string;
  previousRank: number;
  currentRank: number;
};

export type KeywordRankDiff = "UP" | "DOWN" | "SAME" | "NEW";

export type UiPopularKeyword = {
  keywordId: number;
  keyword: string;
  previousRank: number;
  currentRank: number;
  diff: KeywordRankDiff;
  delta: number;
};
