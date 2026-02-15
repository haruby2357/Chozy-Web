import { useNavigate } from "react-router-dom";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";

import completeIcon from "../../assets/login/complete.svg";

export default function SignUpComplete() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* 헤더 */}
      <DetailHeader title="" />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-3 pb-24 items-center justify-center gap-5">
        {/* 완료 아이콘 */}
        <div className="w-35 h-35 bg-stone-50 rounded-[100px] flex items-center justify-center p-2.5">
          <img src={completeIcon} className="w-24 h-24" />
        </div>

        {/* 완료 메시지 */}
        <p className="text-zinc-900 text-xl font-semibold font-['Pretendard']">
          회원가입을 완료했어요.
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-5 left-4 right-4">
        <SubmitButton
          label="확인"
          onSubmit={() => navigate("/onboarding")}
          isValid={true}
          className="relative w-full"
        />
      </div>
    </div>
  );
}
