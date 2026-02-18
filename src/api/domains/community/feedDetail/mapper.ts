import dummyProfile from "../../../../assets/all/dummyProfile.svg";

import type {
  ApiFeed,
  ApiFeedDetailResult,
  ApiFeedUser,
  ApiComment,
  UiFeedUser,
  UiFeedCounts,
  UiFeedDetail,
  UiCommentItem,
  UiMention,
  UiReplyTo,
  UiFeedDetailResult,
  UiQuote,
} from "./types";

export function pickIsMine(feed: ApiFeed): boolean {
  return Boolean(feed.isMine ?? feed.mine ?? false);
}

function mapApiUser(u: ApiFeedUser): UiFeedUser {
  return {
    profileImg: u.profileImageUrl ?? dummyProfile,
    userName: u.name,
    userId: u.userId,
  };
}

function mapCounts(counts: ApiFeed["counts"]): UiFeedCounts {
  return {
    comments: counts.commentCount,
    likes: counts.likeCount,
    dislikes: counts.dislikeCount,
    quotes: counts.quoteCount,
    views: counts.viewCount,
  };
}

function mapFeed(api: ApiFeed): UiFeedDetail {
  const images =
    (api.contents.feedImages ?? [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((x) => x.imageUrl)
      .filter(Boolean) ?? [];

  const base = {
    feedId: api.feedId,
    user: mapApiUser(api.user),
    counts: mapCounts(api.counts),
    myState: {
      reaction: api.myState.reactionType,
      isbookmarked: api.myState.bookmarked,
      isreposted: api.myState.reposted,
    },
  } as const;

  if (api.contentType === "REVIEW") {
    return {
      ...base,
      type: "REVIEW",
      createdAt: api.createdAt,
      content: {
        vendor: api.contents.vendor ?? "",
        title: api.contents.title ?? "",
        rating: api.contents.rating ?? 0,
        text: api.contents.content ?? "",
        contentImgs: images,
        hashTags: api.contents.hashTags ?? [],
        quote: api.contents.quote ? mapQuote(api.contents.quote) : undefined,
      },
      isMine: api.mine ?? false,
    };
  }

  const type: "POST" | "QUOTE" | "REPOST" =
    api.kind === "QUOTE" ? "QUOTE" : api.kind === "REPOST" ? "REPOST" : "POST";

  return {
    ...base,
    type,
    createdAt: api.createdAt,
    content: {
      text: api.contents.content ?? "",
      contentImgs: images,
      hashTags: api.contents.hashTags ?? [],
      quote: api.contents.quote ? mapQuote(api.contents.quote) : undefined,
    },
    isMine: api.mine ?? false,
  };
}

function mapMentions(ms: ApiComment["mentions"]): UiMention[] {
  return (ms ?? []).map((m) => ({
    userId: m.userId,
    name: m.name,
    startIndex: m.startIndex,
    length: m.length,
  }));
}

function mapReplyTo(rt: ApiComment["replyTo"]): UiReplyTo {
  return rt ? { userId: rt.userId, name: rt.name } : null;
}

function mapComment(c: ApiComment): UiCommentItem {
  const replies = (c.replies ?? []).map(mapComment);

  const replyTo = mapReplyTo(c.replyTo);

  return {
    commentId: c.commentId,
    user: mapApiUser(c.user),

    quote: replyTo?.name ?? "",

    content: c.content,
    replyTo,
    mentions: mapMentions(c.mentions),

    createdAt: c.createdAt,

    counts: {
      comments: c.counts.replyCount,
      likes: c.counts.likeCount,
      dislikes: c.counts.dislikeCount,
      quotes: 0,
    },

    myState: {
      reaction: c.myState.reactionType,
      isbookmarked: false,
      isreposted: false,
    },

    comment: replies,
  };
}

export function mapApiResultToUi(
  result: ApiFeedDetailResult,
): UiFeedDetailResult {
  return {
    feed: mapFeed(result.feed),
    comments: (result.comments ?? []).map(mapComment),
  };
}

function mapQuote(q: any): UiQuote {
  return {
    feedId: q.feedId,
    user: {
      profileImg: q.user?.profileImageUrl ?? "",
      userName: q.user?.name ?? "",
      userId: q.user?.userId ?? "",
    },
    text: q.text ?? "",
    vendor: q.vendor,
    title: q.title,
    rating: q.rating,
    productUrl: q.productUrl ?? null,
    contentImgs: q.contentImgs ?? [],
    // hashTags 쓰려면 UiQuote에 hashTags?: string[] 추가해둔 상태에서만:
    // hashTags: q.hashTags ?? [],
  };
}

export function toUiFeedDetail(apiFeed: any): UiFeedDetail {
  const base = {
    feedId: apiFeed.feedId,
    createdAt: apiFeed.createdAt,
    isMine: !!apiFeed.mine,

    user: {
      profileImg: apiFeed.user?.profileImageUrl ?? "",
      userName: apiFeed.user?.name ?? "",
      userId: apiFeed.user?.userId ?? "",
    },

    counts: {
      comments: apiFeed.counts?.commentCount ?? 0,
      likes: apiFeed.counts?.likeCount ?? 0,
      dislikes: apiFeed.counts?.dislikeCount ?? 0,
      quotes: apiFeed.counts?.quoteCount ?? 0,
      views: apiFeed.counts?.viewCount ?? 0,
    },

    myState: {
      reaction: apiFeed.myState?.reactionType ?? "NONE",
      isbookmarked: !!apiFeed.myState?.bookmarked,
      isreposted: !!apiFeed.myState?.reposted,
      isfollowing: !!apiFeed.myState?.following,
    },
  } as const;

  // REVIEW 분기 (리뷰 전용 필드 포함)
  if (apiFeed.kind === "REVIEW") {
    return {
      ...base,
      type: "REVIEW",
      content: {
        vendor: apiFeed.contents?.vendor ?? "",
        productUrl: apiFeed.contents?.productUrl ?? null,
        title: apiFeed.contents?.title ?? "",
        rating: apiFeed.contents?.rating ?? 0,

        text: apiFeed.contents?.content ?? "",
        contentImgs: apiFeed.contents?.feedImages ?? [],
        hashTags: apiFeed.contents?.hashTags ?? [],

        quote: apiFeed.contents?.quote
          ? mapQuote(apiFeed.contents.quote)
          : undefined,
      },
    };
  }

  // POST / QUOTE / REPOST (post content 형태로 통일)
  return {
    ...base,
    type: apiFeed.kind as "POST" | "QUOTE" | "REPOST",
    content: {
      text: apiFeed.contents?.content ?? "",
      contentImgs: apiFeed.contents?.feedImages ?? [],
      hashTags: apiFeed.contents?.hashTags ?? [],
      quote: apiFeed.contents?.quote
        ? mapQuote(apiFeed.contents.quote)
        : undefined,
    },
  };
}
