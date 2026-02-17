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
    .map((img) => img.imageUrl)
    .filter(Boolean);

  // 서버 myState -> UI myState
  const uiMyState = s.myState
    ? {
        reaction: s.myState.reactionType,
        isbookmarked: s.myState.bookmarked,
        isreposted: s.myState.reposted,
      }
    : DEFAULT_MY_STATE;

  // UI 공통 베이스
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

  // 인용
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

  // POST
  if (s.contentType === "POST") {
    return {
      ...uiBase,
      type: "POST",
      content: {
        text: s.contents.text ?? "",
        contentImgs,
        quote: uiQuote,
      },
    };
  }

  // REVIEW
  const review = s.contents.review ?? null;

  return {
    ...uiBase,
    type: "REVIEW",
    content: {
      vendor: review?.vendor ?? "",
      title: review?.title ?? "",
      rating: review?.rating ?? 0,
      productUrl: review?.productUrl ?? null,
      text: s.contents.text ?? "",
      contentImgs,
      quote: uiQuote,

      ...(uiQuote
        ? {
            quoteContent: {
              vendor: review?.vendor ?? "",
              title: review?.title ?? "",
              rating: review?.rating ?? 0,
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
    },
  };
}
