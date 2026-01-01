type Props = {
  onConfirm: () => void;
};

export default function FilterFooter({ onConfirm }: Props) {
  return (
    <div className="bg-white pb-[26px] pt-[20px]">
      <button
        type="button"
        onClick={onConfirm}
        className={[
          "mx-auto",
          "w-[358px] h-[48px] px-[10px]",
          "rounded-[4px]",
          "bg-[#66021F] text-white",
          "flex items-center justify-center",
          "font-[Pretendard] text-[16px] font-medium leading-[100%]",
        ].join(" ")}
      >
        확인
      </button>
    </div>
  );
}