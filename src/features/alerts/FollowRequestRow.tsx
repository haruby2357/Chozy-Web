import dummyProfile from "../../assets/all/dummyProfile.svg";

type Props = {
  profileImageUrl?: string | null;
  nickname: string;
  loginId: string;
  onAccept: () => void;
  loading?: boolean;
};

export default function FollowRequestRow({
  profileImageUrl,
  nickname,
  loginId,
  onAccept,
  loading,
}: Props) {
  return (
    <div className="px-4 py-3 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={profileImageUrl ?? dummyProfile}
          alt="프로필"
          className="w-10 h-10 rounded-full border border-[#F9F9F9] shrink-0"
        />

        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-[#191919] text-[16px] font-medium truncate">
              {nickname}
            </span>
            <span className="text-[#B5B5B5] text-[13px] truncate">
              @{loginId}
            </span>
          </div>

          <p className="text-[#787878] text-[14px] truncate">
            {nickname}님이 팔로우를 요청했습니다.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAccept}
        disabled={loading}
        className="ml-3 h-9 px-4 rounded-[8px] bg-[#800025] text-white text-[14px] font-medium disabled:opacity-60"
      >
        {loading ? "처리중..." : "수락"}
      </button>
    </div>
  );
}
