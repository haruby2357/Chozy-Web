// 커뮤니티 홈화면 탭바
type TabKey = "recommend" | "follow";

interface TabBarProps {
  value: TabKey;
  onChange: (value: TabKey) => void;
}

export default function TabBar({ value, onChange }: TabBarProps) {
  return (
    <div className="pt-12 w-full bg-white">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("recommend")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "recommend"
                ? "text-[#66021F] font-semibold border-[#66021F]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          추천
        </button>
        <button
          type="button"
          onClick={() => onChange("follow")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "follow"
                ? "text-[#66021F] font-semibold border-[#66021F]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          팔로우 중
        </button>
      </div>
    </div>
  );
}
