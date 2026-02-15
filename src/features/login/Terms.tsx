import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import backIcon from "../../assets/all/back.svg";
import emptyCheckIcon from "../../assets/login/empty-check.svg";
import filledCheckIcon from "../../assets/login/filled-check.svg";
import moreIcon from "../../assets/login/more.svg";

export default function Terms() {
  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const isAllAgreed = agreeTerms && agreePrivacy;

  const handleNext = () => {
    if (isAllAgreed) {
      navigate("/login/terms/verification");
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-4 bg-white relative">
      {/* 상단 바 */}
      <div className="flex flex-col h-12 justify-center">
        {/* 뒤로가기 버튼 */}
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-25">
        {/* 제목 */}
        <div>
          <p className="justify-start text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            서비스 이용을 위해
          </p>
          <p className="justify-start text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            약관 동의가 필요해요.
          </p>
        </div>

        {/* 본문 */}
        <div className="flex-1 flex flex-col gap-25">
          <div className="flex justify-center">
            <div className="w-40 h-40 bg-gray-300 rounded" />
          </div>

          {/* 약관 체크박스 */}
          <div className="flex flex-col gap-2">
            {/* 서비스 이용약관 */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 rounded">
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="cursor-pointer"
                >
                  <img
                    src={agreeTerms ? filledCheckIcon : emptyCheckIcon}
                    alt="체크"
                    className="w-6 h-6 m-0.5"
                  />
                </button>
                <span className="text-zinc-600 text-base font-medium font-['Pretendard']">
                  서비스 이용약관
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login/terms/service")}
                className="flex w-6 h-6"
              >
                <img src={moreIcon} className="w-full h-full" />
              </button>
            </div>

            {/* 개인정보 처리방침 */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 rounded">
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setAgreePrivacy(!agreePrivacy)}
                  className="cursor-pointer"
                >
                  <img
                    src={agreePrivacy ? filledCheckIcon : emptyCheckIcon}
                    alt="체크"
                    className="w-6 h-6 m-0.5"
                  />
                </button>
                <span className="text-zinc-600 text-base font-medium font-['Pretendard']">
                  개인정보 처리방침
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login/terms/privacy")}
                className="flex w-6 h-6"
              >
                <img src={moreIcon} className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-4 right-4">
          {/* 다음 버튼 */}
          <SubmitButton
            isValid={isAllAgreed}
            onSubmit={handleNext}
            label="다음"
            className="relative w-full"
          />
        </div>
      </div>
    </div>
  );
}
