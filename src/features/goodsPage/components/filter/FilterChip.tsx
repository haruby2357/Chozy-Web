import removeIcon from "../../../../assets/filter/Icon s-2.svg";

type Props = { label: string; onRemove: () => void };

export default function FilterChip({ label, onRemove }: Props) {
  return (
    <div className="flex items-center gap-[4px]">
      <span className="font-[Pretendard] text-[14px] font-medium leading-[100%] text-[#575757] whitespace-nowrap">
        {label}
      </span>
      <button type="button" onClick={onRemove} aria-label="선택 해제">
        <img src={removeIcon} alt="" />
      </button>
    </div>
  );
}
