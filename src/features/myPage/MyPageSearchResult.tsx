import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SearchBar2 from "../../components/SearchBar2";
import TabBar from "./components/TabBar";
import PostList from "../comm/components/PostList";
import { getMyFeeds, getMyBookmarks } from "../../api/domains/mypage";

import type { MyPageFeedsResult } from "../../api/domains/mypage";

export default function MyPageSearchResult() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const [tab, setTab] = useState<"reviews" | "bookmarks">("reviews");
  const [, setSearchResult] = useState<MyPageFeedsResult | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const result =
          tab === "reviews"
            ? await getMyFeeds({
                page: 0,
                size: 20,
                sort: "latest",
                search: keyword,
              })
            : await getMyBookmarks({ page: 0, size: 20, search: keyword });

        setSearchResult(result.result);
      } catch {
        setSearchResult(null);
      }
    };

    loadResults();
  }, [tab, keyword]);

  return (
    <div className="relative h-full bg-white flex flex-col">
      <SearchBar2
        backBehavior="BACK"
        focusNavigateTo="/mypage/search"
        value={keyword}
        onChange={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-hidden pt-20">
        <TabBar value={tab} onChange={setTab} />

        <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#F9F9F9]">
          <PostList
            contentType="ALL"
            fetchFeeds={() =>
              tab === "reviews"
                ? getMyFeeds({
                    page: 0,
                    size: 20,
                    sort: "latest",
                    search: keyword,
                  })
                : getMyBookmarks({ page: 0, size: 20, search: keyword })
            }
            searchKeyword={keyword}
            emptyVariant="mypage"
            emptyText={
              tab === "reviews" ? "검색 결과가 없어요." : "검색 결과가 없어요."
            }
            reloadKey={tab}
          />
        </div>
      </div>
    </div>
  );
}
