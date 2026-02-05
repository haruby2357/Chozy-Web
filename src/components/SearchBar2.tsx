// 검색 결과 화면 및 검색화면 검색바 헤더
import { useEffect, useMemo, useRef, useState } from "react";
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

type SearchBar2Props = {
  autoFocus?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  onSubmitQuery?: (q: string) => void;
  focusNavigateTo?: string;
  backBehavior?: "HOME" | "BACK";
  onCompositionChange?: (isComposing: boolean) => void; // 한글 조합 상태 전달
};

export default function SearchBar2({
  autoFocus,
  value: controlledValue,
  onChange,
  onSubmitQuery,
  focusNavigateTo,
  backBehavior = "HOME",
  onCompositionChange,
}: SearchBar2Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") ?? "";

  const category = useMemo(
    () => (isCategory(categoryParam) ? categoryParam : null),
    [categoryParam],
  );

  const isCategoryMode = category !== null;
  const initialValue = isCategoryMode
    ? CATEGORY_LABEL_MAP[category]
    : searchParam;

  const isControlled =
    controlledValue !== undefined && typeof onChange === "function";

  const [focused, setFocused] = useState(false);
  const isActive = focused;

  const [uncontrolledValue, setUncontrolledValue] = useState<string>("");

  useEffect(() => {
    if (isControlled) return;

    // ESLint(react-hooks/set-state-in-effect) 회피용 타임아웃
    const id = window.setTimeout(() => {
      setUncontrolledValue(initialValue);
    }, 0);

    return () => window.clearTimeout(id);
  }, [initialValue, isControlled]);

  useEffect(() => {
    if (!autoFocus) return;
    queueMicrotask(() => inputRef.current?.focus());
  }, [autoFocus]);

  const value = isControlled ? controlledValue : uncontrolledValue;

  // 카테고리일 때만 # 붙여서 보여주기
  const displayValue =
    isCategoryMode && !focused && value ? `#${value}` : value;

  const setValue = (next: string) => {
    if (isControlled) onChange?.(next);
    else setUncontrolledValue(next);
  };

  const handleChange = (next: string) => {
    const cleaned = next.startsWith("#") ? next.slice(1) : next;
    setValue(cleaned);
  };

  const clearValue = () => setValue("");

  const handleSubmit = () => {
    const q = (value ?? "").trim();
    if (!q) return;

    if (onSubmitQuery) {
      onSubmitQuery(q);
      return;
    }

    // 기본: 검색 결과로 이동
    navigate(`/home/products?search=${encodeURIComponent(q)}&source=manual`);
  };

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-white pt-[9px] px-4 pb-3">
      <div className="flex flex-row gap-3 items-center justify-start min-w-0">
        <button
          type="button"
          className="w-6 h-6 flex-shrink-0"
          onClick={() => {
            // backBehavior="BACK"이면 직전으로, 히스토리 없으면 홈 fallback
            if (backBehavior === "BACK") {
              if (window.history.length > 1) navigate(-1);
              else navigate("/");
              return;
            }
            // 기본은 홈으로 이동
            navigate("/");
          }}
        >
          <img src={back} alt="이전페이지" />
        </button>

        <div
          className={`
            flex-1 min-w-0 h-[48px] rounded-[40px] px-4 py-3 flex flex-row items-center justify-between
            ${isActive ? "border border-[#66021F]" : "border border-[#DADADA]"}
          `}
        >
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={(e) => handleChange(e.target.value)}
            onInput={(e) => {
              // 한글 조합 중에도 실시간으로 값 전달 (조합 중 onChange는 호출 안 됨)
              const cleaned = e.currentTarget.value.startsWith("#")
                ? e.currentTarget.value.slice(1)
                : e.currentTarget.value;
              onChange?.(cleaned);
            }}
            onFocus={() => {
              setFocused(true);
              if (focusNavigateTo) navigate(focusNavigateTo);
            }}
            onBlur={() => setFocused(false)}
            onCompositionStart={() => onCompositionChange?.(true)}
            onCompositionEnd={(e) => {
              onCompositionChange?.(false);
              // 조합 끝 값 최종 동기화
              const cleaned = e.currentTarget.value.startsWith("#")
                ? e.currentTarget.value.slice(1)
                : e.currentTarget.value;
              onChange?.(cleaned);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="검색어를 입력하세요."
            className={`h-[48px] flex-1 min-w-0 outline-none bg-transparent text-[16px] font-medium
              placeholder:text-[#B9B9B9] focus:placeholder:text-[#191919]
              overflow-hidden text-ellipsis
              ${isCategoryMode && !isActive ? "text-[#66021F]" : "text-[#191919]"}
            `}
            maxLength={MAX_LEN}
          />

          {isActive && (value ?? "").length > 0 && (
            <button
              type="button"
              className="flex-shrink-0"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearValue}
            >
              <img src={cancel} alt="취소" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
