import { useState, useMemo, useRef, useEffect } from "react";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import FilterToggle, { type ToggleOption } from "./components/FilterToggle";
import Nav from "../../components/Nav";
import PostList from "./components/PostList";
import WriteBtn from "./components/WriteBtn";
import FloatingMenu from "./components/FloatingMenu";

import { communityApi } from "../../api";

const OPTIONS: ToggleOption[] = [
  { key: "ALL", label: "전체" },
  { key: "POST", label: "사담" },
  { key: "REVIEW", label: "리뷰" },
];

type Tab = "RECOMMEND" | "FOLLOWING";
type ContentType = "ALL" | "POST" | "REVIEW";

function CommMain() {
  const [tab, setTab] = useState<Tab>("RECOMMEND");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [selected, setSelected] = useState<ContentType[]>([
    "ALL",
    "POST",
    "REVIEW",
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setIsModalOpen((prev) => !prev);

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollTop();
  }, [tab]);

  const contentType: ContentType = useMemo(() => {
    const hasPost = selected.includes("POST");
    const hasReview = selected.includes("REVIEW");
    const hasAll = selected.includes("ALL");

    if (hasAll || (hasPost && hasReview)) return "ALL";
    if (hasPost) return "POST";
    if (hasReview) return "REVIEW";
    return "ALL";
  }, [selected]);

  const handleTabChange = (next: Tab) => {
    if (next === tab) {
      scrollTop();
      return;
    }
    setTab(next);
  };
  return (
    <div className="h-full flex flex-col">
      <div
        className="bg-[#F9F9F9]"
        style={{ opacity: isModalOpen ? 0.5 : 1, transition: "opacity 0.2s" }}
      >
        <Header />
        <TabBar value={tab} onChange={handleTabChange} />
        <FilterToggle
          options={OPTIONS}
          value={selected}
          onChange={(next) => {
            setSelected(next as ContentType[]);
          }}
          className="px-4 py-[9px]"
        />
      </div>
      <div
        ref={scrollRef}
        className="scroll-available flex-1 overflow-y-auto scrollbar-hide bg-[#F9F9F9] px-2"
        style={{ opacity: isModalOpen ? 0.5 : 1, transition: "opacity 0.2s" }}
      >
        <PostList
          contentType={contentType}
          fetchFeeds={() =>
            communityApi.feedsApi.getFeeds({ tab, contentType })
          }
          emptyVariant="community"
          emptyText={
            tab === "FOLLOWING"
              ? "팔로우 중인 친구가 없어요.\n마음에 드는 이웃을 찾아보세요:)"
              : "아직 게시글이 없어요.\n첫 글을 작성해보세요:)"
          }
        />
      </div>
      <div
        style={{ opacity: isModalOpen ? 0.5 : 1, transition: "opacity 0.2s" }}
      >
        <Nav scrollTargetSelector=".scroll-available" />
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 w-[390px] mx-auto z-40 bg-black/40"
          onClick={() => setIsModalOpen(false)}
        />
      )}
      <FloatingMenu isOpen={isModalOpen} />
      <WriteBtn onClick={toggleMenu} isOpen={isModalOpen} />
    </div>
  );
}

export default CommMain;
