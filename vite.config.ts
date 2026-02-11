import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": {
        target: "https://chozy.net",
        changeOrigin: true,
        secure: true,
      },
      "/home": {
        target: "https://chozy.net",
        changeOrigin: true,
        secure: true,
      },
      "/community": {
        target: "https://chozy.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
