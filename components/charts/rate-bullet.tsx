import { SERIES, NEUTRAL } from "./tokens";

type Row = { label: string; rate: number; note: string };

/**
 * Run rate against the rate the chase needed — value-versus-target, so a bullet:
 * one bar per innings on a shared axis with the required rate as a marker.
 * (The old version drew a 100%-wide bar for the target, which encoded nothing.)
 */
export function RateBullet({ rows, required, ceiling = 7 }: { rows: Row[]; required: number; ceiling?: number }) {
  const ticks = [0, 2, 4, 6];
  const p = (v: number) => Math.max(0, Math.min(100, (v / ceiling) * 100));

  return (
    <div style={{ ["--chart-a" as string]: SERIES.a.light, ["--chart-b" as string]: SERIES.b.light }}>
      <div className="flex flex-col gap-3.5">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <b className="font-display text-[15px] font-bold uppercase tracking-[0.04em] text-navy-800">{r.label}</b>
              <span className="num text-[12.5px] text-muted-foreground">{r.note}</span>
            </div>
            <span className="relative block h-5">
              {ticks.map((t) => (
                <span key={t} aria-hidden className="absolute inset-y-0 w-px bg-[#e6ecf6]" style={{ left: `${p(t)}%` }} />
              ))}
              <span
                className="absolute inset-y-1 rounded-[3px]"
                style={{ width: `${p(r.rate)}%`, background: i === 0 ? "var(--chart-a)" : "#8fb4e4" }}
              />
              {/* required-rate marker */}
              <span
                aria-hidden
                className="absolute -inset-y-0 w-0.5"
                style={{ left: `${p(required)}%`, background: SERIES.b.light }}
              />
              <span className="sr-only">{r.label} scored at {r.rate} runs per over</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-4 rounded-[2px]" style={{ background: SERIES.a.light }} />
          <span className="font-display text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Run rate
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-4 w-0.5" style={{ background: SERIES.b.light }} />
          <span className="font-display text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Required {required.toFixed(2)}
          </span>
        </span>
        <span className="num text-[11px]" style={{ color: NEUTRAL.midpoint }}>0–{ceiling} runs per over</span>
      </div>
    </div>
  );
}
