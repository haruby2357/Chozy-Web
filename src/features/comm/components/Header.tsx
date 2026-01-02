// 커뮤니티 홈화면 헤더
import search from "../../../assets/community/search.svg";
import alarm from "../../../assets/community/alarm.svg";

export default function Header() {
  return (
    <header className="w-full h-[48px] bg-white absolute top-0 z-50">
      <div className="w-full flex flex-row justify-between px-[16px] py-[9px]">
        <span className="text-[#66021F] text-[20px] font-semibold tracking-[-0.4px]">
          커뮤니티
        </span>
        <div className="flex flex-row gap-4 items-center justify-center">
          <button type="button" aria-label="검색" className="w-5 h-5">
            <img src={search} alt="search" />
          </button>
          <button type="button" aria-label="알림" className="w-5 h-5">
            <img src={alarm} alt="alarm" />
          </button>
        </div>
      </div>
    </header>
  );
}
