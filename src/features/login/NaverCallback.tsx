import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginWithNaver } from "../../api/auth";

export default function NaverCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRequested = useRef(false);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && state && !hasRequested.current) {
      handleNaverLogin(code, state);
    }
  }, [location]);

  const handleNaverLogin = async (code: string, state: string) => {
    try {
      hasRequested.current = true;
      const data = await loginWithNaver(code, state);

      if (data.success && data.result) {
        const { accessToken, refreshToken, needsOnboarding } = data.result;

        // 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 이동 분기 (사담 작성 때와 동일)
        if (needsOnboarding) {
          navigate("/login/nickname");
        } else {
          navigate("/");
        }
      } else {
        alert("네이버 로그인에 실패했습니다.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Naver login error:", error);
      navigate("/login");
    }
  };
  useEffect(() => {
    const handleLogin = async () => {
      if (!code || !state || hasRequested.current) return;

      try {
        hasRequested.current = true;
        const data = await loginWithNaver(code, state);

        // 스웨거 명세서의 "success": true 확인
        if (data.success && data.result) {
          const { accessToken, refreshToken, needsOnboarding } = data.result;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // 온보딩 경로 설정
          if (needsOnboarding) {
            navigate("/login/nickname");
          } else {
            navigate("/");
          }
        } else {
          alert(data.message || "네이버 로그인에 실패했습니다.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Naver login error:", error);
        navigate("/login");
      }
    };

    handleLogin();
  }, [code, state, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-medium font-['Pretendard']">
          네이버 로그인 처리 중...
        </p>
      </div>
    </div>
  );
}
