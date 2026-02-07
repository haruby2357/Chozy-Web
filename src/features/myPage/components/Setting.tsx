import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DetailHeader from "../../../components/DetailHeader";
import toastmsg from "../../../assets/community/toastmsg.svg";

export default function Setting() {
  const navigate = useNavigate();

  const [isAlarmOn, setIsAlarmOn] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const toggleAlarm = () => {
    setIsAlarmOn((prev) => {
      const next = !prev;

      setShowToast(true);
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      toastTimer.current = window.setTimeout(() => {
        setShowToast(false);
      }, 2000);

      return next;
    });
  };

  return (
    <>
      <DetailHeader title="설정" />
      <div className="p-4 flex flex-col gap-5 bg-white">
        <div>
          <p className="text-[#787878] text-[15px] mb-2">계정</p>
          <button
            type="button"
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            계정 정보 수정
          </button>
          <button
            type="button"
            onClick={() => navigate("/mypage/likepost")}
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            좋아요한 게시글
          </button>
        </div>
        <div>
          <p className="text-[#787878] text-[15px] mb-2">설정</p>
          <button
            type="button"
            onClick={toggleAlarm}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-[#191919] text-[16px]">알림 설정</span>
            {/* 토글 */}
            <span
              className={`w-8 h-[18px] rounded-full relative transition-colors ${
                isAlarmOn ? "bg-[#800025]" : "bg-[#B5B5B5]"
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] bg-white rounded-full transition-transform ${
                  isAlarmOn ? "translate-x-[14px]" : "translate-x-0"
                }`}
              />
            </span>
          </button>
          <button
            type="button"
            className="w-full text-left flex items-center justify-between py-4 text-[#191919] text-[16px]"
          >
            <span className="text-[#191919] text-[16px]">계정 공개 범위</span>
            <span className="text-[rgba(25,25,25,0.5)] text-[15px]">
              전체 공개
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/mypage/blocked")}
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            차단한 계정
          </button>
          <button
            type="button"
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            로그아웃
          </button>
          <button
            type="button"
            onClick={() => navigate("/mypage/withdraw")}
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            회원 탈퇴
          </button>
        </div>
        <div>
          <p className="text-[#787878] text-[15px] mb-2">도움말</p>
          <button
            type="button"
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            공지사항
          </button>
          <button
            type="button"
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            서비스 이용약관
          </button>
          <button
            type="button"
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            개인정보 처리방침
          </button>
          <button
            type="button"
            className="w-full text-left py-4 text-[#191919] text-[16px]"
          >
            고객센터
          </button>
        </div>
        {/* 토스트 메시지 */}
        <div
          className={`fixed left-0 right-0 bottom-0 z-[1000] p-4 transition-all duration-200
    ${showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
  `}
        >
          <div className="mx-auto w-[358px]">
            <div className="flex items-center gap-2 bg-[#787878] rounded-[4px] p-4">
              {isAlarmOn ? (
                <img src={toastmsg} alt="토스트 아이콘" className="w-5 h-5" />
              ) : (
                ""
              )}
              <span className="text-white text-[16px]">
                {isAlarmOn ? "알림을 활성화했어요." : "알림을 해제했어요."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
