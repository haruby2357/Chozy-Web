import back from "../../../assets/all/back.svg";
import { useNavigate } from "react-router-dom";

export default function PostHeader() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-[48px] bg-white sticky top-0 z-50">
      <div className="relative w-full flex items-center px-4 py-[14px]">
        <button type="button" onClick={() => navigate(-1)} className="z-10">
          <img src={back} alt="뒤로가기" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-[#191919] text-[18px] font-semibold">
          게시글
        </span>
      </div>
    </header>
  );
}
