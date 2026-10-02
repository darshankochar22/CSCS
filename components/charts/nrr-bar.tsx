import { NEUTRAL } from "./tokens";

/**
 * Net run rate: polarity around zero, so a diverging bar.
 * Poles are the validated blue/orange pair — the previous green/red reads as one
 * colour to a protanope, which is the classic diverging-scale mistake.
 */
export function NrrBar({ value, max = 1 }: { value: number; max?: number }) {
  const w = (Math.min(Math.abs(value), max) / max) * 50;
  const positive = value >= 0;
  return (
    <span className="flex items-center gap-3">
      <span className="relative block h-6 min-w-[112px] flex-1">
        {/* neutral midpoint */}
        <span aria-hidden className="absolute inset-y-1 left-1/2 w-px" style={{ background: NEUTRAL.midpoint }} />
        <span
          aria-hidden
          className="absolute top-1/2 h-2.5 -translate-y-1/2"
          style={{
            width: `${w}%`,
            [positive ? "left" : "right"]: "50%",
            background: positive ? "var(--chart-a, #2a78d6)" : "var(--chart-b, #eb6834)",
            borderRadius: positive ? "0 3px 3px 0" : "3px 0 0 3px",
          }}
        />
      </span>
      <span className="num w-[3.75rem] shrink-0 text-right text-[12px] text-navy-800">
        {positive ? "+" : "\u2212"}{Math.abs(value).toFixed(3)}
      </span>
    </span>
  );
}
