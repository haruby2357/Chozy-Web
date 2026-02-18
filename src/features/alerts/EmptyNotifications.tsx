import emptyIcon from "../../assets/all/Empty_favorite_icon.svg";

export default function EmptyNotifications() {
  return (
    <main className="flex-1 flex items-center justify-center bg-white px-4 text-center">
      <div className="flex flex-col items-center gap-[20px]           -translate-y-10">
        <img
          src={emptyIcon}
          alt=""
          className="w-[100px] h-[100px] object-contain"
        />
        <p className="text-[#787878] text-[16px] font-medium leading-[24px]">
          새로운 알림이 없어요.
        </p>
      </div>
    </main>
  );
}