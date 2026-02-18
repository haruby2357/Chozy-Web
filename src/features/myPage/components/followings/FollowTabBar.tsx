// 팔로워/팔로잉 탭바 (MyMain TabBar와 별개 컴포넌트)
export type FollowTabKey = "followers" | "followings";

interface FollowTabBarProps {
  value: FollowTabKey;
  onChange: (value: FollowTabKey) => void;
  followerLabel?: string; // 기본: 팔로워
  followingLabel?: string; // 기본: 팔로잉
}

export default function FollowTabBar({
  value,
  onChange,
  followerLabel = "팔로워",
  followingLabel = "팔로잉",
}: FollowTabBarProps) {
  return (
    <div className="pt-4 w-full bg-white">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("followers")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "followers"
                ? "text-[#800025] font-semibold border-[#800025]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          {followerLabel}
        </button>

        <button
          type="button"
          onClick={() => onChange("followings")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "followings"
                ? "text-[#800025] font-semibold border-[#800025]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          {followingLabel}
        </button>
      </div>
    </div>
  );
}
