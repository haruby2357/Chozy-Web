import favoriteCheck from "../../../assets/all/check-circle.svg";

type Props = {
  open: boolean;
  message: string;
};

export default function FavoriteToast({ open, message }: Props) {
  if (!open) return null;

  // Nav 안 가리게 위로 띄움
  return (
    <div className="fixed inset-x-0 bottom-[84px] z-[60] flex justify-center px-4">
      <div className="flex w-[358px] h-[48px] items-center gap-[10px] p-[16px] rounded-[8px] bg-[#191919]">
        <img src={favoriteCheck} alt="" className="w-4 h-4" />
        <span className="text-white text-[16px] font-medium leading-none">
          {message}
        </span>
      </div>
    </div>
  );
}
