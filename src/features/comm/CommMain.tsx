import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import FilterToggle, { type ToggleOption } from "./components/FilterToggle";
import Nav from "../../components/Nav";
import WriteBtn from "./components/WriteBtn";
import FloatingMenu from "./components/FloatingMenu";

const OPTIONS: ToggleOption[] = [
  { key: "all", label: "전체" },
  { key: "chat", label: "사담" },
  { key: "review", label: "리뷰" },
];

function CommMain() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"recommend" | "follow">("recommend");
  const [selected, setSelected] = useState<string[]>(["all", "chat", "review"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <div
        style={{ opacity: isModalOpen ? 0.5 : 1, transition: "opacity 0.2s" }}
      >
        <Header />
        <TabBar value={tab} onChange={setTab} />
        <FilterToggle
          options={OPTIONS}
          value={selected}
          onChange={(next) => {
            setSelected(next);
          }}
          className="px-4 py-[9px]"
        />
      </div>
      <div
        style={{ opacity: isModalOpen ? 0.5 : 1, transition: "opacity 0.2s" }}
      >
        <Nav scrollTargetSelector=".scroll-available" />
      </div>
      배경 오버레이
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsModalOpen(false)}
        />
      )}
      <FloatingMenu isOpen={isModalOpen} />
      <WriteBtn onClick={toggleMenu} isOpen={isModalOpen} />
      {/* 플로팅 버튼 그룹 */}
      {/* {isModalOpen && (
        <> */}
      {/* 사담 작성하기 */}
      {/* <div
            className="flex items-center gap-2 z-50"
            style={{
              position: "fixed",
              right: "16px",
              bottom: "calc(62px + 16px + 40px + 8px + 40px + 8px)",
            }}
          >
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "-2%",
                color: "#FFFFFF",
              }}
            >
              사담 작성하기
            </span>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-white hover:bg-gray-100 transition-colors flex-shrink-0"
              onClick={() => setIsModalOpen(false)}
            >
              <img src={reviewIcon} alt="리뷰" className="w-6 h-6" />
            </button>
          </div> */}
      {/* 리뷰 작성하기 */}
      {/* <div
            className="flex items-center gap-2 z-50"
            style={{
              position: "fixed",
              right: "16px",
              bottom: "calc(62px + 16px + 40px + 8px)",
            }}
          >
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "-2%",
                color: "#FFFFFF",
              }}
            >
              리뷰 작성하기
            </span>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-white hover:bg-gray-100 transition-colors flex-shrink-0"
              onClick={() => navigate("/review-write")}
            >
              <img src={reviewIcon} alt="리뷰" className="w-6 h-6" />
            </button>
          </div> */}
      {/* X 버튼 */}
      {/* <button
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-white hover:bg-gray-100 transition-colors z-50"
            style={{
              position: "fixed",
              bottom: "calc(62px + 16px)",
              right: "16px",
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <img src={xIcon} alt="닫기" className="w-6 h-6" />
          </button>
        </>
      )} */}
      {/* + 버튼 */}
      {/* <button
        className="fixed flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
        style={{
          backgroundColor: "#66021F",
          bottom: "calc(62px + 16px)",
          right: "16px",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <img src={plusIcon} alt="+" className="w-6 h-6" />
      </button> */}
    </>
  );
}

export default CommMain;
