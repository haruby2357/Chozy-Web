import { useState } from "react";
import dummyProfile from "../../../../assets/all/dummyProfile.svg";
import toastmsg from "../../../../assets/community/toastmsg.svg";
import { followUser, unfollowUser } from "../../../../api/domains/follow";

export type Variant = "followings" | "followers";
export type FollowStatus = "FOLLOWING" | "REQUESTED" | "NOT_FOLLOWING" | string;

type FollowAccountProps = {
  userPk: number;
  name: string;
  userID: string;
  profileImage?: string | null;

  // 서버 상태
  isFollowingByMe: boolean; // 내가 상대를 팔로우 중인가
  isFollowingMe: boolean; // 상대가 나를 팔로우 중인가
  myFollowStatus?: FollowStatus; // FOLLOWING / REQUESTED 등

  variant: Variant;

  // 부모 리스트 갱신용
  onChanged?: (
    userPk: number,
    patch: { isFollowingByMe: boolean; myFollowStatus?: FollowStatus },
  ) => void;

  // 페이지 레벨 토스트 호출
  showToast: (text: string, icon?: string) => void;
};

export default function FollowAccount({
  userPk,
  name,
  userID,
  profileImage,
  isFollowingByMe,
  isFollowingMe,
  myFollowStatus,
  variant,
  onChanged,
  showToast,
}: FollowAccountProps) {
  const [loading, setLoading] = useState(false);

  const isRequested = myFollowStatus === "REQUESTED";
  const isMutualCandidate = !isFollowingByMe && isFollowingMe; // ✅ 추가
  const isFollowingLike =
    !isMutualCandidate && (isFollowingByMe || isRequested); // ✅ 교체

  const displayId = userID.startsWith("@") ? userID : `@${userID}`;

  // ✅ 라벨 규칙
  // - followings 탭: 기본은 "팔로우 중", REQUESTED면 "요청중"
  // - followers 탭:
  //    - 내가 팔로우 중이면 "팔로우 중" (REQUESTED면 "요청중")
  //    - 내가 팔로우 안 했고 상대가 나를 팔로우 중이면 "맞팔로우"
  //    - 그 외 "팔로우"
  const label =
    variant === "followings"
      ? isRequested
        ? "요청중"
        : "팔로우 중"
      : isFollowingByMe
        ? isRequested
          ? "요청중"
          : "팔로우 중"
        : isFollowingMe
          ? "맞팔로우"
          : "팔로우";

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // ✅ 이미 팔로우 중이거나 요청중이면 -> 취소(언팔/요청취소)
      if (isFollowingByMe || isRequested) {
        const res = await unfollowUser(userPk);
        if (res.code !== 1000)
          throw new Error(res.message ?? "팔로우 취소 실패");

        onChanged?.(userPk, {
          isFollowingByMe: false,
          myFollowStatus: "NOT_FOLLOWING",
        });
        showToast("팔로우를 취소했어요.");
        return;
      }

      // ✅ 팔로우(또는 비공개면 요청)
      const res = await followUser(userPk);
      if (res.code !== 1000) throw new Error(res.message ?? "팔로우 실패");

      const status: FollowStatus = res.result?.followStatus ?? "FOLLOWING";

      if (status === "REQUESTED") {
        // 요청중은 isFollowingByMe를 false로 두고, myFollowStatus로 표현(버튼 라벨 "요청중")
        onChanged?.(userPk, {
          isFollowingByMe: false,
          myFollowStatus: "REQUESTED",
        });
        showToast("팔로우 요청을 보냈어요.");
      } else {
        onChanged?.(userPk, {
          isFollowingByMe: true,
          myFollowStatus: "FOLLOWING",
        });
        showToast(`${displayId} 님을 팔로우했어요.`, toastmsg);
      }
    } catch (e: any) {
      console.error(e);
      showToast(e?.message ?? "처리 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative px-4 py-3 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-center gap-3">
        <img src={profileImage ?? dummyProfile} alt="프로필 이미지" />
        <div className="flex flex-col justify-center gap-[2px]">
          <span className="text-[#191919] text-[16px] font-medium">{name}</span>
          <span className="text-[#B5B5B5] text-[12px]">{displayId}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`h-8 px-2 py-1 rounded-[4px] text-[14px] font-medium
          ${
            isFollowingLike
              ? "bg-white text-[#787878] border border-[#DADADA]"
              : "bg-[#800025] text-white"
          }
          ${loading ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        {loading ? "처리중..." : label}
      </button>
    </div>
  );
}
