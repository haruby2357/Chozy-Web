import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import cancelIcon from "../../assets/all/cancel.svg";
import checkCircleIcon from "../../assets/all/check-circle.svg";
import checkVerificationIcon from "../../assets/login/check-verification.svg";

export default function PhoneVerification() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    icon?: string;
  } | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자만 허용
    if (value.length <= 11) {
      setPhoneNumber(value);
      if (isVerified) {
        setIsVerified(false);
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setVerificationCode(value);
      if (isVerified) {
        setIsVerified(false);
      }
    }
  };

  const handleSendCode = () => {
    if (phoneNumber.length >= 10 && !isCodeSending) {
      setIsCodeSending(true);
      setShowCodeInput(true);
      setTimeRemaining(300); // 5분(300초) 제한 시간 시작
      setTimeout(() => {
        setIsCodeSending(false);
      }, 3000);
    }
  };

  const handleClearPhone = () => {
    setPhoneNumber("");
  };

  const handleClearCode = () => {
    setVerificationCode("");
  };

  const handleVerify = () => {
    if (phoneNumber && verificationCode) {
      // TODO: 실제 인증 로직 (서버 API 호출)
      // 임시로 "123456"이 정답이라고 가정
      const correctCode = "123456";

      if (verificationCode === correctCode) {
        setIsVerified(true);
        setToast({
          message: "인증을 완료했어요.",
          type: "success",
          icon: checkCircleIcon,
        });
        setTimeout(() => {
          setToast(null);
        }, 2000);
      } else {
        setToast({ message: "인증번호가 일치하지 않습니다.", type: "error" });
        setTimeout(() => {
          setToast(null);
        }, 2000);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-[380px] bg-white">
      {/* 헤더 */}
      <DetailHeader title="" />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-3 gap-10 pb-24">
        {/* 제목 */}
        <div>
          <p className="text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            휴대폰 번호를
          </p>
          <p className="text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            입력해주세요.
          </p>
        </div>

        <div>
          {/* 휴대폰 번호 입력 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block">
              휴대폰 번호
            </label>
            <div
              className={`flex gap-2 border-b px-1 py-3 justify-between items-center transition ${
                isPhoneFocused ? "border-rose-900" : "border-zinc-400"
              }`}
            >
              <div className="flex items-center flex-1 relative">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  placeholder="휴대폰 번호를 입력해주세요."
                  className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                />
                {phoneNumber && (
                  <button onClick={handleClearPhone} className="ml-2">
                    <img
                      src={cancelIcon}
                      alt="clear"
                      className="w-5 h-5 m-0.5"
                    />
                  </button>
                )}
              </div>
              <button
                onClick={handleSendCode}
                disabled={
                  phoneNumber.length < 10 || isCodeSending || isVerified
                }
                className={`flex items-center gap-1 h-8 px-2 py-1 rounded text-sm font-medium font-['Pretendard'] transition ${
                  phoneNumber.length >= 10 && !isCodeSending && !isVerified
                    ? "text-zinc-600"
                    : "text-zinc-300 cursor-default"
                }`}
              >
                {isVerified ? (
                  <>
                    <span>인증완료</span>
                    <img
                      src={checkVerificationIcon}
                      alt="verified"
                      className="w-4 h-4"
                    />
                  </>
                ) : (
                  "인증번호 받기"
                )}
              </button>
            </div>
          </div>

          {/* 인증 번호 입력 */}
          {showCodeInput && (
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <label className="text-zinc-600 text-sm font-normal font-['Pretendard']">
                  인증 번호
                </label>
              </div>
              <div
                className={`flex gap-2 border-b px-1 py-3 items-center justify-between transition ${
                  isCodeFocused ? "border-rose-900" : "border-zinc-400"
                }`}
              >
                <div className="flex items-center flex-1 relative">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    onFocus={() => setIsCodeFocused(true)}
                    onBlur={() => setIsCodeFocused(false)}
                    placeholder="인증 번호를 입력해주세요."
                    className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                  />
                  {verificationCode && (
                    <button onClick={handleClearCode}>
                      <img
                        src={cancelIcon}
                        alt="clear"
                        className="w-5 h-5 m-0.5"
                      />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleVerify}
                  disabled={!phoneNumber || !verificationCode || isVerified}
                  className={`flex items-center gap-1 h-8 px-2 py-1 rounded text-sm font-medium font-['Pretendard'] transition ${
                    phoneNumber && verificationCode && !isVerified
                      ? "text-zinc-600"
                      : "text-zinc-300 cursor-default"
                  }`}
                >
                  {isVerified ? (
                    <>
                      <span>인증완료</span>
                      <img
                        src={checkVerificationIcon}
                        alt="verified"
                        className="w-4 h-4"
                      />
                    </>
                  ) : (
                    "인증하기"
                  )}
                </button>
              </div>
              {timeRemaining > 0 && (
                <div>
                  <span className="text-blue-500 text-sm font-medium font-['Pretendard']">
                    남은 시간{" "}
                    {String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:
                    {String(timeRemaining % 60).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[380px] px-4">
        <Toast toast={toast} />
        <SubmitButton
          label="다음"
          onSubmit={() => navigate("/login/signup")}
          isValid={isVerified}
          className="relative w-full"
        />
      </div>
    </div>
  );
}
