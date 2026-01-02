import { useState } from "react";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import FilterToggle, { type ToggleOption } from "./components/FilterToggle";
import Nav from "../../components/Nav";

const OPTIONS: ToggleOption[] = [
  { key: "all", label: "전체" },
  { key: "chat", label: "사담" },
  { key: "review", label: "리뷰" },
];

function CommMain() {
  const [tab, setTab] = useState<"recommend" | "follow">("recommend");
  const [selected, setSelected] = useState<string[]>(["all", "chat", "review"]);

  return (
    <>
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
      <Nav scrollTargetSelector=".scroll-available" />
    </>
  );
}

export default CommMain;
