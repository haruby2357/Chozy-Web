import BottomSheet from "./BottomSheet";
import SheetRow from "./SheetRow";

import repost from "../../../assets/community/quotation.svg";
import quote from "../../../assets/community/quote.svg";

type Props = {
  open: boolean;
  onClose: () => void;
  isReposted: boolean;
  onRepost: () => void; // 리포스트
  onQuote: () => void; // 인용하기
};

export default function FeedQuoteSheet({
  open,
  onClose,
  isReposted,
  onRepost,
  onQuote,
}: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="overflow-hidden divide-y divide-[#F2F2F2]">
        <SheetRow
          label={isReposted ? "리포스트 취소" : "리포스트"}
          icon={repost}
          onClick={() => {
            onClose();
            onRepost();
          }}
        />
        <SheetRow
          label="인용하기"
          icon={quote}
          onClick={() => {
            onClose();
            onQuote();
          }}
        />
      </div>
    </BottomSheet>
  );
}
