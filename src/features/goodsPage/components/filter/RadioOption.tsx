import radioOff from "../../../../assets/filter/Icon s-1.svg";
import radioOn from "../../../../assets/filter/Icon s.svg";

type Props = {
  checked: boolean;
  label: string;
  onClick: () => void;
};

export default function RadioOption({ checked, label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[8px] text-left"
    >
      <img
        src={checked ? radioOn : radioOff}
        alt=""
        className="w-[16px] h-[16px]"
      />
      <span className="font-[Pretendard] text-[15px] font-normal leading-normal text-[#191919]">
        {label}
      </span>
    </button>
  );
}
