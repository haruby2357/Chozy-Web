import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Vite 프록시 설정 사용 시
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 자동으로 토큰을 실어 보냄
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 또는 쿠키
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
