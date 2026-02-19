import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginWithKakao } from "../../api/auth"; // 아까 만든 auth.ts 가져오기

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 주소창에서 ?code=... 부분의 값 추출
  const code = searchParams.get("code");
  const hasRequested = useRef(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (!code || hasRequested.current) return;

      try {
        // 1. 서버에 인가 코드를 보내서 토큰을 받아오기
        hasRequested.current = true;
        const data = await loginWithKakao(code);
        if (data.success && data.result) {
          // 2. 받아온 토큰을 브라우저에 저장
          // (이후 axiosInstance가 이 토큰을 자동으로 꺼내서 씀)
          localStorage.setItem("accessToken", data.result.accessToken);
          localStorage.setItem("refreshToken", data.result.refreshToken);

          // 3. needsOnboarding 에 따른 분기
          if (data.result.needsOnboarding) {
            // 닉네임 설정이 필요한 신규 유저 -> 닉네임 설정 페이지로!
            navigate("/login/nickname");
          } else {
            // 이미 가입된 기존 유저 -> 홈으로!
            navigate("/");
          }
        }
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
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
