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

function mapApiCommentToUiComment(c: ApiComment): CommentItem {
  const replies = (c.commentReflies ?? []).map((r) => {
    const replyItem: CommentItem = {
      commentId: r.commentReflyId,
      user: mapApiUser(r.user),
      quote: r.mentionedUserName ? `${r.mentionedUserName}` : "",
      content: r.content,
      createdAt: r.createdAt,
      counts: {
        comments: r.counts.replyCount,
        likes: r.counts.likeCount,
        dislikes: r.counts.dislikeCount,
        quotes: 0,
      },
      myState: {
        reaction: r.reactionType,
        isbookmarked: false,
        isreposted: false,
      },
      comment: [],
    };
    return replyItem;
  });

  return {
    commentId: c.commentId,
    user: mapApiUser(c.user),
    quote: c.mentionedUserName ? `${c.mentionedUserName}` : "",
    content: c.content,
    createdAt: c.createdAt,
    counts: {
      comments: c.counts.replyCount,
      likes: c.counts.likeCount,
      dislikes: c.counts.dislikeCount,
      quotes: 0,
    },
    myState: {
      reaction: c.reactionType,
      isbookmarked: false,
      isreposted: false,
    },
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
