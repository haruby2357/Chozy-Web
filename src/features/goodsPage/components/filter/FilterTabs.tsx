import type { FilterTab } from "./types";

type Props = {
  value: FilterTab;
  onChange: (next: FilterTab) => void;
};

export default function FilterTabs({ value, onChange }: Props) {
  const base =
    "flex-1 h-[42px] px-[10px] flex items-center justify-center gap-[10px] " +
    "font-[Pretendard] text-[16px] leading-[100%]";

  const active = "text-[#66021F] font-semibold border-b border-b-[#66021F]";
  const inactive = "text-[#B5B5B5] font-normal";

  return (
    <div className="flex h-[42px]">
      <button
        type="button"
        onClick={() => onChange("price")}
        className={[base, value === "price" ? active : inactive].join(" ")}
      >
        가격
      </button>
      <button
        type="button"
        onClick={() => onChange("rating")}
        className={[base, value === "rating" ? active : inactive].join(" ")}
      >
        별점
      </button>
    </div>
  );
}
