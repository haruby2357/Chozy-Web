import type { FilterSheetState, PricePresetKey } from "./types";
import RadioOption from "./RadioOption";
import SelectedChipsBar from "./SelectedChipsBar";
import RangeSlider from "./RangeSlider";

type Props = {
  state: FilterSheetState;
  onChange: (patch: Partial<FilterSheetState>) => void;
};

const PRESETS: { key: PricePresetKey; label: string }[] = [
  { key: "under10k", label: "1만원 이하" },
  { key: "1to30k", label: "1 ~ 3만원" },
  { key: "30to50k", label: "3 ~ 5만원" },
  { key: "50to100k", label: "5 ~ 10만원" },
  { key: "over100k", label: "10만원 이상" },
];

const PRESET_RANGE: Record<PricePresetKey, [number, number]> = {
  under10k: [0, 10000],
  "1to30k": [10000, 30000],
  "30to50k": [30000, 50000],
  "50to100k": [50000, 100000],
  over100k: [100000, 100000],
};

const fmt = (n: number) => n.toLocaleString("ko-KR");

function priceRangeLabel(min: number, max: number) {
  const maxText = max >= 100000 ? `${fmt(100000)}원+` : `${fmt(max)}원`;
  return `${fmt(min)} ~ ${maxText}`;
}

export default function PriceFilterPanel({ state, onChange }: Props) {
  const { priceMode, pricePreset } = state;

  const sliderDisabled = priceMode !== "custom";
  const min = state.priceMin ?? 0;
  const max = state.priceMax ?? 100000;

  const chipLabel =
    priceMode === "all"
      ? ""
      : priceMode === "preset" && pricePreset
        ? (() => {
            const [a, b] = PRESET_RANGE[pricePreset];
            return pricePreset === "over100k"
              ? `${fmt(100000)}원+`
              : `${fmt(a)} ~ ${fmt(b)}원`;
          })()
        : priceRangeLabel(min, max);

  const chips = chipLabel
    ? [
        {
          label: chipLabel,
          onRemove: () =>
            onChange({
              priceMode: "all",
              pricePreset: undefined,
              priceMin: 0,
              priceMax: 100000,
            }),
        },
      ]
    : [];

  const topText =
    priceMode === "all" ? "0 ~ 100,000원+" : chipLabel || "0 ~ 100,000원+";

  return (
    <div className="flex flex-col">
      <SelectedChipsBar chips={chips} />

      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          <RadioOption
            checked={priceMode === "all"}
            label="전체"
            onClick={() =>
              onChange({
                priceMode: "all",
                pricePreset: undefined,
                priceMin: 0,
                priceMax: 100000,
              })
            }
          />

          {PRESETS.map((p) => (
            <RadioOption
              key={p.key}
              checked={priceMode === "preset" && pricePreset === p.key}
              label={p.label}
              onClick={() => {
                const [a, b] = PRESET_RANGE[p.key];
                onChange({
                  priceMode: "preset",
                  pricePreset: p.key,
                  priceMin: a,
                  priceMax: b,
                });
              }}
            />
          ))}

          <RadioOption
            checked={priceMode === "custom"}
            label="직접 설정하기"
            onClick={() =>
              onChange({
                priceMode: "custom",
                pricePreset: undefined,
                priceMin: state.priceMin ?? 0,
                priceMax: state.priceMax ?? 100000,
              })
            }
          />
        </div>
      </div>

      <div className="h-3" />

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
            max={100000}
            step={1000}
            disabled={sliderDisabled}
            onChange={([nextMin, nextMax]) =>
              onChange({ priceMin: nextMin, priceMax: nextMax })
            }
          />

          <div className="h-2" />

          <div className="flex justify-between font-[Pretendard] text-[14px] font-normal leading-normal text-[#191919]">
            <span>0</span>
            <span>100,000+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
