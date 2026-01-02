// 검색 결과 화면 및 검색화면 검색바 헤더
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import back from "../assets/all/back.svg";
import cancel from "../assets/all/cancel.svg";

const MAX_LEN = 50;

type Category =
  | "FASHION"
  | "BEAUTY"
  | "HOBBY"
  | "TOYS"
  | "HOME"
  | "PET"
  | "ELECTRONICS"
  | "AUTOMOTIVE";

const CATEGORY_LABEL_MAP: Record<Category, string> = {
  FASHION: "의류/잡화",
  BEAUTY: "뷰티/건강",
  HOBBY: "취미/DIY",
  TOYS: "완구/게임",
  HOME: "홈데코/주방",
  PET: "반려동물",
  ELECTRONICS: "전자제품",
  AUTOMOTIVE: "자동차용품",
};

const isCategory = (v: string | null): v is Category =>
  v !== null && v in CATEGORY_LABEL_MAP;

export default function SearchBar2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") ?? "";

  const category = useMemo(
    () => (isCategory(categoryParam) ? categoryParam : null),
    [categoryParam]
  );

  const isCategoryMode = category !== null;

  const initialValue = isCategoryMode
    ? CATEGORY_LABEL_MAP[category]
    : searchParam;

  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const isActive = focused;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 카테고리일 때만 # 붙여서 보여주기
  const displayValue =
    isCategoryMode && !focused && value ? `#${value}` : value;

  const handleChange = (next: string) => {
    const cleaned = next.startsWith("#") ? next.slice(1) : next;
    setValue(cleaned);
  };

  const handleSubmit = () => {
    const q = value.trim();
    if (!q) return;

    // 사용자가 직접 입력하면 "검색 모드"로 전환
    navigate(`/home/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-[390px] bg-white pt-[9px] px-4 pb-3">
      <div className="flex flex-row gap-3 items-center justify-center">
        <button type="button" className="w-6 h-6" onClick={() => navigate("/")}>
          <img src={back} alt="이전페이지" />
        </button>

        <div
          className={`
            w-full h-[48px] rounded-[40px] px-4 py-3 flex flex-row items-center justify-between
            ${isActive ? "border border-[#66021F]" : "border border-[#DADADA]"}
          `}
        >
          <input
            type="text"
            value={displayValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="검색어를 입력하세요."
            className={`h-[48px] flex-1 outline-none bg-transparent text-[16px] font-medium
              placeholder:text-[#B9B9B9] focus:placeholder:text-[#191919]
              whitespace-nowrap overflow-hidden
              ${isCategoryMode && !isActive ? "text-[#66021F]" : "text-[#191919]"}
            `}
            maxLength={MAX_LEN}
          />

          {isActive && value.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setValue("")}
            >
              <img src={cancel} alt="취소" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
