import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import filledCheckIcon from "../../assets/login/filled-check.svg";
import emptyCheckIcon from "../../assets/login/empty-check.svg";

type VerificationMethodType = "phone" | "email" | null;

export default function VerificationMethod() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] =
    useState<VerificationMethodType>("phone");

  const handlePhoneClick = () => {
    setSelectedMethod("phone");
  };

  const handleEmailClick = () => {
    setSelectedMethod("email");
  };

  const handleNext = () => {
    if (selectedMethod === "phone") {
      navigate("/login/verification/phone");
    } else if (selectedMethod === "email") {
      navigate("/login/verification/email");
    }
  };

  return (
    <div className="flex flex-col h-screen w-[380px] bg-white">
      {/* 헤더 */}
      <DetailHeader title="" />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-3 gap-15">
        {/* 제목 */}
        <div>
          <p className="justify-start text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            본인 확인 방법을
          </p>
          <p className="justify-start text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            선택해주세요.
          </p>
        </div>

        {/* 선택 옵션 */}
        <div className="flex gap-2 h-32">
          {/* 휴대폰 번호 인증 */}
          <button
            onClick={handlePhoneClick}
            className="flex-1 flex flex-col justify-between h-full p-5 bg-stone-50 rounded hover:border-gray-300 transition"
          >
            <img
              src={
                selectedMethod === "phone" ? filledCheckIcon : emptyCheckIcon
              }
              alt="check"
              className="flex w-6 h-6 m-0.5"
            />
            <span className="flex text-left text-zinc-600 text-base font-semibold font-['Pretendard']">
              휴대폰 번호로
              <br />
              인증하기
            </span>
          </button>

          {/* 이메일 인증 */}
          <button
            onClick={handleEmailClick}
            className="flex-1 flex flex-col justify-between h-full p-5 bg-stone-50 rounded hover:border-gray-300 transition"
          >
            <img
              src={
                selectedMethod === "email" ? filledCheckIcon : emptyCheckIcon
              }
              alt="check"
              className="flex w-6 h-6 m-0.5"
            />
            <span className="flex text-left text-zinc-600 text-base font-semibold font-['Pretendard']">
              이메일로
              <br />
              인증하기
            </span>
          </button>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[348px]">
        <SubmitButton
          isValid={selectedMethod !== null}
          onSubmit={handleNext}
          label="다음"
          className="relative w-full"
        />
      </div>
    </div>
  );
}
