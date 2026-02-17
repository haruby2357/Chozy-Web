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
  };
}

function mapFeed(api: ApiFeed): UiFeedDetail {
  const images =
    (api.contents.feedImages ?? [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((x) => x.imageUrl)
      .filter(Boolean) ?? [];

  const type: "REVIEW" | "POST" =
    api.contentType === "REVIEW" ? "REVIEW" : "POST";

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

  if (type === "REVIEW") {
    return {
      ...base,
      type: "REVIEW",
      content: {
        vendor: api.contents.vendor ?? "",
        title: api.contents.title ?? "",
        rating: api.contents.rating ?? 0,
        text: api.contents.content ?? "",
        contentImgs: images,
        hashTags: api.contents.hashTags ?? [],
      },
    };
  }

  return {
    ...base,
    type: "POST",
    content: {
      text: api.contents.content ?? "",
      contentImgs: images,
      hashTags: api.contents.hashTags ?? [],
    },
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
