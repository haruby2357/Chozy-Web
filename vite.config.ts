import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://chozy.net",
        changeOrigin: true, // CORS 에러 해결을 위한 설정
        secure: true,
        // 주소에서 "/api"를 제거하고 백엔드 서버에 전달합니다.
        // 예: /api/auth/check-id -> https://chozy.net/auth/check-id
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // "/me": {
      //   target: "https://chozy.net",
      //   changeOrigin: true,
      //   secure: true,
      // },
    },
  },
});
