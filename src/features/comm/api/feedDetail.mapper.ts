import type {
  ApiFeed,
  ApiFeedDetailResult,
  ApiFeedUser,
  ApiComment,
  FeedUser,
  FeedCounts,
  FeedDetail,
  CommentItem,
  FeedDetailResult,
  Mention,
  ReplyTo,
} from "../types";

function mapApiUser(u: ApiFeedUser): FeedUser {
  return {
    profileImg: u.profileImageUrl ?? "",
    userName: u.name,
    userId: u.userId,
  };
}

function mapApiCountsToUiCounts(counts: ApiFeed["counts"]): FeedCounts {
  return {
    comments: counts.commentCount,
    likes: counts.likeCount,
    dislikes: counts.dislikeCount,
    quotes: counts.quoteCount,
  };
}

function mapApiFeedToUiFeed(api: ApiFeed): FeedDetail {
  const images =
    (api.contents.feedImages ?? [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((x) => x.imageUrl) ?? [];

  const type = api.contentType === "REVIEW" ? "REVIEW" : "POST";

  const base = {
    feedId: api.feedId,
    type,
    user: mapApiUser(api.user),
    counts: mapApiCountsToUiCounts(api.counts),
    myState: {
      reaction: api.myState.reactionType,
      isbookmarked: api.myState.isBookmarked,
      isreposted: api.myState.isReposted,
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

function mapMentions(ms: ApiComment["mentions"]): Mention[] {
  return (ms ?? []).map((m) => ({
    userId: m.userId,
    name: m.name,
    startIndex: m.startIndex,
    length: m.length,
  }));
}

function mapReplyTo(rt: ApiComment["replyTo"]): ReplyTo {
  return rt ? { userId: rt.userId, name: rt.name } : null;
}

function mapApiCommentToUiComment(c: ApiComment): CommentItem {
  const replies = (c.replies ?? []).map(mapApiCommentToUiComment);

  const replyTo = mapReplyTo(c.replyTo);

  return {
    commentId: c.commentId,
    user: mapApiUser(c.user),

    // 기존 UI에서 사용하던 quote는 replyTo.name으로 유지 (없으면 "")
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

    // 기존 “답글 n개 더보기” 로직이 item.comment를 보게 되어있으니 유지
    comment: replies,
  };
}

export function mapApiResultToUi(
  result: ApiFeedDetailResult,
): FeedDetailResult {
  return {
    feed: mapApiFeedToUiFeed(result.feed),
    comments: (result.comments ?? []).map(mapApiCommentToUiComment),
  };
}
