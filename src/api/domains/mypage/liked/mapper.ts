// 마이페이지 설정 - 좋아요 누른 게시글 목록 조회
import type { LikedFeed } from "./types";
import type { FeedItem } from "../../community/feedList/feedUi";
import { toUiFeedItem } from "../mapper";

export function likedFeedToUiFeedItem(feed: LikedFeed): FeedItem {
  const normalized: any = {
    feedId: feed.feedId,
    kind: feed.kind === "ORIGINAL" ? "POST" : feed.kind,
    contentType: feed.contentType,
    createdAt: feed.createdAt,
    user: feed.user,
    contents: {
      text: feed.contents.text,
      feedImages: (feed.contents.images ?? []).map((img) => ({
        imageUrl: img.imageUrl,
        sortOrder: img.sortOrder,
        contentType: img.contentType,
      })),
      hashTags: feed.contents.quote?.hashTags ?? [],

      vendor: feed.contents.review?.vendor ?? null,
      title: feed.contents.review?.title ?? null,
      rating: feed.contents.review?.rating ?? null,
      productUrl: feed.contents.review?.productUrl ?? null,

      quote: feed.contents.quote
        ? {
            feedId: feed.contents.quote.feedId,
            user: feed.contents.quote.user,
            text: feed.contents.quote.text,
            hashTags: feed.contents.quote.hashTags,
          }
        : null,
    },
    counts: feed.counts,
    myState: feed.myState,
    mine: false,
  };

  return toUiFeedItem(normalized);
}
