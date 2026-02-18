import DetailHeader from "../../../../components/DetailHeader";
import PostList from "../../../comm/components/PostList";

import { getLikedFeeds } from "../../../../api/domains/mypage/liked";
import { likedFeedToUiFeedItem } from "../../../../api/domains/mypage/liked";

export default function LikePost() {
  return (
    <>
      <DetailHeader title="좋아요한 게시글" />

      <div className="bg-[#F9F9F9] min-h-[calc(100vh-48px)]">
        <PostList
          contentType="ALL"
          fetchFeeds={() =>
            getLikedFeeds({ page: 0, size: 20, sort: "latest" })
          }
          mapItem={likedFeedToUiFeedItem}
          emptyVariant="mypage"
          emptyText={"좋아요한 게시글이 없어요."}
        />
      </div>
    </>
  );
}
