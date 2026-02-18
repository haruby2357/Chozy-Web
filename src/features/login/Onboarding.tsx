import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import onboarding1 from "../../assets/login/onboarding1.svg";
import onboarding2 from "../../assets/login/onboarding2.svg";

const ONBOARDING_DATA = [
  {
    image: onboarding1,
    text: ["여기저기 찾지 말고,", "여러 커머스를 한 번에 비교하세요."],
  },
  {
    image: onboarding2,
    text: ["다양한 반응을 모아보고,", "자유롭게 이야기할 수 있어요."],
    description: "간단한 정보만 입력해도 비로 시작할 수 있어요 :)",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/");
    }
  };

  const data = ONBOARDING_DATA[currentStep];

  return (
    <div className="flex flex-col h-full w-full items-center justify-between bg-white px-4 py-5">
      {/* 온보딩 이미지 및 텍스트 */}
      <div className="flex-1 flex flex-col justify-center gap-24 w-full">
        {/* 이미지 */}
        <img
          src={data.image}
          alt={`onboarding ${currentStep + 1}`}
          className={`h-auto mx-auto ${currentStep === 0 ? "w-72" : "w-full"}`}
        />

        {/* 텍스트 */}
        {currentStep === 0 ? (
          <p className="justify-start text-zinc-900 text-xl font-semibold font-['Pretendard']">
            {data.text.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < data.text.length - 1 && <br />}
              </span>
            ))}
          </p>
        ) : (
          <div className="space-y-3">
            <p className="justify-start text-zinc-900 text-xl font-semibold font-['Pretendard']">
              {data.text.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < data.text.length - 1 && <br />}
                </span>
              ))}
            </p>
            {data.description && (
              <p className="justify-start text-neutral-500 text-base font-normal font-['Pretendard']">
                {data.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 인디케이터 도트 */}
      <div className="flex gap-2 mb-20">
        {ONBOARDING_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep ? "bg-[#800025]" : "bg-gray-300"
            }`}
            aria-label={`Go to onboarding step ${index + 1}`}
          />
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-5 left-4 right-4">
        <SubmitButton
          isValid={true}
          onSubmit={handleNext}
          label={
            currentStep === ONBOARDING_DATA.length - 1 ? "시작하기" : "다음"
          }
          className="relative w-full"
        />
      </div>
    </div>
  );
}
