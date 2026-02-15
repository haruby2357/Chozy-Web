import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeOnboarding } from "../../api/auth";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import cancelIcon from "../../assets/all/cancel.svg";

export default function Nickname() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [nicknameErrors, setNicknameErrors] = useState<string[]>([]);

  const validateNickname = (value: string) => {
    const errors: string[] = [];

    // 한글만 사용 가능 (공백은 허용)
    const hasInvalidChars = /[^가-힣\s]/.test(value) && value.length > 0;
    if (hasInvalidChars) {
      errors.push("닉네임은 한글만 사용할 수 있어요.");
    }

    // 8자 이하
    if (value.length > 8) {
      errors.push("8자 이하로 입력해주세요.");
    }

    return errors;
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    const errors = validateNickname(value);
    setNicknameErrors(errors);
  };

  const handleClearNickname = () => {
    setNickname("");
    setNicknameErrors([]);
  };

  const isFormValid = nickname.length > 0 && nicknameErrors.length === 0;

  const handleComplete = async () => {
    if (!isFormValid) return;

    try {
      // 서버에 닉네임 저장 요청 (온보딩 API 호출)
      const response = await completeOnboarding(nickname);

      if (response.isSuccess) {
        // 성공 시 회원가입 완료 페이지로 이동
        navigate("/login/complete");
      }
    } catch (error: any) {
      // 닉네임 중복 등 에러 처리
      if (error.response?.data?.code === 4094) {
        alert("이미 사용 중인 닉네임이에요.");
      } else {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* 헤더 */}
      <DetailHeader title="" />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-3 gap-10 pb-24">
        {/* 제목 */}
        <div>
          <p className="text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            Chozy에서 사용할
          </p>
          <p className="text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            닉네임을 입력해주세요.
          </p>
        </div>

        <div>
          {/* 닉네임 입력 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block">
              닉네임
            </label>
            <div className="flex gap-2 border-b px-1 py-3 justify-between items-center border-zinc-400 transition">
              <div className="flex items-center flex-1 relative">
                <input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 입력해주세요."
                  className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                />
                {nickname && (
                  <button onClick={handleClearNickname} className="ml-2">
                    <img
                      src={cancelIcon}
                      alt="clear"
                      className="w-5 h-5 m-0.5"
                    />
                  </button>
                )}
              </div>
            </div>
            {nicknameErrors.length > 0 && (
              <div className="mt-2">
                {nicknameErrors.map((error, index) => (
                  <p
                    key={index}
                    className="text-red-500 text-sm font-medium font-['Pretendard']"
                  >
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-5 left-4 right-4">
        <SubmitButton
          label="완료하기"
          onSubmit={handleComplete}
          isValid={isFormValid}
          className="relative w-full"
        />
      </div>
    </div>
  );
}
