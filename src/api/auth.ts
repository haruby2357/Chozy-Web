import axiosInstance from "./axiosInstance";

// AUTH_URL
const REST_API_KEY = "9ac25a37f735552809d85c147c94bf37";

const NAVER_CLIENT_ID = "LI66hvPIvWQQ0aBYQhfR";
const STATE = "random_string_123";

const currentOrigin = window.location.origin;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${currentOrigin}/auth/kakao/callback&response_type=code`;
export const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${currentOrigin}/auth/naver/callback&state=${STATE}`;
// 카카오 인가 코드를 서버로 보내고 토큰을 받는 함수
export const loginWithKakao = async (code: string) => {
  const response = await axiosInstance.get(`/auth/kakao/callback?code=${code}`);
  return response.data;
};

// 네이버 인가 코드를 서버로 보내는 함수 추가
export const loginWithNaver = async (code: string, state: string) => {
  // GET 요청 (Query String: code, state)
  const response = await axiosInstance.get(`/auth/naver/callback`, {
    params: { code, state },
  });
  return response.data;
};

// 온보딩(닉네임 설정) 완료 함수
export const completeOnboarding = async (nickname: string) => {
  const response = await axiosInstance.patch("/users/me/onboarding", {
    nickname,
  });
  return response.data;
};

// 내부 로그인 함수
export const login = async (loginId: string, password: string) => {
  // 명세서: POST /auth/login
  const response = await axiosInstance.post("/auth/login", {
    loginId,
    password,
  });
  return response.data;
};

// 회원가입 함수
export const signUp = async (signUpData: any) => {
  // 명세서: POST /auth/signup
  const response = await axiosInstance.post("/auth/signup", signUpData);
  return response.data;
};

// 아이디 중복 확인 함수
export const checkIdDuplicate = async (loginId: string) => {
  // 명세서: GET /auth/check-id?loginId={loginId}
  const response = await axiosInstance.get(`/auth/check-id?loginId=${loginId}`);
  return response.data;
};

// 액세스 토큰 재발급 API
export const refreshAccessToken = async (refreshToken: string) => {
  // 명세서: POST /auth/refresh
  const response = await axiosInstance.post("/auth/refresh", {
    refreshToken, // Body에 리프레시 토큰을 실어 보냄
  });
  return response.data;
};

//이메일 인증번호 발송 API
export const sendVerificationEmail = async (email: string) => {
  // 명세서: POST /auth/email/verification-code
  const response = await axiosInstance.post("/auth/email/verification-code", {
    email,
  });
  return response.data;
};

// 이메일 인증 번호 검증 API
export const verifyEmail = async (email: string, code: string) => {
  // 명세서: POST /auth/email/verify
  const response = await axiosInstance.post("/auth/email/verify", {
    email,
    code,
  });
  return response.data;
};

// 로컬 스토리지의 accessToken에서 userId를 추출하는 함수
export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    const result = JSON.parse(payload);

    const userId = result.userId || result.id || result.sub;
    return userId ? Number(userId) : null;
  } catch (error) {
    console.error("토큰 해독 실패:", error);
    return null;
  }
};
