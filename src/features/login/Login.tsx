import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoIcon from "../../assets/login/logo.svg";
import cancelIcon from "../../assets/all/cancel.svg";
import eyeIcon from "../../assets/login/eye.svg";

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const isFormValid = userId.trim() !== "" && password.trim() !== "";

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 로그인 로직 구현 (서버 연결)
    // 임시: 아이디와 비밀번호가 일치하지 않으면 토스트 메시지 표시
    if (userId !== password) {
      showToast("아이디 또는 비밀번호가 올바르지 않아요.");
      return;
    }
    console.log("로그인:", { userId, password });
    navigate("/");
  };

  const handleSignUp = () => {
    navigate("/login/terms");
  };

  const handleGuestAccess = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 relative">
      {/* 로고 및 제목 */}
      <div className="flex flex-col top-20 items-center justify-center gap-3 mb-25 text-center">
        <img src={logoIcon} className="w-32 h-12" />
        <p className="justify-start text-neutral-500 text-base font-normal font-['Pretendard']">
          모든 저가 플랫폼을 한 눈에
        </p>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleLogin} className="flex flex-col w-full gap-6">
        {/* 아이디 입력 */}
        <div className="flex flex-col">
          <label
            htmlFor="userId"
            className="justify-start text-neutral-500 text-sm font-medium font-['Pretendard']"
          >
            아이디
          </label>
          <div className="relative">
            <input
              id="userId"
              type="text"
              placeholder="아이디를 입력해주세요."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium placeholder:font-['Pretendard'] text-zinc-900 text-base font-medium font-['Pretendard'] border-b border-gray-300 bg-transparent pl-1 py-3 transition-colors caret-rose-900 focus:border-rose-900 focus:outline-none w-full"
            />
            {userId && (
              <button
                type="button"
                onClick={() => setUserId("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-0.5"
              >
                <img src={cancelIcon} alt="아이디 삭제" className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="justify-start text-neutral-500 text-sm font-medium font-['Pretendard']"
          >
            비밀번호
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium placeholder:font-['Pretendard'] text-zinc-900 text-base font-medium font-['Pretendard'] border-b border-gray-300 bg-transparent pl-1 py-3 transition-colors caret-rose-900 focus:border-rose-900 focus:outline-none w-full"
            />
            {password && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-0.5"
                >
                  <img src={eyeIcon} alt="비밀번호 보기" className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPassword("")}
                  className="p-0.5"
                >
                  <img
                    src={cancelIcon}
                    alt="비밀번호 삭제"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full text-center gap-3">
          {/* 로그인 버튼 */}
          <button
            type="submit"
            className={`mt-10 h-12 flex justify-center items-center rounded text-white text-base font-medium font-['Pretendard'] transition-all 
      ${isFormValid ? "bg-rose-900 hover:bg-rose-800" : "bg-zinc-300 cursor-not-allowed"}`}
            disabled={!isFormValid}
          >
            로그인
          </button>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            onClick={handleSignUp}
            className="h-12 px-4 py-2.5 bg-stone-50 rounded flex justify-center items-center text-zinc-600 text-base font-medium font-['Pretendard']"
          >
            회원가입
          </button>
        </div>
      </form>

      {/* 비회원 메시지 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex text-center">
        <button
          type="button"
          onClick={handleGuestAccess}
          className="border-b border-yellow-600 text-xs text-yellow-600 cursor-pointer bg-none"
        >
          로그인 없이 둘러볼게요.
        </button>
      </div>

      {/* 토스트 메시지 */}
      {toast.visible && (
        <div className="absolute bottom-10 left-4 right-4 h-12 p-4 bg-neutral-500 rounded text-white text-base font-medium font-['Pretendard'] flex items-center">
          {toast.message}
        </div>
      )}
    </div>
  );
}
