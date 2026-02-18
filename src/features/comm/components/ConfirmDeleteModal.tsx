type Props = {
  open: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  open,
  title = "정말 삭제하시겠어요?",
  confirmText = "예",
  cancelText = "아니요",
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="삭제 확인"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="
          relative w-[calc(100%-48px)] max-w-[340px]
          rounded-[16px] bg-white overflow-hidden
          shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-10 text-center">
          <p className="text-[16px] font-medium text-[#191919]">{title}</p>
        </div>

        <div className="h-[1px] bg-[#DADADA]" />

        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={[
              "h-14 text-[16px] font-medium",
              "text-[#B5B5B5]",
              "border-r border-[#DADADA]",
              confirmDisabled
                ? "opacity-50 cursor-not-allowed"
                : "active:bg-black/5",
            ].join(" ")}
          >
            {confirmText}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="h-14 text-[16px] font-semibold text-[#66021F] active:bg-black/5"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
