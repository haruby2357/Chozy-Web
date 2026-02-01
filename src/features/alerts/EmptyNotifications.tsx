export default function EmptyNotifications() {
  return (
    <main className="flex-1 flex items-center justify-center bg-white px-4 text-center">
      <div className="flex flex-col items-center gap-10 -translate-y-10">
        <div className="w-[100px] h-[100px] bg-[#D9D9D9]" />
        <p className="text-[#B5B5B5] text-[16px] font-medium leading-[24px]">
          새로운 알림이 없어요.
        </p>
      </div>
    </main>
  );
}
