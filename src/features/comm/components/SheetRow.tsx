type Props = {
  label: string;
  icon: string;
  danger?: boolean;
  onClick: () => void;
};

export default function SheetRow({ label, icon, danger, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-6 py-4"
    >
      <span
        className={
          danger ? "text-[#EF4444] text-[16px]" : "text-[#191919] text-[16px]"
        }
      >
        {label}
      </span>
      <img src={icon} alt="" className="w-6 h-6 shrink-0" />
    </button>
  );
}
