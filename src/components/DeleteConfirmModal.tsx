import { createPortal } from "react-dom";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 w-[min(100vw,calc(100dvh*9/16))] h-[100dvh] mx-auto bg-black/40 z-[9999] flex items-center justify-center px-4">
      <div className="w-full bg-stone-50 rounded-[10px] flex flex-col items-center gap-13 pt-13">
        <p className="text-zinc-900 text-center text-base font-medium font-['Pretendard']">
          정말 삭제하시겠어요?
        </p>
        <div className="w-full h-14 flex">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-2.5 py-5 bg-stone-50 border-r border-t border-zinc-300 rounded-bl-[10px] inline-flex justify-center items-center gap-2.5 text-zinc-400 text-base font-medium font-['Pretendard']"
          >
            예
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-2.5 py-5 bg-stone-50 border-t border-zinc-300 rounded-br-[10px] inline-flex justify-center items-center gap-2.5 text-pink-950 text-base font-medium font-['Pretendard']"
          >
            아니요
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
