import camera from "../../../assets/community/camera.svg";
import { useState } from "react";

type CommentInputProps = {
  profileImg: string;
  onSubmit: (text: string) => void;
};

export default function CommentInput({
  profileImg,
  onSubmit,
}: CommentInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText(""); // 입력창 비우기
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[390px] h-[60px] bg-white shadow-[0_-4px_10px_0_rgba(0,0,0,0.04)] px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={profileImg}
            alt="내 프로필"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="게시글에 댓글 남기기"
            className="flex-1 text-[16px] font-medium text-[#191919] placeholder:text-[#B5B5B5] text-[16px] font-medium outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />

          <img src={camera} alt="사진첨부" />
        </div>
      </div>
    </div>
  );
}
