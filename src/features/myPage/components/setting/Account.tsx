import { useRef, useState } from "react";
import dummyProfile from "../../../../assets/all/dummyProfile.svg";
import toastmsg from "../../../../assets/community/toastmsg.svg";
import { mypageApi } from "../../../../api";

type AccountProps = {
  targetUserId: number;
  name: string;
  userID: string;
  profileImage?: string | null;
  onUnblocked?: (targetUserId: number) => void;
};

export default function Account({
  targetUserId,
  name,
  userID,
  profileImage,
  onUnblocked,
}: AccountProps) {
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const handleUnblock = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await mypageApi.unblockUser(targetUserId);

      if (data.code !== 1000) throw new Error(data.message);

      onUnblocked?.(targetUserId);

      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setShowToast(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative px-4 py-3 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-center gap-3">
        <img src={profileImage ?? dummyProfile} alt="프로필 이미지" />
        <div className="flex flex-col justify-center gap-[2px]">
          <span className="text-[#191919] text-[16px] font-medium">{name}</span>
          <span className="text-[#B5B5B5] text-[12px]">{userID}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleUnblock}
        className="h-8 px-2 py-1 bg-[#800025] rounded-[4px] text-[14px] text-white font-medium"
      >
        차단 해제
      </button>
      {/* 토스트 메시지 */}
      <div
        className={`absolute left-0 right-0 bottom-0 z-[1000] p-4 transition-all duration-200
          ${
            showToast
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="w-full">
          <div className="flex items-center gap-[10px] bg-[#787878] rounded-[4px] p-4">
            <img src={toastmsg} alt="토스트 아이콘" className="w-6 h-6" />
            <span className="text-white text-[16px]">
              {name}님의 차단을 해제했어요.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
