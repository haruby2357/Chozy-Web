interface ToastProps {
  toast: {
    message: string;
    type: "success" | "error";
    icon?: string;
  } | null;
}

export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-[calc(1.25rem+3rem+1.25rem)] w-[min(100vw,calc(100dvh*9/16))] mx-auto left-1/2 -translate-x-1/2 px-4 z-40">
      <div className="h-12 rounded-[4px] bg-[#787878] px-4 flex items-center gap-[10px]">
        {toast.icon && (
          <img src={toast.icon} alt="" className="w-5 h-5 shrink-0" />
        )}
        <span className="text-[16px] text-white">{toast.message}</span>
      </div>
    </div>
  );
}
