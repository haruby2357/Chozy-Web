import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailHeader from "../../../../components/DetailHeader";
import checkyet from "../../../../assets/setting/checkyet.svg";
import check from "../../../../assets/setting/check.svg";

// type ApiResponse<T> = {
//   isSuccess: boolean;
//   code: number;
//   message: string;
//   timestamp: string;
//   result: T;
// };

// type WithdrawResult = {
//   withdrawn: boolean;
//   withdrawnAt: string;
// };

export default function WithdrawAccount() {
  const [agreed, setAgreed] = useState(false);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setAgreed((prev) => !prev);
  };

  const onWithdraw = async () => {
    if (!agreed) return;

    navigate("/mypage/withdraw/complete");

    // 로그인 완성 후 서버 연동 주석 제거

    // try {
    //   setLoading(true);
    //   const accessToken = localStorage.getItem("accessToken");
    //   const tokenType = localStorage.getItem("tokenType") ?? "Bearer";

    //   const res = await fetch("/auth/withdraw", {
    //     method: "POST",
    //     headers: {
    //       ...(accessToken
    //         ? { Authorization: `${tokenType} ${accessToken}` }
    //         : {}),
    //     },
    //   });

    //   if (!res.ok) {
    //     throw new Error(`HTTP ${res.status}`);
    //   }

    //   const data: ApiResponse<WithdrawResult> = await res.json();

    //   if (data.isSuccess && data.result?.withdrawn) {
    //     // 탈퇴 완료 화면 이동
    //     navigate("/mypage/withdraw/complete");
    //   } else {
    //     alert(
    //       data.message ?? "탈퇴 요청에 실패했어요. 잠시 후 다시 시도해주세요.",
    //     );
    //   }
    // } catch (e) {
    //   console.error(e);
    //   alert("탈퇴 요청에 실패했어요. 잠시 후 다시 시도해주세요.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <DetailHeader title="" />
      <div className="h-[calc(100%-48px)] bg-white pb-20">
        <div className="pt-3 ml-4">
          <p className="text-[#191919] text-[20px] font-semibold">
            정말로
            <br /> Chozy를 탈퇴하시겠어요?
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="mt-25 flex flex-col items-center justify-center gap-15">
            <div className="w-25 h-25 bg-[#D9D9D9]" />
            <p className="text-[#191919] text-[16px] text-center font-medium">
              한 번 탈퇴하면 OO님의 정보가 모두 사라져요.
              <br /> 작성한 게시글과 댓글은
              <span className="text-[#EF4444]"> 자동으로 지워지지 않아요.</span>
            </p>
          </div>
          <div className="mt-6 rounded-[4px] bg-[#F9F9F9] py-[10px] px-4 w-[358px] h-12">
            <button
              type="button"
              className="flex flex-row gap-2"
              onClick={handleToggle}
              aria-pressed={agreed}
            >
              <img src={agreed ? check : checkyet} alt="체크박스" />
              <span className="text-[16px] font-medium text-[#575757]">
                네, 탈퇴할게요.
              </span>
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <button
              type="button"
              onClick={onWithdraw}
              disabled={!agreed}
              className={[
                "w-[358px] h-12 text-[16px] text-white font-medium",
                agreed ? "bg-[#800025]" : "bg-[#DADADA] cursor-not-allowed",
              ].join(" ")}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
