// 커뮤니티 홈화면 필터
// 커뮤니티 검색 화면에서도 사용 가능
export type ToggleOption = {
  key: string;
  label: string;
};

type Props = {
  options: ToggleOption[];
  value: string[];
  onChange: (next: string[]) => void;

  allKey?: string; // 기본 "all"
  className?: string;
};

export default function FilterToggle({
  options,
  value,
  onChange,
  allKey = "ALL",
  className = "",
}: Props) {
  const selected = new Set(value);

  const allOption = options.find((o) => o.key === allKey);
  const childOptions = options.filter((o) => o.key !== allKey);

  // 자식(전체 제외) key 목록
  const childKeys = childOptions.map((o) => o.key);

  // 자식이 모두 선택되어 있으면 전체도 선택 상태로 "동기화"
  const isAllChildrenOn =
    childKeys.length > 0 && childKeys.every((k) => selected.has(k));

  const isAllOn = allOption ? selected.has(allKey) || isAllChildrenOn : false;

  const handleClick = (key: string) => {
    if (key === allKey) {
      if (!childKeys.length) return;

      const turnOn = !isAllOn;
      const next = turnOn ? [...childKeys, allKey] : [];
      onChange(next);
      return;
    }

    const nextSet = new Set(selected);

    if (nextSet.has(key)) nextSet.delete(key);
    else nextSet.add(key);

    if (allOption) {
      nextSet.delete(allKey);

      // const nextAllChildrenOn = childKeys.every((k) =>
      //   k === key ? nextSet.has(k) : nextSet.has(k)
      // );

      const allChildrenOn = childKeys.every((k) => nextSet.has(k));
      if (allChildrenOn) nextSet.add(allKey);
    }

    onChange(Array.from(nextSet));
  };

  const isChecked = (key: string) => {
    if (key === allKey) return isAllOn;
    return selected.has(key);
  };

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => handleClick(opt.key)}
          className="flex items-center gap-1 text-[12px] font-medium text-[#191919]"
        >
          {/* 임시 체크박스 디자인 - 체크표시 없는 디자인 추가 필요 */}
          <span
            className={`w-[14px] h-[14px] rounded-[3px] border-[1.5px] flex items-center justify-center
              ${isChecked(opt.key) ? "border-[#66021F]" : "border-[#B5B5B5]"}`}
          >
            {isChecked(opt.key) && (
              <span className="block w-[8px] h-[4px] border-l-2 border-b-2 border-[#66021F] rotate-[-45deg] translate-y-[-1px]" />
            )}
          </span>

          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
