import { Routes, Route } from "react-router-dom";
import Login from "../features/login/Login";
import Terms from "../features/login/Terms";
import ServiceTerms from "../features/login/ServiceTerms";
import PrivacyPolicy from "../features/login/PrivacyPolicy";
import VerificationMethod from "../features/login/VerificationMethod";
import PhoneVerification from "../features/login/PhoneVerification";
import Home from "../features/goodsPage/Home";
import SearchEntry from "../features/goodsPage/SearchEntry";
import SearchResult from "../features/goodsPage/SearchResult";
import ReviewWrite from "../features/comm/ReviewWrite";
import CommMain from "../features/comm/CommMain";
import PostDetail from "../features/comm/PostDetail";
import MyMain from "../features/myPage/MyMain";
import Setting from "../features/myPage/components/Setting";
import PostWrite from "../features/comm/PostWrite";
import LikePost from "../features/myPage/components/setting/LikePost";
import BlockedAccounts from "../features/myPage/components/setting/BlockedAccounts";

export default function AppRouter() {
  return (
    // Nav바 동작 확인을 위한 임시 라우팅
    // 추후 개별 페이지 구현 시 교체 예정
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/terms" element={<Terms />} />
      <Route path="/login/terms/service" element={<ServiceTerms />} />
      <Route path="/login/terms/privacy" element={<PrivacyPolicy />} />
      <Route
        path="/login/terms/verification"
        element={<VerificationMethod />}
      />
      <Route path="/login/verification/phone" element={<PhoneVerification />} />
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
      <Route path="/mypage/setting" element={<Setting />} />
      <Route path="/mypage/likepost" element={<LikePost />} />
      <Route path="/mypage/blocked" element={<BlockedAccounts />} />
    </Routes>
  );
}
