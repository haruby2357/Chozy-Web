import type { FilterSheetState } from "./types";
import RadioOption from "./RadioOption";
import SelectedChipsBar from "./SelectedChipsBar";
import RangeSlider from "./RangeSlider";

type Props = {
  state: FilterSheetState;
  onChange: (patch: Partial<FilterSheetState>) => void;
};

function ratingLabel(min: number, max: number) {
  return `${min.toFixed(1)} ~ ${max.toFixed(1)}점`;
}

export default function RatingFilterPanel({ state, onChange }: Props) {
  const { ratingMode } = state;

  const sliderDisabled = ratingMode !== "custom";
  const min = state.ratingMin ?? 0.0;
  const max = state.ratingMax ?? 5.0;

  const chipLabel = ratingMode === "all" ? "" : ratingLabel(min, max);

  const chips = chipLabel
    ? [
        {
          label: chipLabel,
          onRemove: () =>
            onChange({
              ratingMode: "all",
              ratingMin: 0.0,
              ratingMax: 5.0,
            }),
        },
      ]
    : [];

  const topText = ratingMode === "all" ? "0.0 ~ 5.0점" : chipLabel;

  return (
    <div className="flex flex-col">
      <SelectedChipsBar chips={chips} />

      <div className="px-5 pt-5">
        <div className="flex flex-col gap-y-5">
          <RadioOption
            checked={ratingMode === "all"}
            label="전체"
            onClick={() =>
              onChange({
                ratingMode: "all",
                ratingMin: 0.0,
                ratingMax: 5.0,
              })
            }
          />
          <RadioOption
            checked={ratingMode === "custom"}
            label="직접 설정하기"
            onClick={() =>
              onChange({
                ratingMode: "custom",
                ratingMin: state.ratingMin ?? 0.0,
                ratingMax: state.ratingMax ?? 5.0,
              })
            }
          />
        </div>
      </div>

      <div className="h-5" />

      <div className="px-5">
        <div
          className={[
            "mb-4 font-[Pretendard] text-[16px] font-medium text-center leading-normal",
            sliderDisabled ? "text-[#DADADA]" : "text-[#191919]",
          ].join(" ")}
        >
          {topText}
        </div>

        <div className={sliderDisabled ? "opacity-60 pointer-events-none" : ""}>
          <RangeSlider
            value={[min, max]}
            min={0}
            max={5}
            step={0.1}
            disabled={sliderDisabled}
            onChange={([nextMin, nextMax]) =>
              onChange({ ratingMin: nextMin, ratingMax: nextMax })
            }
          />

          <div className="h-2" />

          <div className="flex justify-between font-[Pretendard] text-[14px] font-normal leading-normal text-[#191919]">
            <span>0.0</span>
            <span>5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
