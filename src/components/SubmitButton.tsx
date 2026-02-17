interface SubmitButtonProps {
  isValid: boolean;
  isLoading?: boolean;
  onSubmit: () => void;
  label?: string;
  loadingLabel?: string;
  className?: string;
}

export default function SubmitButton({
  isValid,
  isLoading = false,
  onSubmit,
  label = "제출",
  loadingLabel,
  className = "",
}: SubmitButtonProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={!isValid || isLoading}
      className={`py-3 rounded font-medium text-white transition-colors ${
        isValid && !isLoading
          ? "bg-[#800025] cursor-pointer hover:bg-[#600020]"
          : "bg-[#E5E5E7] text-[#B5B5B5] cursor-not-allowed"
      } ${className}`}
    >
      {isLoading ? loadingLabel || `${label} 중...` : label}
    </button>
  );
}
