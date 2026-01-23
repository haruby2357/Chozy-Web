interface SubmitButtonProps {
  isValid: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}

export default function SubmitButton({
  isValid,
  isLoading,
  onSubmit,
}: SubmitButtonProps) {
  return (
    <div className="fixed bottom-0 w-[390px] bg-white p-4 flex justify-center">
      <button
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        className={`w-full max-w-sm py-3 rounded-lg font-medium text-white transition-colors ${
          isValid && !isLoading
            ? "bg-[#800025] cursor-pointer"
            : "bg-[#E5E5E7] text-[#B5B5B5] cursor-not-allowed"
        }`}
      >
        {isLoading ? "게시 중..." : "게시하기"}
      </button>
    </div>
  );
}
