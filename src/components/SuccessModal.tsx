import { createPortal } from "react-dom";
import checkIcon from "../assets/community/check.svg";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
}

export default function SuccessModal({ isOpen, message }: SuccessModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 w-[min(100vw,calc(100dvh*9/16))] h-[100dvh] mx-auto bg-black/40 flex items-center justify-center z-[9999] px-4">
      <div className="w-full h-[153px] bg-white rounded-[10px] flex flex-col items-center gap-6 pt-9">
        <div className="w-10 h-10 bg-[#800025] rounded-full flex items-center justify-center">
          <img src={checkIcon} alt="Check" className="w-4 h-[11px]" />
        </div>
        <p className="text-center text-[#191919] font-medium text-base">
          {message}
        </p>
      </div>
    </div>,
    document.body,
  );
}
