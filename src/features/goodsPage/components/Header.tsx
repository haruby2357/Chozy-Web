// 상품페이지 메인화면 헤더 컴포넌트
import logo from "../../../assets/goodsPage/logo.svg";
import notice from "../../../assets/goodsPage/notice.svg";

export default function Header() {
  return (
    <header className="w-full bg-[#F9F9F9] fixed top-0 z-50">
      <div className="w-full flex flex-row justify-between px-[16px] py-[9px]">
        <img src={logo} alt="Chozy 로고" />
        <button type="button">
          <img src={notice} alt="알림" />
        </button>
      </div>
    </header>
  );
}
