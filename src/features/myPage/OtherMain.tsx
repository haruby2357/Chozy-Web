import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../../components/Nav";
import Header from "./components/Header";

import bgLogo from "../../assets/mypage/bgLogo.svg";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";
import birth from "../../assets/mypage/birth.svg";
import height from "../../assets/mypage/height.svg";

import {
  getOtherProfile,
  toUiOtherProfile,
  type OtherProfileUi,
} from "../../api/domains/mypage/otherProfile";

export default function OtherMain() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { userId } = useParams<{ userId: string }>();
  const targetUserPk = Number(userId);

  const [profile, setProfile] = useState<OtherProfileUi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !Number.isFinite(targetUserPk)) {
      console.error("Invalid targetUserPk:", userId);
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const data = await getOtherProfile(targetUserPk);

        if (data.code !== 1000) {
          throw new Error(data.message ?? "타인 프로필 조회 실패");
        }

        const uiProfile = toUiOtherProfile(data.result);
        setProfile(uiProfile);
      } catch (e) {
        console.error("타인 프로필 로딩 실패:", e);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserPk, userId]);

  /* =========================
     UI 계산 영역
  ========================= */

  const bgUrl = profile?.backgroundImageUrl ?? null;
  const profileImg = profile?.profileImageUrl ?? null;
  const statusMessage = profile?.statusMessage ?? "";
  const nickname = profile?.nickname ?? "";
  const loginIdText = profile?.loginId ?? "";

  const birthText =
    profile?.isBirthPublic && profile?.birthDate ? profile.birthDate : null;

  const bodyText =
    (profile?.isHeightPublic || profile?.isWeightPublic) &&
    (profile?.heightCm || profile?.weightKg)
      ? `${profile?.isHeightPublic ? `${profile?.heightCm ?? ""}cm` : ""}${
          profile?.isHeightPublic && profile?.isWeightPublic ? " / " : ""
        }${profile?.isWeightPublic ? `${profile?.weightKg ?? ""}kg` : ""}`
      : null;

  const isPublic = profile?.isAccountPublic ?? false;

  /* =========================
     렌더링
  ========================= */

  return (
    <div className="relative h-dvh overflow-hidden bg-white">
      {/* 상단 배경 */}
      <div className="absolute top-0 left-0 right-0 h-[256px] bg-[#800025] z-0">
        {bgUrl ? (
          <img src={bgUrl} alt="배경" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src={bgLogo} alt="기본배경" className="opacity-30" />
          </div>
        )}
      </div>

      <div className="relative z-30">
        <Header />
      </div>

      {!!statusMessage && (
        <div className="absolute left-[18px] top-[187px] z-50">
          <div className="flex items-center gap-2 px-2 py-[6px] bg-white/10 backdrop-blur text-white">
            <span className="text-[14px] whitespace-pre-line">
              💬 {statusMessage}
            </span>
          </div>
        </div>
      )}

      {/* 프로필 이미지 */}
      <div className="absolute left-4 top-[228px] z-30">
        <div className="w-19 h-19 rounded-full overflow-hidden">
          {profileImg ? (
            <img
              src={profileImg}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img src={defaultProfile} alt="프로필" />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 flex h-full flex-col">
        {/* 프로필 정보 */}
        <div className="mt-[256px] bg-white shrink-0">
          <div className="px-4 pt-3 pb-5">
            <div className="pl-[100px] flex items-center justify-between">
              <div>
                <div className="text-[16px] font-semibold mb-1 text-[#191919]">
                  {loading ? "불러오는 중..." : nickname}
                </div>

                {loginIdText && (
                  <div className="text-[14px] text-[#B5B5B5] font-medium">
                    @{loginIdText}
                  </div>
                )}

                {(birthText || bodyText) && (
                  <div className="mt-2 flex flex-col gap-1 text-[14px] text-[#B5B5B5] font-medium">
                    {birthText && (
                      <div className="flex items-center gap-1">
                        <img src={birth} alt="생일" />
                        <span>{birthText}</span>
                      </div>
                    )}
                    {bodyText && (
                      <div className="flex items-center gap-1">
                        <img src={height} alt="키몸무게" />
                        <span>{bodyText}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="h-8 px-3 py-1 rounded-[4px] bg-[#800025] text-white text-[14px] font-medium"
              >
                팔로우
              </button>
            </div>

            <div className="mt-4 pl-[100px] flex items-center gap-5">
              <div className="flex-1 grid grid-cols-3 text-left">
                <div>
                  <div className="text-[18px] font-semibold">
                    {profile?.reviewCount ?? 0}
                  </div>
                  <div className="text-[14px]">내 후기</div>
                </div>

                <div className="cursor-pointer">
                  <div className="text-[18px] font-semibold">
                    {profile?.followerCount ?? 0}
                  </div>
                  <div className="text-[14px]">팔로워</div>
                </div>

                <div className="cursor-pointer">
                  <div className="text-[18px] font-semibold">
                    {profile?.followingCount ?? 0}
                  </div>
                  <div className="text-[14px]">팔로잉</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 영역 */}
        <div
          ref={scrollRef}
          className="scroll-available flex-1 overflow-y-auto bg-[#F9F9F9]"
        >
          {loading ? (
            <div className="flex justify-center py-40 text-[#B5B5B5]">
              로딩중...
            </div>
          ) : !profile ? (
            <div className="flex justify-center py-40 text-[#B5B5B5]">
              프로필 정보를 불러올 수 없어요.
            </div>
          ) : !isPublic ? (
            <div className="flex justify-center py-40 text-[#B5B5B5]">
              공개되지 않은 계정입니다.
            </div>
          ) : (
            <div className="flex justify-center py-40 text-[#B5B5B5]">
              게시글 리스트 영역 (연동 예정)
            </div>
          )}
        </div>
      </div>

      <Nav scrollTargetSelector=".scroll-available" />
    </div>
  );
}
