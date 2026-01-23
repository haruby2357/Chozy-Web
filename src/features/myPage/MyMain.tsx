import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Header from "./components/Header";
import bgLogo from "../../assets/mypage/bgLogo.svg";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";

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

function MyMain() {
  const [profile, setProfile] = useState<MyProfile | null>(null);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/me/profile");
      const data: ApiResponse<MyProfile> = await res.json();
      if (data.code === 1000) setProfile(data.result);
      else setProfile(null);
    };
    run();
  }, []);

  const bgUrl = profile?.backgroundImageUrl ?? null; // 배경사진 있으면 그걸 쓰고 없으면 기본
  const profileImg = profile?.profileImageUrl ?? null;
  const statusMessage = profile?.statusMessage ?? "";
  const nickname = profile?.nickname ?? "로그인이 필요합니다.";
  const loginId = profile?.loginId ?? "";

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[256px] bg-[#800025] z-0">
        {bgUrl ? (
          <img src={bgUrl} alt="배경" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src={bgLogo} alt="기본배경" className="opacity-30" />
          </div>
        )}
      </div>
      <div className="relative z-10">
        <Header />
      </div>

      {!!statusMessage && (
        <div className="absolute left-[18px] top-[187px] z-20">
          <div className="flex items-center gap-2 px-2 py-[6px] bg-white/10 backdrop-blur text-white">
            <span className="text-[14px] text-white whitespace-pre-line">
              💬 {statusMessage}
            </span>
          </div>
        </div>
      )}

      <div className="absolute left-4 top-[228px] z-20">
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

      <div className="relative pt-[235px]">
        <div className="px-4 pt-8 pb-5">
          {/* 닉네임/아이디 */}
          <div className="pl-[100px]">
            <div className="text-[16px] font-semibold text-[#191919] mb-1">
              {nickname}
            </div>
            <div className="text-[14px] text-[#B5B5B5] font-medium">
              @{loginId}
            </div>
          </div>

          {/* 버튼 + 카운트 */}
          <div className="mt-4 flex items-center gap-5">
            <button
              type="button"
              className="h-8 ml-4 px-2 py-1 rounded-[4px] bg-[#F9F9F9] text-[#575757] text-[14px] font-medium"
            >
              프로필 수정
            </button>

            <div className="flex-1 grid grid-cols-3 text-left">
              <div>
                <div className="text-[18px] font-semibold text-[#191919]">
                  {profile?.reviewCount ?? 0}
                </div>
                <div className="text-[14px] text-[#191919]">내 후기</div>
              </div>
              <div>
                <div className="text-[18px] font-semibold text-[#191919]">
                  {profile?.followerCount ?? 0}
                </div>
                <div className="text-[14px] text-[#191919]">팔로워</div>
              </div>
              <div>
                <div className="text-[18px] font-semibold text-[#191919]">
                  {profile?.followingCount ?? 0}
                </div>
                <div className="text-[14px] text-[#191919]">팔로잉</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Nav scrollTargetSelector=".scroll-available" />
    </>
  );
}

export default MyMain;
