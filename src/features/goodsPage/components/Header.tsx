// 상품페이지 메인화면 헤더 컴포넌트
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/goodsPage/logo.svg";
import alarm from "../../../assets/community/alarm.svg";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-[48px] bg-[#F9F9F9] absolute top-0 z-50">
      <div className="w-full flex flex-row justify-between px-[16px] py-[9px]">
        <img src={logo} alt="Chozy 로고" />
        <button
          type="button"
          aria-label="알림"
          onClick={() => navigate("/notifications")}
          className="w-5 h-5"
        >
          <img src={alarm} alt="알림" />
        </button>
      </div>
    </header>
  );
}
