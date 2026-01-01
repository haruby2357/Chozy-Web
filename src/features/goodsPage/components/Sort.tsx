// 상품페이지 검색 결과 화면 정렬 컴포넌트
// 안될 경우 설치 -> npm i @radix-ui/react-dialog
// 서버 연동 시 정렬 선택할 경우 어떻게 넘기고 받을지 고민해봐야함!
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import filter from "../../../assets/all/filter.svg";

export type SortKey = "RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "RATING";

const SORT_LABEL: Record<SortKey, string> = {
  RELEVANCE: "관련순",
  PRICE_ASC: "낮은 가격순",
  PRICE_DESC: "높은 가격순",
  RATING: "별점순",
};

type FilterProps = {
  value: SortKey;
  onChange: (next: SortKey) => void;
};

export default function Sort({ value, onChange }: FilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-[2px] text-[14px] text-[#575757]"
        >
          {SORT_LABEL[value]}
          <img src={filter} alt="필터" />
        </button>
      </Dialog.Trigger>

      {/* 바텀시트 */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[60]" />

        <Dialog.Content
          className="
            fixed left-0 right-0 bottom-0 z-[70]
            rounded-t-[10px] bg-[#F9F9F9]
            px-4 pt-4 pb-5
          "
        >
          <VisuallyHidden>
            <Dialog.Title>정렬 옵션 선택</Dialog.Title>
          </VisuallyHidden>
          <div className="mx-auto mb-9 h-[5px] w-18 rounded-[100px] bg-[#B5B5B5]" />

          <div className="divide-y divide-[#DADADA]/60 rounded-[5px] border border-[#DADADA]/60 overflow-hidden">
            {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`w-full px-3 py-3 text-left text-[16px] text-[#191919]`}
              >
                {SORT_LABEL[key]}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
