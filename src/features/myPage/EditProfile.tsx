import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mypageApi } from "../../api";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";
import bgLogo from "../../assets/mypage/bgLogo.svg";

export default function EditProfile() {
  const navigate = useNavigate();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await mypageApi.getMyProfile();
        if (data.code === 1000 && data.result) {
          setProfile(data.result);
          setFormData({
            statusMessage: data.result.statusMessage ?? "",
            nickname: data.result.nickname ?? "",
            birthDate: data.result.birthDate ?? "",
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

  const isFormValid = !!formData.nickname.trim();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
        birthDate: formData.birthDate || undefined,
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
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#800025] flex items-center justify-center text-white text-[12px] font-bold hover:bg-[#650019] transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="pt-[40px] px-4 pb-6 space-y-6">
          {/* 상태 메시지 */}
          <div>
            <label className="block text-[12px] font-medium text-[#191919] mb-2">
              상태
            </label>
            <textarea
              value={formData.statusMessage}
              onChange={(e) =>
                handleTextChange("statusMessage", e.target.value)
              }
              placeholder="상태 메시지를 입력해주세요"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[14px] text-[#191919] placeholder-[#B5B5B5] focus:outline-none focus:border-[#800025] resize-none"
              rows={2}
            />
          </div>

          {/* 아이디 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-[12px] font-medium text-[#191919]">
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
            <p className="text-[12px] text-[#B5B5B5] mt-1">
              아이디는 변경할 수 없습니다
            </p>
          </div>

          {/* 닉네임 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-[12px] font-medium text-[#191919]">
                닉네임
              </label>
              <span className="text-[#800025] text-[12px]">*</span>
            </div>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleTextChange("nickname", e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[14px] text-[#191919] placeholder-[#B5B5B5] focus:outline-none focus:border-[#800025]"
            />
          </div>

          {/* 생일 */}
          <div>
            <label className="block text-[12px] font-medium text-[#191919] mb-2">
              생일
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleTextChange("birthDate", e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[14px] text-[#191919] focus:outline-none focus:border-[#800025]"
            />
          </div>

          {/* 키/몸무게 */}
          <div>
            <label className="block text-[12px] font-medium text-[#191919] mb-2">
              키 / 몸무게
            </label>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => handleTextChange("heightCm", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[14px] text-[#191919] placeholder-[#B5B5B5] focus:outline-none focus:border-[#800025] text-right"
                />
                <p className="text-[12px] text-[#B5B5B5] mt-1 text-center">
                  cm
                </p>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => handleTextChange("weightKg", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[14px] text-[#191919] placeholder-[#B5B5B5] focus:outline-none focus:border-[#800025] text-right"
                />
                <p className="text-[12px] text-[#B5B5B5] mt-1 text-center">
                  kg
                </p>
              </div>
            </div>
          </div>

          {/* 계정 공개 여부 */}
          <div>
            <label className="block text-[12px] font-medium text-[#191919] mb-2">
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
              계정 비공개로 설정하면 팔로워와 차단된 사용자에게 프로필이
              표시됩니다
            </p>
          </div>

          {/* 공개 범위 설정들 */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[12px] text-[#191919] font-medium">
                생일 공개
              </label>
              <button
                type="button"
                onClick={() => handleToggleChange("isBirthPublic")}
                className={`w-10 h-6 rounded-full transition-colors ${
                  formData.isBirthPublic ? "bg-[#800025]" : "bg-[#E5E5E5]"
                } flex items-center px-1`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formData.isBirthPublic ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[12px] text-[#191919] font-medium">
                키 공개
              </label>
              <button
                type="button"
                onClick={() => handleToggleChange("isHeightPublic")}
                className={`w-10 h-6 rounded-full transition-colors ${
                  formData.isHeightPublic ? "bg-[#800025]" : "bg-[#E5E5E5]"
                } flex items-center px-1`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formData.isHeightPublic ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[12px] text-[#191919] font-medium">
                몸무게 공개
              </label>
              <button
                type="button"
                onClick={() => handleToggleChange("isWeightPublic")}
                className={`w-10 h-6 rounded-full transition-colors ${
                  formData.isWeightPublic ? "bg-[#800025]" : "bg-[#E5E5E5]"
                } flex items-center px-1`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formData.isWeightPublic ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>
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
