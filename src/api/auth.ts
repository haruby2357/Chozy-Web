import axiosInstance from "./axiosInstance";

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
