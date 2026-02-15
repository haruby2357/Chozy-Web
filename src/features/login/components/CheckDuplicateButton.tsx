import checkVerificationIcon from "../../../assets/login/check-verification.svg";

interface CheckDuplicateButtonProps {
  userId: string;
  isIdChecked: boolean;
  isIdDuplicated: boolean;
  userIdErrors: string[];
  onCheckDuplicate: () => void;
}

export default function CheckDuplicateButton({
  userId,
  isIdChecked,
  isIdDuplicated,
  userIdErrors,
  onCheckDuplicate,
}: CheckDuplicateButtonProps) {
  const isDisabled = !userId || userIdErrors.length > 0;

  return (
    <button
      onClick={onCheckDuplicate}
      disabled={isDisabled}
      className={`flex items-center gap-1 h-8 px-2 py-1 rounded text-sm font-medium font-['Pretendard'] transition ${
        !userId || userIdErrors.length > 0 || (isIdChecked && !isIdDuplicated)
          ? "text-zinc-300 cursor-default bg-stone-50"
          : "text-zinc-600 bg-white"
      }`}
    >
      {isIdChecked && !isIdDuplicated ? (
        <>
          <span>중복확인</span>
          <img src={checkVerificationIcon} alt="verified" className="w-4 h-4" />
        </>
      ) : (
        "중복확인"
      )}
    </button>
  );
}
