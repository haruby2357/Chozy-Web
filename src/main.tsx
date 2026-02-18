import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// // MSW 활성화 함수 정의
// async function enableMocking() {
//   // 개발 환경에서만 동작하도록 제한
//   if (!import.meta.env.DEV) {
//     return;
//   }

//   const { worker } = await import("./mocks/browser");

//   return worker.start({
//     onUnhandledRequest: "bypass",
//   });
// }

// 워커 준비 후 렌더링 시작
// enableMocking().then(() => {
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
// });
