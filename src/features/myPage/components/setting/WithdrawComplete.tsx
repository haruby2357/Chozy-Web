import { useNavigate } from "react-router-dom";

export default function WithdrawComplete() {
  const navigate = useNavigate();

  const onConfirm = () => {
    // 로그인 화면 이동
    // 임시 메인 이동
    navigate("/");
  };

  return (
    <>
      <div className="mt-25 flex flex-col items-center justify-center">
        <div className="w-25 h-25 bg-[#D9D9D9] mb-8" />
        <p className="text-[#191919] text-[20px] text-center font-semibold mb-[14px]">
          탈퇴가 완료되었습니다.
        </p>
        <p className="text-[#787878] text-[16px] font-medium text-center">
          그동안 Chozy를 이용해주셔서 감사합니다.
        </p>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <button
          type="button"
          onClick={onConfirm}
          className="w-[358px] h-12 text-[16px] text-white font-medium bg-[#800025]"
        >
          확인
        </button>
      </div>
    </>
  );
}
