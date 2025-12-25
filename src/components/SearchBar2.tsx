// 검색 결과 화면 및 검색화면 검색바
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import back from "../assets/all/back.svg";
import cancel from "../assets/all/cancel.svg";

export default function SearchBar2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 카테고리, 인기검색어 임시 구분
  const keywordParam = searchParams.get("keyword") ?? "";
  const sourceParam = searchParams.get("source") ?? "";

  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const isActive = focused;

  useEffect(() => {
    setValue(keywordParam);
  }, [keywordParam]);

  const displayValue =
    sourceParam === "category" && !focused && value ? `#${value}` : value;

  return (
    <header className="fixed top-0 z-50 w-full bg-white pt-[9px] px-4 pb-3">
      <div className="flex flex-row gap-3 items-center justify-center">
        <button type="button" className="w-6 h-6" onClick={() => navigate(-1)}>
          <img src={back} alt="이전페이지" />
        </button>
        <div
          className={`
        w-full rounded-[40px] px-4 py-3 flex flex-row items-center justify-between
        ${isActive ? "border border-[#66021F]" : "border border-[#DADADA]"}`}
        >
          <input
            type="text"
            value={displayValue}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="검색어를 입력하세요."
            className={`flex-1 outline-none bg-transparent text-[16px] font-medium
        placeholder:text-[#B9B9B9] focus:placeholder:text-[#191919]
        ${sourceParam === "category" && !isActive ? "text-[#66021F]" : "text-[#191919]"}`}
          />
          {isActive && value.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setValue("");
                setFocused(false);
              }}
            >
              <img src={cancel} alt="취소" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
