import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginWithKakao } from "../../api/auth"; // 아까 만든 auth.ts 가져오기

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasRequested = useRef(false); // 중복 요청 방지
  const code = searchParams.get("code");

  useEffect(() => {
    const handleLogin = async () => {
      // 코드가 없거나 이미 요청 중이면 중단
      if (!code || hasRequested.current) return;

      try {
        hasRequested.current = true;
        const data = await loginWithKakao(code);

        if (data.success && data.result) {
          const { accessToken, refreshToken, needsOnboarding } = data.result;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // 성공 시 홈으로 이동 (replace를 써서 히스토리 삭제)
          if (needsOnboarding) {
            navigate("/login/nickname", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          throw new Error("Login failed");
        }
      } catch (error) {
        console.error("Kakao login error:", error);
        hasRequested.current = false; // 에러 시 재시도 가능하게 초기화
        navigate("/login");
      }
    };

    handleLogin();
  }, [code, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* 로그인 처리 중임을 알려주는 간단한 UI */}
      <div className="text-center">
        <p className="text-lg font-medium font-['Pretendard']">
          카카오 로그인 처리 중...
        </p>
      </div>
    </div>
  );
}
