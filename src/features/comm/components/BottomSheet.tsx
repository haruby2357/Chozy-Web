import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheet({ open, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const frameWidth = "min(100vw, calc(100vh * 9 / 16))";

  return createPortal(
    <div className="fixed inset-0 z-[999]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0"
        style={{ width: frameWidth }}
      >
        <div className="rounded-t-[16px] bg-[#F9F9F9] pb-6 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
          <div className="pt-3 pb-2 flex justify-center">
            <div className="w-10 h-1.5 rounded-full bg-[#B5B5B5]" />
          </div>

          <div className="bg-white rounded-[12px] mx-4 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
