import logo from "../../assets/login/logo.svg";
import kakaoIcon from "../../assets/login/kakao.svg";
import naverIcon from "../../assets/login/naver.svg";

const Login = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4">
      {/* 1. 로고 영역 */}
      <div className="mt-[221px] flex justify-center">
        <img src={logo} alt="Chozy Logo" className="w-[159px] h-[56px]" />
      </div>

      <div className="flex-grow" />

      {/* 2. 둘러보기 링크 */}
      <div className="w-full h-12 flex items-center justify-center p-32px">
        <button className="text-[#B5B5B5] font-medium text-[16px] leading-none text-center underline underline-offset-0 decoration-solid">
          둘러보기
        </button>
      </div>

      {/* 3. 로그인 버튼 모음 */}
      <div className="w-full flex flex-col gap-[8px]">
        <button className="flex items-center justify-center w-full h-12 rounded-lg bg-[#F9F9F9] text-[#575757] font-medium relative">
          <img
            src={kakaoIcon}
            alt="Kakao"
            className="absolute left-[16px] top-[10px] bottom-[10px] w-[28px] h-[28px]"
          />
          카카오로 로그인
        </button>

        <button className="flex items-center justify-center w-full h-12 rounded-lg bg-[#F9F9F9] text-[#575757] font-medium relative">
          <img
            src={naverIcon}
            alt="Naver"
            className="absolute left-[16px] top-[10px] bottom-[10px] w-[28px] h-[28px]"
          />
          네이버로 로그인
        </button>

        <button className="flex items-center justify-center w-full h-12 rounded-lg bg-[#F9F9F9] text-[#575757] font-medium relative">
          휴대폰 번호로 로그인
        </button>

        <button className="flex items-center justify-center w-full h-12 rounded-lg bg-[#F9F9F9] text-[#575757] font-medium relative">
          이메일로 로그인
        </button>
      </div>

      {/* 4. 하단 회원가입 */}
      <div className="w-full h-12 flex items-center justify-center p-[32px]">
        <button className="text-[#800025] font-medium text-[16px] leading-none text-center underline underline-offset-0 decoration-solid">
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
