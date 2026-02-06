import * as Slider from "@radix-ui/react-slider";

type Props = {
  value: [number, number];
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (next: [number, number]) => void;
};

export default function RangeSlider({
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}: Props) {
  return (
    <Slider.Root
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={(v) => {
        if (disabled) return;
        onChange([v[0], v[1]] as [number, number]);
      }}
      className="relative flex items-center w-full h-[28px]"
    >
      <Slider.Track
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="relative grow h-[6px] rounded-[20px] bg-[#F9F9F9]"
      >
        <Slider.Range
          className={[
            "absolute h-full rounded-[20px]",
            disabled ? "bg-[#DADADA]" : "bg-[#66021F]",
          ].join(" ")}
        />
      </Slider.Track>

      <Slider.Thumb
        className={[
          "relative z-10 pointer-events-auto",
          "block w-[20px] h-[20px] rounded-full bg-white border-[6px]",
          disabled ? "border-[#DADADA]" : "border-[#66021F]",
          "focus:outline-none",
        ].join(" ")}
        aria-label="최소값"
      />
      <Slider.Thumb
        className={[
          "relative z-10 pointer-events-auto",
          "block w-[20px] h-[20px] rounded-full bg-white border-[6px]",
          disabled ? "border-[#DADADA]" : "border-[#66021F]",
          "focus:outline-none",
        ].join(" ")}
        aria-label="최대값"
      />
    </Slider.Root>
  );
}
