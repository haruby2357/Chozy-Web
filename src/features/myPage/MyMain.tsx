import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import bgLogo from "../../assets/mypage/bgLogo.svg";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";
import birth from "../../assets/mypage/birth.svg";
import height from "../../assets/mypage/height.svg";

import PostList from "../comm/components/PostList";
import { mypageApi } from "../../api";

type Tab = "reviews" | "bookmarks";

function MyMain() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<mypageApi.MyProfile | null>(null);
  const [tab, setTab] = useState<Tab>("reviews");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await mypageApi.getMyProfile();
        if (data.code === 1000) setProfile(data.result);
        else setProfile(null);
      } catch {
        setProfile(null);
      }
    };
    run();
  }, []);

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollTop();
  }, [tab]);

  const handleTabChange = (next: Tab) => {
    if (next === tab) {
      scrollTop();
      return;
    }
    setTab(next);
  };

  const handleEditProfile = () => {
    if (!profile?.loginId) {
      navigate("/login");
      return;
    }
    navigate("/mypage/edit");
  };

  const isLoggedIn = !!profile?.loginId;
  const bgUrl = profile?.backgroundImageUrl ?? null; // 배경사진 있으면 그걸 쓰고 없으면 기본
  const profileImg = profile?.profileImageUrl ?? null;
  const statusMessage = profile?.statusMessage ?? "";
  const nickname = profile?.nickname ?? "로그인이 필요합니다.";
  const loginId = profile?.loginId ?? "";

  const birthText =
    profile?.isBirthPublic && profile?.birthDate ? profile.birthDate : null;

  const bodyText =
    profile?.isHeightPublic || profile?.isWeightPublic
      ? `${profile?.isHeightPublic ? `${profile?.heightCm ?? ""}cm` : ""}${
          profile?.isHeightPublic && profile?.isWeightPublic ? " / " : ""
        }${profile?.isWeightPublic ? `${profile?.weightKg ?? ""}kg` : ""}`
      : null;

  return (
    <div className="relative h-dvh overflow-hidden bg-white">
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
            <span className="text-[14px] text-white whitespace-pre-line">
              💬 {statusMessage}
            </span>
          </div>
        </div>
      )}

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
        <div className="mt-[256px] bg-white shrink-0">
          <div className="px-4 pt-3 pb-5">
            {/* 닉네임/아이디 */}
            <div className="pl-[100px]">
              <div
                role={!isLoggedIn ? "button" : undefined}
                tabIndex={!isLoggedIn ? 0 : -1}
                onClick={() => {
                  if (!isLoggedIn) navigate("/login");
                }}
                onKeyDown={(e) => {
                  if (!isLoggedIn && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    navigate("/login");
                  }
                }}
                className={`text-[16px] font-semibold mb-1 text-[#191919] ${
                  !isLoggedIn ? "underline cursor-pointer" : ""
                }`}
              >
                {isLoggedIn ? nickname : "로그인이 필요합니다."}
              </div>
              {loginId && (
                <div className="text-[14px] text-[#B5B5B5] font-medium">
                  @{loginId}
                </div>
              )}
              {(birthText || bodyText) && (
                <div className="mt-2 flex flex-col gap-1 text-[14px] text-[#B5B5B5] font-medium">
                  {birthText && (
                    <div className="flex flex-row gap-0.5">
                      <img src={birth} alt="생일" />
                      <span>{birthText}</span>
                    </div>
                  )}
                  {bodyText && (
                    <div className="flex flex-row gap-0.5">
                      <img src={height} alt="키몸무게" />
                      <span>{bodyText}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-5">
              <button
                type="button"
                onClick={handleEditProfile}
                className="h-8 ml-4 px-2 py-1 rounded-[4px] bg-[#F9F9F9] text-[#575757] text-[14px] font-medium hover:bg-[#F0F0F0] transition-colors"
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
                <div
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate("/login");
                      return;
                    }

                    navigate("/mypage/followings", {
                      state: { userId: loginId, defaultTab: "followers" },
                    });
                  }}
                >
                  <div className="text-[18px] font-semibold text-[#191919]">
                    {profile?.followerCount ?? 0}
                  </div>
                  <div className="text-[14px] text-[#191919]">팔로워</div>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate("/login");
                      return;
                    }

                    navigate("/mypage/followings", {
                      state: { userId: loginId, defaultTab: "followings" },
                    });
                  }}
                >
                  <div className="text-[18px] font-semibold text-[#191919]">
                    {profile?.followingCount ?? 0}
                  </div>
                  <div className="text-[14px] text-[#191919]">팔로잉</div>
                </div>
              </div>
            </div>
          </div>

          <TabBar value={tab} onChange={handleTabChange} />
        </div>

        <div
          ref={scrollRef}
          className="scroll-available flex-1 overflow-y-auto bg-[#F9F9F9] scrollbar-hide"
        >
          <PostList
            contentType="ALL"
            fetchFeeds={() =>
              tab === "reviews"
                ? mypageApi.getMyFeeds({ page: 0, size: 20, sort: "latest" })
                : mypageApi.getMyBookmarks({ page: 0, size: 20 })
            }
            emptyVariant="mypage"
            emptyText={
              tab === "reviews"
                ? "아직 남긴 후기가 없어요.\n첫 후기를 남겨보세요!"
                : "아직 북마크한 글이 없어요.\n나중에 다시 보고 싶은 글을 저장해보세요."
            }
          />
        </div>
      </div>
      <Nav scrollTargetSelector=".scroll-available" />
    </div>
  );
}

export default MyMain;
