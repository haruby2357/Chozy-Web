import { Routes, Route } from "react-router-dom";
import Home from "../features/goodsPage/Home";

export default function AppRouter() {
  return (
    // Nav바 동작 확인을 위한 임시 라우팅
    // 추후 개별 페이지 구현 시 교체 예정
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/goods" element={<Home />} />
      <Route path="/community" element={<Home />} />
      <Route path="/heart" element={<Home />} />
      <Route path="/mypage" element={<Home />} />
    </Routes>
  );
}
