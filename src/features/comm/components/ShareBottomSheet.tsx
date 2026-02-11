import * as Dialog from "@radix-ui/react-dialog";

type ShareBottomSheetProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  shareUrl: string;
};

export default function ShareBottomSheet({
  open,
  onOpenChange,
  shareUrl,
}: ShareBottomSheetProps) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      onOpenChange(false);
      //      showToast("링크를 복사했어요!"); // 토스트 있으면 이걸로 교체
      alert("링크를 복사했어요!");
    } catch {
      // clipboard 권한 막힌 환경 fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      onOpenChange(false);
      alert("링크를 복사했어요!");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Dialog.Content
          className="
            fixed left-0 right-0 bottom-0 z-[70]
            rounded-t-[14px] bg-white
            px-4 pt-4 pb-6
          "
        >
          {/* 손잡이 */}
          <div className="mx-auto mb-4 h-[5px] w-18 rounded-[100px] bg-[#B5B5B5]" />

          <p className="text-[16px] font-semibold text-[#191919] mb-4">
            링크 공유
          </p>

          <button
            type="button"
            onClick={copyLink}
            className="w-full h-12 rounded-[10px] bg-[#F2F2F2] text-[16px] font-medium text-[#191919]"
          >
            링크 복사
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
