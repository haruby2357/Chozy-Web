import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bgLogo from "../../assets/mypage/bgLogo.svg";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";
import backIcon from "../../assets/all/back.svg";
import editIcon from "../../assets/mypage/pencil.svg";
import editPicIcon from "../../assets/mypage/edit-pic.svg";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

type MyProfile = {
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
  statusMessage: string;
  isAccountPublic: boolean;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  isBirthPublic: boolean;
  isHeightPublic: boolean;
  isWeightPublic: boolean;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  bookmarkCount: number;
};

function ProfileEdit() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [formData, setFormData] = useState({
    nickname: "",
    statusMessage: "",
    birthDate: "",
    heightCm: 0,
    weightKg: 0,
    isBirthPublic: false,
    isHeightPublic: false,
    isWeightPublic: false,
    isAccountPublic: false,
    profileImage: null as File | null,
    backgroundImage: null as File | null,
  });
  const [previewImages, setPreviewImages] = useState({
    profile: "",
    background: "",
  });
  const [isEditingStatusMessage, setIsEditingStatusMessage] = useState(false);
  const [imageEditModal, setImageEditModal] = useState<{
    isOpen: boolean;
    type: "profile" | "background" | null;
  }>({ isOpen: false, type: null });
  const [imageSelectModal, setImageSelectModal] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 데이터 조회
  useEffect(() => {
    const run = async () => {
      const res = await fetch("/me/profile");
      const data: ApiResponse<MyProfile> = await res.json();
      if (data.code === 1000) {
        setProfile(data.result);
        setFormData({
          nickname: data.result.nickname,
          statusMessage: data.result.statusMessage,
          birthDate: data.result.birthDate,
          heightCm: data.result.heightCm,
          weightKg: data.result.weightKg,
          isBirthPublic: data.result.isBirthPublic,
          isHeightPublic: data.result.isHeightPublic,
          isWeightPublic: data.result.isWeightPublic,
          isAccountPublic: data.result.isAccountPublic,
          profileImage: null,
          backgroundImage: null,
        });
        setPreviewImages({
          profile: data.result.profileImageUrl || "",
          background: data.result.backgroundImageUrl || "",
        });
      }
    };
    run();
  }, []);

  // 텍스트 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // 상태 메시지는 최대 20자 제한
    if (name === "statusMessage" && value.length > 20) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 숫자 입력 필드 변경 핸들러
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  // 토글 변경 핸들러
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 이미지 파일 선택 핸들러
  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "background",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      if (type === "profile") {
        setFormData((prev) => ({
          ...prev,
          profileImage: file,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          backgroundImage: file,
        }));
      }
    }
  };

  // 입력값 검증
  const validateForm = (): { isValid: boolean; message: string } => {
    // 닉네임 검증
    if (!formData.nickname.trim()) {
      return { isValid: false, message: "닉네임을 입력해주세요." };
    }
    if (formData.nickname.length < 2) {
      return {
        isValid: false,
        message: "닉네임은 최소 2자 이상이어야 합니다.",
      };
    }
    if (formData.nickname.length > 20) {
      return { isValid: false, message: "닉네임은 최대 20자 이하여야 합니다." };
    }

    return { isValid: true, message: "" };
  };

  // 저장 핸들러
  const handleSave = async () => {
    // 입력값 검증
    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    try {
      // FormData 생성
      const data = new FormData();
      data.append("nickname", formData.nickname);
      data.append("statusMessage", formData.statusMessage);
      data.append("birthDate", formData.birthDate);
      data.append("heightCm", formData.heightCm.toString());
      data.append("weightKg", formData.weightKg.toString());
      data.append("isBirthPublic", formData.isBirthPublic.toString());
      data.append("isHeightPublic", formData.isHeightPublic.toString());
      data.append("isWeightPublic", formData.isWeightPublic.toString());
      data.append("isAccountPublic", formData.isAccountPublic.toString());

      // 이미지 파일 추가
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }
      if (formData.backgroundImage) {
        data.append("backgroundImage", formData.backgroundImage);
      }

      // API 요청
      const res = await fetch("/me/profile", {
        method: "PUT",
        body: data,
      });

      const responseData = await res.json();

      if (responseData.code === 1000) {
        // 성공 알림
        alert("프로필이 수정되었습니다.");
        navigate("/mypage");
      } else {
        alert("프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/mypage");
  };

  // 이미지 편집 모달 열기
  const openImageEditModal = (type: "profile" | "background") => {
    setImageSelectModal(false);
    setImageEditModal({ isOpen: true, type });
  };

  // 이미지 파일 선택 클릭
  const handleSelectImage = (type: "profile" | "background") => {
    if (type === "profile") {
      profileFileInputRef.current?.click();
    } else {
      backgroundFileInputRef.current?.click();
    }
  };

  // 기본 이미지로 초기화
  const resetToDefaultImage = (type: "profile" | "background") => {
    if (type === "profile") {
      setPreviewImages((prev) => ({
        ...prev,
        profile: "",
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: null,
      }));
    } else {
      setPreviewImages((prev) => ({
        ...prev,
        background: "",
      }));
      setFormData((prev) => ({
        ...prev,
        backgroundImage: null,
      }));
    }
    setImageEditModal({ isOpen: false, type: null });
  };

  if (!profile) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10">
        <div className="h-12 flex items-center justify-center px-4 pt-[14px] pb-[13px] relative">
          <button
            onClick={handleCancel}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0 absolute left-4"
          >
            <img src={backIcon} className="w-6 h-6" />
          </button>
          <span className="text-center justify-start text-zinc-900 text-lg font-semibold font-['Pretendard']">
            프로필 편집
          </span>
        </div>
      </div>

      {/* 배경 섹션 */}
      <div className="relative w-full h-53 bg-rose-900 flex items-center justify-center">
        <img src={bgLogo} alt="배경" className="opacity-30" />

        {/* 상태 메시지 영역 */}
        <div
          onClick={() => setIsEditingStatusMessage(true)}
          className="absolute bottom-10.5 left-4 flex items-center gap-1 pr-1 py-2 border-b border-white/60 cursor-pointer transition-all"
          style={{
            minHeight: formData.statusMessage ? "auto" : "auto",
            maxWidth: "250px",
          }}
        >
          <img src={editIcon} />
          {isEditingStatusMessage ? (
            <input
              type="text"
              name="statusMessage"
              value={formData.statusMessage}
              onChange={handleInputChange}
              onBlur={() => setIsEditingStatusMessage(false)}
              autoFocus
              maxLength={20}
              placeholder="지금의 상태를 한 줄로 적어봐요!"
              className="bg-transparent text-white placeholder-white/60 text-sm font-medium font-['Pretendard'] outline-none"
            />
          ) : (
            <span className="text-white/60 text-sm font-medium font-['Pretendard']">
              {formData.statusMessage || "지금의 상태를 한 줄로 적어봐요!"}
            </span>
          )}
        </div>
      </div>

      {/* 컨텐트 영역 */}
      <div className="px-4">
        {/* 프로필 이미지 */}
        <div className="absolute w-20 h-20 top-58 left-4">
          <img src={defaultProfile} alt="프로필" className="w-20 h-20" />
          {/* 프로필 이미지 편집 아이콘 */}
          <img
            src={editPicIcon}
            alt="프로필 편집"
            className="absolute bottom-0 right-0 w-6 h-6 cursor-pointer"
            onClick={() => setImageSelectModal(true)}
          />
        </div>

        {/* 숨김 파일 입력 */}
        <input
          ref={profileFileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(e, "profile")}
          className="hidden"
        />
        <input
          ref={backgroundFileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(e, "background")}
          className="hidden"
        />

        {/* 입력 필드 섹션 */}
        <div className="space-y-4">
          {/* 아이디 (읽기 전용) */}
          <div>
            <label className="block text-[14px] font-medium text-[#191919] mb-2">
              아이디
            </label>
            <input
              type="text"
              value={profile.loginId}
              disabled
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] bg-[#F9F9F9] text-[#B5B5B5] text-[14px]"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-[14px] font-medium text-[#191919] mb-2">
              닉네임
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              maxLength={20}
              placeholder="닉네임을 입력하세요"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] text-[14px] focus:outline-none focus:border-[#800025]"
            />
            <div className="text-right text-[12px] text-[#B5B5B5] mt-1">
              {formData.nickname.length}/20
            </div>
          </div>

          {/* 생일 */}
          <div>
            <label className="block text-[14px] font-medium text-[#191919] mb-2">
              생일
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] text-[14px] focus:outline-none focus:border-[#800025]"
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isBirthPublic"
                name="isBirthPublic"
                checked={formData.isBirthPublic}
                onChange={handleToggleChange}
                className="cursor-pointer"
              />
              <label
                htmlFor="isBirthPublic"
                className="text-[12px] text-[#575757] cursor-pointer"
              >
                생일 공개
              </label>
            </div>

            {/* 키/몸무게 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-medium text-[#191919] mb-2">
                  키 (cm)
                </label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm || ""}
                  onChange={handleNumberInputChange}
                  placeholder="0"
                  min="0"
                  max="300"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] text-[14px] focus:outline-none focus:border-[#800025]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="isHeightPublic"
                    name="isHeightPublic"
                    checked={formData.isHeightPublic}
                    onChange={handleToggleChange}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="isHeightPublic"
                    className="text-[12px] text-[#575757] cursor-pointer"
                  >
                    공개
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#191919] mb-2">
                  몸무게 (kg)
                </label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg || ""}
                  onChange={handleNumberInputChange}
                  placeholder="0"
                  min="0"
                  max="300"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] text-[14px] focus:outline-none focus:border-[#800025]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="isWeightPublic"
                    name="isWeightPublic"
                    checked={formData.isWeightPublic}
                    onChange={handleToggleChange}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="isWeightPublic"
                    className="text-[12px] text-[#575757] cursor-pointer"
                  >
                    공개
                  </label>
                </div>
              </div>
            </div>

            {/* 계정 공개 여부 */}
            <div className="py-3 border-t border-[#E5E5E5] mt-6">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="isAccountPublic"
                  className="text-[14px] font-medium text-[#191919] cursor-pointer"
                >
                  계정 공개 여부
                </label>
                <input
                  type="checkbox"
                  id="isAccountPublic"
                  name="isAccountPublic"
                  checked={formData.isAccountPublic}
                  onChange={handleToggleChange}
                  className="cursor-pointer"
                />
              </div>
              <div className="text-[12px] text-[#B5B5B5] mt-1">
                {formData.isAccountPublic
                  ? "공개 계정입니다."
                  : "비공개 계정입니다."}
              </div>
            </div>
          </div>
        </div>

        {/* 하단바 - 저장하기 섹션 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] px-4 py-3 flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-[44px] bg-[#800025] text-white font-medium rounded-[6px] text-[14px]"
          >
            저장하기
          </button>
        </div>
      </div>

      {/* 이미지 선택 모달 (프로필 또는 배경) */}
      {imageSelectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-2xl p-4">
            {/* 모달 옵션 */}
            <div className="space-y-3 mt-4">
              <button
                type="button"
                onClick={() => openImageEditModal("profile")}
                className="w-full py-3 text-center text-[14px] font-medium text-[#191919] bg-[#F9F9F9] rounded-[6px]"
              >
                프로필 사진 변경
              </button>

              <button
                type="button"
                onClick={() => openImageEditModal("background")}
                className="w-full py-3 text-center text-[14px] font-medium text-[#191919] bg-[#F9F9F9] rounded-[6px]"
              >
                배경 사진 변경
              </button>

              {/* 취소 버튼 */}
              <button
                type="button"
                onClick={() => setImageSelectModal(false)}
                className="w-full py-3 text-center text-[14px] font-medium text-[#191919] border border-[#E5E5E5] rounded-[6px]"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 편집 모달 */}
      {imageEditModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-2xl p-4 animate-in">
            {/* 모달 헤더 */}
            <div className="text-center pb-4 border-b border-[#E5E5E5]">
              <h3 className="text-[16px] font-semibold text-[#191919]">
                {imageEditModal.type === "profile"
                  ? "프로필 사진"
                  : "배경 사진"}
              </h3>
            </div>

            {/* 모달 옵션 */}
            <div className="space-y-3 mt-4">
              {/* 첫 번째 옵션: 기본 이미지로 변경 (사진이 있을 때만) */}
              {((imageEditModal.type === "profile" && previewImages.profile) ||
                (imageEditModal.type === "background" &&
                  previewImages.background)) && (
                <button
                  type="button"
                  onClick={() => {
                    resetToDefaultImage(imageEditModal.type!);
                  }}
                  className="w-full py-3 text-center text-[14px] font-medium text-[#191919] bg-[#F9F9F9] rounded-[6px]"
                >
                  기본 이미지로 변경
                </button>
              )}

              {/* 두 번째 옵션: 파일에서 가져오기 */}
              <button
                type="button"
                onClick={() => {
                  handleSelectImage(imageEditModal.type!);
                  setImageEditModal({ isOpen: false, type: null });
                }}
                className="w-full py-3 text-center text-[14px] font-medium text-[#191919] bg-[#F9F9F9] rounded-[6px]"
              >
                내 파일에서 가져오기
              </button>

              {/* 취소 버튼 */}
              <button
                type="button"
                onClick={() => setImageEditModal({ isOpen: false, type: null })}
                className="w-full py-3 text-center text-[14px] font-medium text-[#191919] border border-[#E5E5E5] rounded-[6px]"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileEdit;
