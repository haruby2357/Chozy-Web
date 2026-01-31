import { Routes, Route } from "react-router-dom";
import Home from "../features/goodsPage/Home";
import SearchEntry from "../features/goodsPage/SearchEntry";
import SearchResult from "../features/goodsPage/SearchResult";
import ReviewWrite from "../features/comm/ReviewWrite";
import CommMain from "../features/comm/CommMain";
import PostDetail from "../features/comm/PostDetail";
import MyMain from "../features/myPage/MyMain";
import PostWrite from "../features/comm/PostWrite";

export default function AppRouter() {
  return (
    // Nav바 동작 확인을 위한 임시 라우팅
    // 추후 개별 페이지 구현 시 교체 예정
    <Routes>
      <Route path="/" element={<Home />} />

      {/* 상품 검색 페이지 라우팅 */}
      <Route path="/home/products" element={<SearchResult />} />
      <Route path="/home/search" element={<SearchEntry />} />

      {/* 커뮤니티 페이지 라우팅 */}
      <Route path="/community" element={<CommMain />} />
      <Route path="/community/feeds/:feedId" element={<PostDetail />} />
      <Route path="/community/post-write" element={<PostWrite />} />
      <Route path="/review-write" element={<ReviewWrite />} />

      {/* 개인 페이지 라우팅 */}
      <Route path="/heart" element={<Home />} />
      <Route path="/mypage" element={<MyMain />} />
    </Routes>
  );
}
