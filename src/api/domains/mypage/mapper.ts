import type { FeedItem as ServerFeedItem } from "../community/feedList";
import type { FeedItem as UiFeedItem } from "../community/feedList/feedUi"; // PostList UI 타입(아래 설명 참고)
import dummyProfile from "../../../assets/all/dummyProfile.svg";

const DEFAULT_MY_STATE = {
  reaction: "NONE" as const,
  isbookmarked: false,
  isreposted: false,
};

export function toUiFeedItem(s: ServerFeedItem): UiFeedItem {
  const contentImgs = (s.contents.images ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((img) => img.imageUrl)
    .filter(Boolean);

  const uiMyState = s.myState
    ? {
        reaction: s.myState.reactionType,
        isbookmarked: s.myState.bookmarked,
        isreposted: s.myState.reposted,
      }
    : DEFAULT_MY_STATE;

  const uiBase = {
    feedId: s.feedId,
    kind: s.kind,
    isMine: s.mine ?? false,
    user: {
      profileImg: s.user.profileImageUrl ?? dummyProfile,
      userName: s.user.name,
      userId: s.user.userId,
    },
    counts: {
      comments: s.counts.commentCount,
      likes: s.counts.likeCount,
      dislikes: s.counts.dislikeCount,
      quotes: s.counts.quoteCount,
    },
    myState: uiMyState,
  } as const;

  const uiQuote = s.contents.quote
    ? {
        feedId: s.contents.quote.feedId,
        user: {
          profileImg: s.contents.quote.user.profileImageUrl ?? dummyProfile,
          userName: s.contents.quote.user.name,
          userId: s.contents.quote.user.userId,
        },
        text: s.contents.quote.text ?? "",
        hashTags: s.contents.quote.hashTags ?? [],
      }
    : undefined;

  const text = (s.contents as any).content ?? (s.contents as any).text ?? "";

  const reviewFromObj = (s.contents as any).review ?? null;
  const reviewFallback =
    s.contentType === "REVIEW"
      ? {
          vendor: (s.contents as any).vendor,
          title: (s.contents as any).title,
          rating: (s.contents as any).rating,
          productUrl: (s.contents as any).productUrl,
        }
      : null;

  const review = reviewFromObj ?? reviewFallback;
  const isReview = s.contentType === "REVIEW" || !!review;

  if (!isReview) {
    return {
      ...uiBase,
      type: "POST",
      content: {
        text,
        contentImgs,
        quote: uiQuote,
        hashTags: s.contents.quote?.hashTags ?? [],
      } as any,
    };
  }

  return {
    ...uiBase,
    type: "REVIEW",
    content: {
      vendor: review?.vendor ?? "",
      title: review?.title ?? "",
      rating: typeof review?.rating === "number" ? review.rating : 0,
      productUrl: review?.productUrl ?? null,

      text,
      contentImgs,
      quote: uiQuote,
      hashTags:
        (s.contents as any).hashTags ?? s.contents.quote?.hashTags ?? [],

      ...(uiQuote
        ? {
            quoteContent: {
              vendor: review?.vendor ?? "",
              title: review?.title ?? "",
              rating: typeof review?.rating === "number" ? review.rating : 0,
              productUrl: review?.productUrl ?? null,
              text: uiQuote.text ?? "",
              contentImgs: [],
              user: {
                profileImg: uiQuote.user.profileImg ?? "",
                userName: uiQuote.user.userName,
                userId: uiQuote.user.userId,
              },
            },
          }
        : {}),
    } as any,
  };
}
