// 메인화면 검색바
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import search from "../assets/all/search.svg";
import cancel from "../assets/all/cancel.svg";

export default function SearchBar() {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const isActive = focused || value.length > 0;

  return (
    <div
      className={`
        h-12 px-4 py-3
        flex items-center gap-2
        rounded-[40px]
        bg-white
        shadow-[0_0_10px_0_rgba(0,0,0,0.04)]
        ${isActive ? "border border-[#66021F]" : ""}
        `}
    >
      <img src={search} alt="검색" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          setFocused(true); //검색 전담 화면 이동
          navigate("/home/search");
        }}
        onBlur={() => setFocused(false)}
        placeholder="검색어를 입력하세요."
        className="flex-1 outline-none bg-transparent text-[16px]
        placeholder:text-[#B9B9B9] focus:placeholder:text-[#191919]"
      />
      {isActive && value.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            setFocused(false);
          }}
        >
          <img src={cancel} alt="취소" />
        </button>
      )}
    </div>
  );
}
