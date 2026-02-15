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
    <div className="mb-4 h-12 rounded-[4px] bg-[#787878] px-4 flex items-center gap-[10px]">
      {toast.icon && (
        <img src={toast.icon} alt="" className="w-5 h-5 shrink-0" />
      )}
      <span className="text-[16px] text-white">{toast.message}</span>
    </div>
  );
}
