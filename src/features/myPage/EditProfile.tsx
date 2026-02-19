import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mypageApi } from "../../api";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";
import bgLogo from "../../assets/mypage/bgLogo.svg";
import pencil from "../../assets/mypage/pencil.svg";
import editPic from "../../assets/mypage/edit-pic.svg";
import cancelIcon from "../../assets/all/cancel.svg";

export default function EditProfile() {
  const navigate = useNavigate();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [profile, setProfile] = useState<mypageApi.MyProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    statusMessage: "",
    nickname: "",
    birthDate: "",
    heightCm: "",
    weightKg: "",
    isAccountPublic: true,
    isBirthPublic: false,
    isHeightPublic: false,
    isWeightPublic: false,
    profileImageUrl: "",
    backgroundImageUrl: "",
  });

  const [_, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );

  const [, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [nicknameErrors, setNicknameErrors] = useState<string[]>([]);
  const [birthDateErrors, setBirthDateErrors] = useState<string[]>([]);
  const [heightCmErrors, setHeightCmErrors] = useState<string[]>([]);
  const [weightKgErrors, setWeightKgErrors] = useState<string[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await mypageApi.getMyProfile();
        if (data.code === 1000 && data.result) {
          setProfile(data.result);
          setFormData({
            statusMessage: data.result.statusMessage ?? "",
            nickname: data.result.nickname ?? "",
            birthDate: data.result.birthDate
              ? data.result.birthDate.replace(/-/g, ".")
              : "",
            heightCm: data.result.heightCm ? String(data.result.heightCm) : "",
            weightKg: data.result.weightKg ? String(data.result.weightKg) : "",
            isAccountPublic: data.result.isAccountPublic ?? true,
            isBirthPublic: data.result.isBirthPublic ?? false,
            isHeightPublic: data.result.isHeightPublic ?? false,
            isWeightPublic: data.result.isWeightPublic ?? false,
            profileImageUrl: data.result.profileImageUrl ?? "",
            backgroundImageUrl: data.result.backgroundImageUrl ?? "",
          });
          setProfileImagePreview(data.result.profileImageUrl);
          setBackgroundImagePreview(data.result.backgroundImageUrl);
        }
      } catch (error) {
        console.error("프로필 로드 실패:", error);
        navigate("/mypage");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, [navigate]);

  const isFormValid =
    !!formData.nickname.trim() &&
    nicknameErrors.length === 0 &&
    (formData.birthDate.length === 0 ||
      (formData.birthDate.length === 10 && birthDateErrors.length === 0)) &&
    heightCmErrors.length === 0 &&
    weightKgErrors.length === 0;

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

  const validateBirthDate = (value: string): string[] => {
    const errors: string[] = [];

    // 빈 값이면 에러 없음
    if (value.length === 0) {
      return errors;
    }

    // 형식 확인 (YYYY.MM.DD 형식)
    const parts = value.split(".");
    if (
      parts.length !== 3 ||
      parts[0].length !== 4 ||
      parts[1].length !== 2 ||
      parts[2].length !== 2
    ) {
      errors.push("생일 형식을 올바르게 입력해주세요.");
      return errors;
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // 유효한 날짜인지 확인
    const birthDate = new Date(year, month - 1, day);
    const isValidDate =
      birthDate.getFullYear() === year &&
      birthDate.getMonth() === month - 1 &&
      birthDate.getDate() === day;

    if (!isValidDate) {
      errors.push("생일 형식을 올바르게 입력해주세요.");
      return errors;
    }

    // 미래 날짜인지 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    birthDate.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      errors.push("생일은 오늘보다 이전 날짜여야 합니다.");
    }

    return errors;
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatBirthDateForServer = (displayFormat: string): string => {
    // "2004.12.12" → "2004-12-12"
    return displayFormat.replace(/\./g, "-");
  };

  const validateHeightCm = (value: string): string[] => {
    const errors: string[] = [];

    if (value.length === 0) {
      return errors;
    }

    const height = parseInt(value, 10);
    if (height < 100 || height > 220) {
      errors.push("키는 100~220cm 사이로 입력해주세요.");
    }

    return errors;
  };

  const validateWeightKg = (value: string): string[] => {
    const errors: string[] = [];

    if (value.length === 0) {
      return errors;
    }

    const weight = parseInt(value, 10);
    if (weight < 20 || weight > 200) {
      errors.push("몸무게는 20~200kg 사이로 입력해주세요.");
    }

    return errors;
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleTextChange("nickname", value);
    const errors = validateNickname(value);
    setNicknameErrors(errors);
  };

  const handleClearNickname = () => {
    handleTextChange("nickname", "");
    setNicknameErrors([]);
  };

  const handleClearBirthDate = () => {
    handleTextChange("birthDate", "");
    setBirthDateErrors([]);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출

    // 8글자까지만 입력 가능
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // 마침표 자동 추가 (4번째, 6번째 위치)
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i === 4 || i === 6) {
        formatted += ".";
      }
      formatted += value[i];
    }

    handleTextChange("birthDate", formatted);

    // 유효성 검사
    const errors = validateBirthDate(formatted);
    setBirthDateErrors(errors);
  };

  const handleHeightCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출

    // 3글자까지만 입력 가능
    if (value.length > 3) {
      value = value.slice(0, 3);
    }

    handleTextChange("heightCm", value);
  };

  const handleHeightCmBlur = () => {
    const errors = validateHeightCm(formData.heightCm);
    setHeightCmErrors(errors);
  };

  const handleWeightKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출

    // 3글자까지만 입력 가능
    if (value.length > 3) {
      value = value.slice(0, 3);
    }

    handleTextChange("weightKg", value);
  };

  const handleWeightKgBlur = () => {
    const errors = validateWeightKg(formData.weightKg);
    setWeightKgErrors(errors);
  };

  const handleTextChange = (
    field: keyof typeof formData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleChange = (field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setProfileImagePreview(dataUrl);
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setBackgroundImagePreview(dataUrl);
        setFormData((prev) => ({
          ...prev,
          backgroundImageUrl: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const updateData: mypageApi.UpdateProfileRequest = {
        nickname: formData.nickname,
        statusMessage: formData.statusMessage || null,
        birthDate: formData.birthDate
          ? formatBirthDateForServer(formData.birthDate)
          : undefined,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        isAccountPublic: formData.isAccountPublic,
        isBirthPublic: formData.isBirthPublic,
        isHeightPublic: formData.isHeightPublic,
        isWeightPublic: formData.isWeightPublic,
        profileImageUrl: formData.profileImageUrl || null,
        backgroundImageUrl: formData.backgroundImageUrl || null,
      };

      const response = await mypageApi.updateProfile(updateData);

      if (response.code === 1000 && response.result) {
        showToast("프로필이 수정되었습니다.", "success");
        setTimeout(() => navigate("/mypage"), 500);
      } else {
        // 에러 코드별 처리
        const errorMessage = getErrorMessage(response.code);
        showToast(errorMessage, "error");

        // 인증 관련 에러는 로그인 페이지로 이동
        if ([4012, 4030, 4040].includes(response.code)) {
          setTimeout(() => navigate("/login"), 1500);
        }
      }
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      showToast("프로필 수정에 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (code: number): string => {
    switch (code) {
      case 4012:
        return "인증이 필요합니다.";
      case 4030:
        return "비활성화된 계정입니다.";
      case 4040:
        return "사용자 정보를 찾을 수 없습니다.";
      case 4001:
        return "요청 값이 올바르지 않습니다.";
      case 4094:
        return "이미 사용 중인 닉네임입니다.";
      case 4002:
        return "이미지 URL 형식이 올바르지 않습니다.";
      case 5000:
        return "서버 내부 오류가 발생했습니다.";
      default:
        return "오류가 발생했습니다.";
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <p className="text-[14px] text-[#B5B5B5]">로딩 중...</p>
      </div>
    );
  }

  const bgUrl = backgroundImagePreview ?? null;
  const profileImg = profileImagePreview ?? null;

  return (
    <div className="relative h-dvh overflow-hidden bg-white flex flex-col">
      <DetailHeader title="프로필 편집" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Background Image Section */}
        <div className="relative">
          <div className="h-[200px] bg-[#800025] overflow-hidden">
            {bgUrl ? (
              <img
                src={bgUrl}
                alt="배경"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img src={bgLogo} alt="기본배경" className="opacity-30" />
              </div>
            )}
          </div>

          {/* Background Edit Button */}
          <button
            type="button"
            onClick={() => backgroundImageInputRef.current?.click()}
            className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 rounded-full text-[12px] text-[#191919] font-medium hover:bg-white transition-colors"
          >
            사진 변경
          </button>

          {/* Profile Image */}
          <div className="absolute left-4 top-[180px] z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-white inline-block">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F9F9F9]">
                  <img src={defaultProfile} alt="프로필" />
                </div>
              )}
            </div>

            {/* Profile Edit Button */}
            <button
              type="button"
              onClick={() => profileImageInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img src={editPic} alt="프로필 수정" className="w-7 h-7" />
            </button>
          </div>

          {/* 상태 메시지 */}
          <div className="absolute left-4 top-36 z-20 flex items-center gap-2">
            <img src={pencil} alt="연필" className="w-4 h-4 shrink-0" />
            <input
              type="text"
              value={formData.statusMessage}
              onChange={(e) =>
                handleTextChange("statusMessage", e.target.value.slice(0, 20))
              }
              maxLength={20}
              placeholder="지금의 상태를 한 줄로 적어봐요!"
              className="px-0 py-0 border-0 border-b border-white/60 bg-transparent text-[14px] text-white placeholder-white/70 focus:outline-none"
              style={{
                width: formData.statusMessage
                  ? `${Math.min(formData.statusMessage.length, 20) * 8.4 + 20}px`
                  : "220px",
              }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="pt-20 px-4 pb-6 space-y-6">
          {/* 아이디 */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-neutral-500 text-sm font-medium font-['Pretendard']">
                아이디
              </label>
              <span className="text-[#800025] text-[12px]">*</span>
            </div>
            <input
              type="text"
              value={profile?.loginId || ""}
              disabled
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[14px] text-[#B5B5B5] bg-[#F9F9F9] cursor-not-allowed"
            />
          </div>

          {/* 닉네임 */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-neutral-500 text-sm font-medium font-['Pretendard']">
                닉네임
              </label>
              <span className="text-rose-900 text-base font-medium font-['Pretendard']">
                *
              </span>
            </div>
            <div className="flex gap-2 border-b px-1 py-3 justify-between items-center border-zinc-400 transition focus-within:border-rose-900">
              <div className="flex items-center m-0 flex-1 relative">
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 입력해주세요."
                  className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                />
                {formData.nickname && (
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

          {/* 생일 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block mb-2">
              생일
            </label>
            <div className="flex gap-2 border-b px-1 py-3 justify-between items-center border-zinc-400 transition focus-within:border-rose-900">
              <div className="flex items-center flex-1 relative">
                <input
                  type="text"
                  value={formData.birthDate}
                  onChange={handleBirthDateChange}
                  placeholder="YYYY.MM.DD"
                  className="w-full text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none caret-rose-900"
                />
                {formData.birthDate && (
                  <button onClick={handleClearBirthDate} className="ml-2">
                    <img
                      src={cancelIcon}
                      alt="clear"
                      className="w-5 h-5 m-0.5"
                    />
                  </button>
                )}
              </div>
            </div>
            {birthDateErrors.length > 0 && (
              <div className="mt-2">
                {birthDateErrors.map((error, index) => (
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

          {/* 키/몸무게 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block mb-2">
              키 / 몸무게
            </label>
            <div className="flex gap-4">
              <div>
                <div className="flex gap-2 px-1 py-3 items-center">
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={handleHeightCmChange}
                    onBlur={handleHeightCmBlur}
                    placeholder="0"
                    className="w-13 border-b border-zinc-400 text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none focus:border-rose-900 caret-rose-900 text-right transition"
                  />
                  <span className="text-zinc-400 text-base font-medium font-['Pretendard'] ml-2">
                    cm
                  </span>
                </div>
              </div>
              <div>
                <div className="flex gap-2 px-1 py-3 items-center">
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={handleWeightKgChange}
                    onBlur={handleWeightKgBlur}
                    placeholder="0"
                    className="w-13 border-b border-zinc-400 text-zinc-900 text-base font-medium placeholder:text-zinc-400 placeholder:text-base placeholder:font-medium font-['Pretendard'] focus:outline-none focus:border-rose-900 caret-rose-900 text-right transition"
                  />
                  <span className="text-zinc-400 text-base font-medium font-['Pretendard'] ml-2">
                    kg
                  </span>
                </div>
              </div>
            </div>
            {(heightCmErrors.length > 0 || weightKgErrors.length > 0) && (
              <div className="mt-2 space-y-1">
                {heightCmErrors.map((error, index) => (
                  <p
                    key={`height-${index}`}
                    className="text-red-500 text-sm font-medium font-['Pretendard']"
                  >
                    {error}
                  </p>
                ))}
                {weightKgErrors.map((error, index) => (
                  <p
                    key={`weight-${index}`}
                    className="text-red-500 text-sm font-medium font-['Pretendard']"
                  >
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 계정 공개 여부 */}
          <div className="mb-6">
            <label className="text-neutral-500 text-sm font-medium font-['Pretendard'] block mb-2">
              계정 공개 여부
            </label>
            <button
              type="button"
              onClick={() => handleToggleChange("isAccountPublic")}
              className="w-full flex items-center justify-between p-3 border border-[#E5E5E5] rounded-lg hover:bg-[#F9F9F9] transition-colors"
            >
              <span className="text-[14px] text-[#191919] font-medium">
                공개
              </span>
              <div
                className={`w-12 h-7 rounded-full transition-colors ${
                  formData.isAccountPublic ? "bg-[#800025]" : "bg-[#E5E5E5]"
                } flex items-center px-1`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    formData.isAccountPublic ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </button>

            {/* 공개 범위 설명 */}
            <p className="text-[12px] text-[#B5B5B5] mt-2">
              계정을 비공개로 설정하면 팔로워에게만 내 콘텐츠가 공개돼요.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-4 py-4 pb-8 sticky bottom-0 bg-gradient-to-t from-white to-white/95">
          <SubmitButton
            isValid={isFormValid}
            isLoading={isLoading}
            onSubmit={handleSave}
            label="저장하기"
            loadingLabel="저장 중"
            className="w-full text-[16px]"
          />
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={profileImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        className="hidden"
      />
      <input
        ref={backgroundImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundImageChange}
        className="hidden"
      />

      <Toast
        toast={
          toast
            ? {
                message: toast.message,
                type: toast.type,
              }
            : null
        }
      />
    </div>
  );
}
