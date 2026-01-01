import FilterChip from "./FilterChip";

type Chip = { label: string; onRemove: () => void };

export default function SelectedChipsBar({ chips }: { chips: Chip[] }) {
  if (chips.length === 0) return null;

  return (
    <div
      className={[
        "w-full h-[44px]",
        "bg-[#F9F9F9]",
        "px-[16px] py-[8px]",
        "flex items-center gap-[4px]",
        "overflow-hidden",
      ].join(" ")}
    >
      {chips.map((c, idx) => (
        <FilterChip key={idx} label={c.label} onRemove={c.onRemove} />
      ))}
    </div>
  );
}
