// 커뮤니티 홈화면 하단 '+' 플로팅 버튼
import React from "react";
import plusIcon from "../../../assets/community/plus.svg";
import closeIcon from "../../../assets/community/close.svg";

interface WriteBtnProps {
  onClick: () => void;
  isOpen: boolean;
}

const WriteBtn: React.FC<WriteBtnProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute bottom-18 right-4 flex items-center justify-center w-10 h-10 rounded-full z-50 transition-transform active:scale-95 ${
        isOpen ? "bg-white shadow-md" : "bg-[#66021F]"
      }`}
    >
      <img
        src={isOpen ? closeIcon : plusIcon}
        alt="작성하기"
        className="w-6 h-6"
      />
    </button>
  );
};

export default WriteBtn;
