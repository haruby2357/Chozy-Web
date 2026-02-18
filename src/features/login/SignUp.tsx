import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkIdDuplicate } from "../../api/auth";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import CheckDuplicateButton from "./components/CheckDuplicateButton";
import cancelIcon from "../../assets/all/cancel.svg";
import checkCircleIcon from "../../assets/all/check-circle.svg";
import eyeOnIcon from "../../assets/login/eye-on.svg";
import eyeOffIcon from "../../assets/login/eye-off.svg";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isUserIdFocused, setIsUserIdFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordConfirmFocused, setIsPasswordConfirmFocused] =
    useState(false);
  const [isIdDuplicated, setIsIdDuplicated] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [userIdErrors, setUserIdErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    icon?: string;
  } | null>(null);

  const verifiedEmail = location.state?.email || "";

  const handleNext = () => {
    // 수집한 모든 정보를 다음 페이지로 넘깁니다.
    navigate("/login/nickname", {
      state: {
        loginId: userId,
        password: password,
        email: verifiedEmail,

        // TODO: 전화번호&이름&국가 정보 받아오면 넘겨주기
        name: "사용자 이름",
        phoneNumber: "01012345678",
        country: "KOREA", // 명세서 기본 국가 정보
      },
    });
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 공백 포함 여부 확인
    const hasSpace = /\s/.test(value);

    // 유효하지 않은 문자가 입력됨 (숫자, 영어 소문자, '_'가 아닌 것, 공백 제외)
    const hasInvalidChars = /[^a-z0-9_\s]/.test(value) && value.length > 0;

    setUserId(value);
    setIsIdChecked(false);

    // 에러 메시지 계산
    const errors: string[] = [];

    // 공백이 있으면 글자수 에러만 표시
    if (hasSpace) {
      if (value.length < 8 || value.length > 12) {
        errors.push("아이디는 8자 이상, 12자 이하로 입력해주세요.");
      }
    } else {
      // 공백이 없을 때만 다른 에러 확인
      if (hasInvalidChars) {
        errors.push("숫자, 영어 소문자, '_'만 사용할 수 있어요.");
      }
      if (value.length > 0) {
        if (value.length < 8 || value.length > 12) {
          errors.push("아이디는 8자 이상, 12자 이하로 입력해주세요.");
        }
      }
    }
    setUserIdErrors(errors);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // 에러 메시지 계산
    const errors: string[] = [];
    if (value.length > 0) {
      if (value.length < 8 || value.length > 16) {
        errors.push("비밀번호는 8자 이상, 16자 이하로 입력해주세요.");
      }
      if (!/[a-zA-Z]/.test(value)) {
        errors.push("영어, 숫자를 포함해주세요.");
      }
      if (!/\d/.test(value)) {
        errors.push("영어, 숫자를 포함해주세요.");
      }
    }
    setPasswordErrors(errors);
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setPasswordConfirm(value);
  };

  const handleClearUserId = () => {
    setUserId("");
    setIsIdChecked(false);
    setUserIdErrors([]);
  };

  const handleClearPassword = () => {
    setPassword("");
    setPasswordErrors([]);
  };

  const handleClearPasswordConfirm = () => {
    setPasswordConfirm("");
  };

  const handleCheckDuplicate = async () => {
    // 실제 중복 확인 로직 (서버 API 호출)
    try {
      const data = await checkIdDuplicate(userId);

      if (data.success && data.result.available) {
        // 명세서의 available 필드 확인
        setIsIdDuplicated(false);
        setIsIdChecked(true);
        setToast({
          message: "사용할 수 있는 아이디에요.",
          type: "success",
          icon: checkCircleIcon,
        });
      } else {
        setIsIdDuplicated(true);
        setIsIdChecked(false);
        setToast({ message: "이미 사용 중인 아이디에요.", type: "error" });
      }
    } catch (error) {
      setToast({
        message: "서버와 통신 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setTimeout(() => setToast(null), 2000);
    }
  };

  const isPasswordValid =
    password.length >= 8 && password !== passwordConfirm
      ? false
      : password === passwordConfirm && password.length > 0;

  const isFormValid =
    isIdChecked && !isIdDuplicated && isPasswordValid && !!userId && !!password;

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* 헤더 */}
      <DetailHeader title="" />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-3 gap-10 pb-24">
        {/* 제목 */}
        <div>
          <p className="text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            아이디와 비밀번호를
          </p>
          <p className="text-zinc-900 text-xl font-semibold font-['Pretendard'] leading-7">
            입력해주세요.
          </p>
        </div>

        <div>
          {/* 아이디 입력 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block">
              아이디
            </label>
            <div
              className={`flex gap-2 border-b px-1 py-3 justify-between items-center transition ${
                isUserIdFocused ? "border-rose-900" : "border-zinc-400"
              }`}
            >
              <div className="flex items-center flex-1 relative">
                <input
                  type="text"
                  value={userId}
                  onChange={handleUserIdChange}
                  onFocus={() => setIsUserIdFocused(true)}
                  onBlur={() => setIsUserIdFocused(false)}
                  placeholder="아이디를 입력해주세요."
                  className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                />
                {userId && (
                  <button onClick={handleClearUserId} className="ml-2">
                    <img
                      src={cancelIcon}
                      alt="clear"
                      className="w-5 h-5 m-0.5"
                    />
                  </button>
                )}
              </div>
              <CheckDuplicateButton
                userId={userId}
                isIdChecked={isIdChecked}
                isIdDuplicated={isIdDuplicated}
                userIdErrors={userIdErrors}
                onCheckDuplicate={handleCheckDuplicate}
              />
            </div>
            {userIdErrors.length > 0 && (
              <div className="mt-2">
                {userIdErrors.map((error, index) => (
                  <p
                    key={index}
                    className="text-red-500 text-xs font-normal font-['Pretendard']"
                  >
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block">
              비밀번호
            </label>
            <div
              className={`flex gap-2 border-b px-1 py-3 justify-between items-center transition ${
                isPasswordFocused ? "border-rose-900" : "border-zinc-400"
              }`}
            >
              <div className="flex items-center flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="비밀번호를 입력해주세요."
                  className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                />
                {password && (
                  <div className="flex gap-2">
                    <button onClick={() => setShowPassword(!showPassword)}>
                      <img
                        src={showPassword ? eyeOnIcon : eyeOffIcon}
                        alt="toggle password"
                        className="w-6 h-6"
                      />
                    </button>
                    <button onClick={handleClearPassword}>
                      <img
                        src={cancelIcon}
                        alt="clear"
                        className="w-5 h-5 m-0.5"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {passwordErrors.length > 0 && (
              <div className="mt-2">
                {passwordErrors.map((error, index) => (
                  <p
                    key={index}
                    className="text-red-500 text-xs font-normal font-['Pretendard']"
                  >
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 비밀번호 확인 입력 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block">
              비밀번호 확인
            </label>
            <div
              className={`flex gap-2 border-b px-1 py-3 justify-between items-center transition ${
                isPasswordConfirmFocused ? "border-rose-900" : "border-zinc-400"
              }`}
            >
              <div className="flex items-center flex-1 relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  onFocus={() => setIsPasswordConfirmFocused(true)}
                  onBlur={() => setIsPasswordConfirmFocused(false)}
                  placeholder="비밀번호를 다시 입력해주세요."
                  className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                />
                {passwordConfirm && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                    >
                      <img
                        src={showPasswordConfirm ? eyeOnIcon : eyeOffIcon}
                        alt="toggle password"
                        className="w-6 h-6"
                      />
                    </button>
                    <button onClick={handleClearPasswordConfirm}>
                      <img
                        src={cancelIcon}
                        alt="clear"
                        className="w-5 h-5 m-0.5"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-5 left-4 right-4">
        <Toast toast={toast} />
        <SubmitButton
          label="다음"
          onSubmit={handleNext}
          isValid={isFormValid}
          className="relative w-full"
        />
      </div>
    </div>
  );
}
