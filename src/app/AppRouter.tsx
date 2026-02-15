import { Routes, Route } from "react-router-dom";
import Onboarding from "../features/login/Onboarding";
import Login from "../features/login/Login";
import KakaoCallback from "../features/login/KakaoCallback";
import Terms from "../features/login/Terms";
import ServiceTerms from "../features/login/ServiceTerms";
import PrivacyPolicy from "../features/login/PrivacyPolicy";
import VerificationMethod from "../features/login/VerificationMethod";
import PhoneVerification from "../features/login/PhoneVerification";
import EmailVerification from "../features/login/EmailVerification";
import SignUp from "../features/login/SignUp";
import Nickname from "../features/login/Nickname";
import SignUpComplete from "../features/login/SignUpComplete";
import Home from "../features/goodsPage/Home";
import SearchEntry from "../features/goodsPage/SearchEntry";
import SearchResult from "../features/goodsPage/SearchResult";
import ReviewWrite from "../features/comm/ReviewWrite";
import CommMain from "../features/comm/CommMain";
import PostDetail from "../features/comm/PostDetail";
import MyMain from "../features/myPage/MyMain";
import Notifications from "../features/alerts/Notifications";
import Setting from "../features/myPage/components/Setting";
import PostWrite from "../features/comm/PostWrite";
import LikePost from "../features/myPage/components/setting/LikePost";
import BlockedAccounts from "../features/myPage/components/setting/BlockedAccounts";
import WithdrawAccount from "../features/myPage/components/setting/WithdrawAccount";
import WithdrawComplete from "../features/myPage/components/setting/WithdrawComplete";

export default function AppRouter() {
  return (
    <Routes>
      {/* 온보딩 페이지 라우팅 */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* 로그인 페이지 라우팅 */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
      <Route path="/login/terms" element={<Terms />} />
      <Route path="/login/terms/service" element={<ServiceTerms />} />
      <Route path="/login/terms/privacy" element={<PrivacyPolicy />} />
      <Route
        path="/login/terms/verification"
        element={<VerificationMethod />}
      />
      <Route path="/login/verification/phone" element={<PhoneVerification />} />
      <Route path="/login/verification/email" element={<EmailVerification />} />
      <Route path="/login/signup" element={<SignUp />} />
      <Route path="/login/nickname" element={<Nickname />} />
      <Route path="/login/complete" element={<SignUpComplete />} />

      {/* 홈 페이지 라우팅 */}
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
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/mypage/setting" element={<Setting />} />
      <Route path="/mypage/likepost" element={<LikePost />} />
      <Route path="/mypage/blocked" element={<BlockedAccounts />} />
      <Route path="/mypage/withdraw" element={<WithdrawAccount />} />
      <Route path="/mypage/withdraw/complete" element={<WithdrawComplete />} />
    </Routes>
  );
}
