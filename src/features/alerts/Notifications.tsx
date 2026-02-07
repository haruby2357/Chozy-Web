import back from "../../assets/all/back.svg";
import EmptyNotifications from "./EmptyNotifications";

export default function Notifications() {
  // MSW 설정 필요
  const notifications: unknown[] = [];
  const hasNotifications = notifications.length > 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 알림 헤더 공유 */}
      <header className="w-full h-[48px] bg-white sticky top-0 z-50">
        <div className="relative w-full flex items-center px-4 py-[14px]">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="z-10"
          >
            <img src={back} alt="뒤로가기" />
          </button>

          <span className="absolute left-1/2 -translate-x-1/2 text-[#191919] text-[18px] font-semibold">
            알림
          </span>
        </div>
      </header>

      {hasNotifications ? (
        // "알림 있음" UI구현 예정.
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[#191919] text-[18px] font-medium">
            알림 페이지
          </span>
        </div>
      ) : (
        <EmptyNotifications /> // "알림 없음" 컴포넌트
      )}
    </div>
  );
}
