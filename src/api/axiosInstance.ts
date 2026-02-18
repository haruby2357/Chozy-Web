import axios from "axios";

// 기본 인스턴스 생성
const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://chozy.net",
  baseURL: "/api", // 프록시 설정으로 인해 /api로 시작하는 요청은 자동으로 https://chozy.net으로 전달됨
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 자동으로 토큰을 실어 보냄
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 발생 시 토큰 재발급 시도
axiosInstance.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 통과
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(만료 등)가 발생 시, 아직 재시도를 안 한 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        // axiosInstance 대신 일반 axios를 사용해 재발급 요청 (순환 참조 방지)
        // 명세서: POST /auth/refresh
        const { data } = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
        );

        if (data.isSuccess) {
          const newAccessToken = data.result.accessToken;

          // 새로운 토큰 저장
          localStorage.setItem("accessToken", newAccessToken);

          // 기존 요청의 헤더를 새 토큰으로 바꾸고 다시 실행
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError: unknown) {
        const maybeAxiosError = refreshError as {
          response?: { data?: { code?: number }; status?: number };
        };
        
        // 명세서 에러 코드 4013: 리프레시 토큰도 만료되었거나 유효하지 않음
        const errorCode = maybeAxiosError.response?.data?.code;

        if (errorCode === 4013 || maybeAxiosError.response?.status === 401) {
          alert("인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.");
          localStorage.clear(); // 모든 토큰 삭제
          window.location.href = "/login"; // 로그인 페이지로 튕기기
        } else if (errorCode === 4000) {
          // 토큰 재발급 실패 시, alert 대신 콘솔 경고
          console.warn("토큰 재발급 요청에 실패했습니다.");
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
