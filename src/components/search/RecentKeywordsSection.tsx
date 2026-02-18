import recentCancel from "../../assets/goodsPage/search/recentsearch_cancel.svg";

export type RecentKeywordItem = {
  keywordId: number;
  keyword: string;
};

type Props = {
  items: RecentKeywordItem[];
  onSelect: (keyword: string) => void;
  onDeleteOne: (keywordId: number) => void;
  onDeleteAll: () => void;
};

export default function RecentKeywordsSection({
  items,
  onSelect,
  onDeleteOne,
  onDeleteAll,
}: Props) {
  const hasItems = items.length > 0;

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#191919]">최근 검색어</h2>
        {hasItems && (
          <button
            type="button"
            onClick={onDeleteAll}
            className="text-[12px] font-normal text-[#B5B5B5] underline"
          >
            전체삭제
          </button>
        )}
      </div>

      <div className="mt-3">
        {!hasItems ? (
          <p className="text-[14px] text-[#B9B9B9]">검색 내역이 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.slice(0, 10).map((k) => (
              <li
                key={k.keywordId}
                className="flex items-center justify-between"
              >
                <button
                  type="button"
                  className="text-left text-[14px] text-[#191919] flex-1"
                  onClick={() => onSelect(k.keyword)}
                >
                  {k.keyword}
                </button>

                <button
                  type="button"
                  aria-label="최근 검색어 삭제"
                  onClick={() => onDeleteOne(k.keywordId)}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <img src={recentCancel} alt="삭제" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
