import type { Ref } from "react";

interface TextareaProps {
  review: string;
  onReviewChange: (review: string) => void;
  textareaRef: Ref<HTMLTextAreaElement>;
}

export default function Textarea({
  review,
  onReviewChange,
  textareaRef,
}: TextareaProps) {
  return (
    <div className="flex flex-col">
      <label className="flex text-zinc-900 text-base font-medium font-['Pretendard'] mb-3 gap-1">
        후기
        <span className="text-rose-900 text-base font-medium font-['Pretendard']">
          *
        </span>
      </label>
      <textarea
        ref={textareaRef}
        placeholder="내용을 작성해 주세요."
        value={review}
        onChange={(e) => onReviewChange(e.target.value.slice(0, 500))}
        maxLength={500}
        className="w-full min-h-[150px] px-3 py-3 border border-[#DADADA] rounded placeholder-[#B5B5B5] text-sm focus:outline-none focus:border-[#800025] focus:text-[#191919] focus:placeholder-transparent resize-none overflow-hidden caret-rose-900"
      />
      <div className="font-pretendard font-normal text-right text-[13px] text-[#B5B5B5]">
        {review.length} / 500
      </div>
    </div>
  );
}
