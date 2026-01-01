import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";

import type { FilterSheetState, FilterTab } from "./types";
import { getSheetHeight, OVERLAY_CLASS, SHEET_CLASS } from "./constants";

import FilterTabs from "./FilterTabs";
import FilterFooter from "./FilterFooter";
import PriceFilterPanel from "./PriceFilterPanel";
import RatingFilterPanel from "./RatingFilterPanel";

import closeIcon from "../../../../assets/filter/Icon s-2.svg";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  defaultTab: FilterTab;
  initial?: Partial<FilterSheetState>;
  onConfirm?: (state: FilterSheetState) => void;
};

const DEFAULT_STATE: FilterSheetState = {
  tab: "price",
  priceMode: "all",
  ratingMode: "all",
  priceMin: 0,
  priceMax: 100000,
  ratingMin: 0.0,
  ratingMax: 5.0,
};

function SheetBody({
  defaultTab,
  initial,
  onClose,
  onConfirm,
}: {
  defaultTab: FilterTab;
  initial?: Partial<FilterSheetState>;
  onClose: () => void;
  onConfirm?: (state: FilterSheetState) => void;
}) {
  const [state, setState] = useState<FilterSheetState>(() => ({
    ...DEFAULT_STATE,
    ...initial,
    tab: defaultTab,
  }));

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const activeMode = useMemo(() => {
    return state.tab === "price" ? state.priceMode : state.ratingMode;
  }, [state.tab, state.priceMode, state.ratingMode]);

  const height = getSheetHeight(state.tab, activeMode);

  return (
    <Dialog.Content className={SHEET_CLASS} style={{ height }}>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-[80] w-[24px] h-[24px] flex items-center justify-center"
        aria-label="닫기"
      >
        <img src={closeIcon} alt="" className="w-[24px] h-[24px]" />
      </button>

      <div className="pt-[64px]">
        <FilterTabs
          value={state.tab}
          onChange={(next) => setState((prev) => ({ ...prev, tab: next }))}
        />
      </div>

      <div className="flex-1 overflow-visible\\">
        {state.tab === "price" ? (
          <PriceFilterPanel
            state={state}
            onChange={(patch) => setState((prev) => ({ ...prev, ...patch }))}
          />
        ) : (
          <RatingFilterPanel
            state={state}
            onChange={(patch) => setState((prev) => ({ ...prev, ...patch }))}
          />
        )}
      </div>

      <FilterFooter
        onConfirm={() => {
          onConfirm?.(state);
          onClose();
        }}
      />
    </Dialog.Content>
  );
}

export default function FilterSheet({
  open,
  onOpenChange,
  defaultTab,
  initial,
  onConfirm,
}: Props) {
  const bodyKey = `${open ? "open" : "closed"}:${defaultTab}`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={OVERLAY_CLASS + " z-[60]"} />
        {open && (
          <SheetBody
            key={bodyKey}
            defaultTab={defaultTab}
            initial={initial}
            onClose={() => onOpenChange(false)}
            onConfirm={onConfirm}
          />
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
