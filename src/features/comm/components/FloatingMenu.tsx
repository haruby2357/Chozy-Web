// 커뮤니티 플로팅 버튼 작성 컴포넌트
import React from "react";
import { useNavigate } from "react-router-dom";
import reviewIcon from "../../../assets/community/review.svg";

interface FloatingMenuProps {
  isOpen: boolean;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleWriteReview = () => navigate("/review-write");
  const handleWritePost = () => navigate("/community/post-write");

  const MenuItem = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <div className="flex items-center justify-end gap-2">
      <span className="text-white text-base font-medium font-['Pretendard'] leading-4">
        {label}
      </span>
      <button
        onClick={onClick}
        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95"
      >
        <img src={reviewIcon} alt={label} className="w-6 h-6" />
      </button>
    </div>
  );

  return (
    <div className="absolute bottom-30 right-4 flex flex-col gap-2 z-50 items-end">
      <MenuItem label="사담 작성하기" onClick={handleWritePost} />
      <MenuItem label="리뷰 작성하기" onClick={handleWriteReview} />
    </div>
  );
};

export default FloatingMenu;
