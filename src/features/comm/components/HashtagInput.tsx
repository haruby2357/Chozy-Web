// 커뮤니티 해시태그 컴포넌트

import { useState, useRef } from "react";

interface HashtagInputProps {
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
  onToast: (message: string) => void;
}

export default function HashtagInput({
  hashtags,
  onHashtagsChange,
  onToast,
}: HashtagInputProps) {
  const [isHashtagInputActive, setIsHashtagInputActive] = useState(false);
  const [hashtagInput, setHashtagInput] = useState("");
  const hashtagInputRef = useRef<HTMLInputElement>(null);

  // 해시태그 추가하기 클릭
  const handleAddHashtagClick = () => {
    if (hashtags.length >= 4) {
      onToast("해시 태그는 최대 4개까지 작성할 수 있어요.");
      return;
    }
    setIsHashtagInputActive(true);
    setHashtagInput("#");
    setTimeout(() => {
      hashtagInputRef.current?.focus();
    }, 0);
  };

  // 해시태그 입력 처리
  const handleHashtagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // #가 없으면 추가
    if (!value.startsWith("#")) {
      value = "#" + value;
    }

    // 공백 허용 안 함
    value = value.replace(/\s/g, "");

    // 최대 8자
    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    setHashtagInput(value);
  };

  // 해시태그 입력창에서 띄어쓰기/엔터 처리
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();

      const tag = hashtagInput.trim();

      // 공백만 입력한 경우
      if (tag === "#") {
        return;
      }

      // 이미 4개 해시태그가 있으면 토스트 메시지
      if (hashtags.length >= 4) {
        onToast("해시 태그는 최대 4개까지 작성할 수 있어요.");
        return;
      }

      // 새 해시태그 추가
      onHashtagsChange([...hashtags, tag]);
      setHashtagInput("#");
      hashtagInputRef.current?.focus();
    } else if (
      e.key === "Backspace" &&
      hashtagInput === "#" &&
      hashtags.length > 0
    ) {
      // 입력창이 #만 있고 백스페이스 누르면 마지막 해시태그 삭제
      e.preventDefault();
      const newHashtags = [...hashtags];
      newHashtags.pop();
      onHashtagsChange(newHashtags);
      hashtagInputRef.current?.focus();
    }
  };

  // 해시태그 입력창 블러 처리
  const handleHashtagInputBlur = () => {
    const tag = hashtagInput.trim();

    // 내용이 #만 있으면 입력 상태 종료
    if (tag === "#") {
      setIsHashtagInputActive(false);
      setHashtagInput("");
      return;
    }

    // 내용이 있으면 추가
    if (tag !== "#" && hashtags.length < 4) {
      onHashtagsChange([...hashtags, tag]);
    }

    setIsHashtagInputActive(false);
    setHashtagInput("");
  };

  return (
    <>
      {hashtags.length === 0 && !isHashtagInputActive ? (
        // 해시태그가 없고 입력 비활성화: 추가하기 버튼만 표시
        <label
          onClick={handleAddHashtagClick}
          className="flex gap-3 items-center text-zinc-900 text-base font-normal font-['Pretendard'] leading-6 cursor-pointer"
        >
          해시 태그
          <span className="text-zinc-400 text-sm font-normal font-['Pretendard'] underline leading-6">
            추가하기
          </span>
        </label>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-base font-normal font-['Pretendard'] leading-6">
            해시 태그
          </label>

          <div className="flex items-center gap-2 flex-wrap">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-rose-900 text-sm font-normal font-['Pretendard']"
              >
                {tag}
              </span>
            ))}

            {isHashtagInputActive ? (
              <input
                ref={hashtagInputRef}
                type="text"
                value={hashtagInput}
                onChange={handleHashtagInputChange}
                onKeyDown={handleHashtagKeyDown}
                onBlur={handleHashtagInputBlur}
                className="text-rose-900 text-sm font-normal font-['Pretendard'] leading-6 border-none outline-none px-1 py-1 w-auto"
                style={{ minWidth: "30px" }}
              />
            ) : (
              hashtags.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddHashtagClick}
                  className="text-zinc-400 text-sm font-normal font-['Pretendard'] underline leading-6 cursor-pointer"
                >
                  추가하기
                </button>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
