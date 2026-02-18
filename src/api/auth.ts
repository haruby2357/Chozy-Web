import axiosInstance from "./axiosInstance";

// KAKAO_AUTH_URL
const REST_API_KEY = "9ac25a37f735552809d85c147c94bf37";
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

// 카카오 인가 코드를 서버로 보내고 토큰을 받는 함수
export const loginWithKakao = async (code: string) => {
  const response = await axiosInstance.get(`/auth/kakao/callback?code=${code}`);
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
