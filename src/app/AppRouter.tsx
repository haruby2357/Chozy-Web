import { Routes, Route } from "react-router-dom";
import Home from "../features/goodsPage/Home";
import SearchResult from "../features/goodsPage/SearchResult";
import ReviewWrite from "../features/comm/ReviewWrite";
import CommMain from "../features/comm/CommMain";
import PostDetail from "../features/comm/PostDetail";

export default function AppRouter() {
  return (
    // Nav바 동작 확인을 위한 임시 라우팅
    // 추후 개별 페이지 구현 시 교체 예정
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home/products" element={<SearchResult />} />
      <Route path="/community" element={<CommMain />} />
      <Route path="/community/feeds/:feedId" element={<PostDetail />} />
      <Route path="/review-write" element={<ReviewWrite />} />
      <Route path="/heart" element={<Home />} />
      <Route path="/mypage" element={<Home />} />
    </Routes>
  );
}
