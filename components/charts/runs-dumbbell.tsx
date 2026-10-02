"use client";

import { useState } from "react";
import { LADDER, ZONES, zoneRunTotals } from "@/lib/data";
import { ZoneBadge } from "@/components/site/zone-badge";
import { RUNS_CEILING, RUNS_TICKS, pct } from "./tokens";
import { AxisLabels, ChartShell, DEFAULT_LEGEND, GridLines, Legend } from "./chart-frame";
import { cn } from "@/lib/utils";

/**
 * Runs scored against runs conceded, one row per zone.
 *
 * Form: dumbbell — two values per item where the gap between them is the point.
 * A pair of bars would encode each value twice (length and hue) and bury the gap,
 * which is the only thing this chart is for.
 */
export function RunsDumbbell() {
  const totals = zoneRunTotals();
  const [hover, setHover] = useState<string | null>(null);

  const rows = LADDER.map((r) => {
    const t = totals[r.team];
    return { key: r.team, zone: ZONES[r.team], for: t.for, against: t.against, diff: t.for - t.against };
  }).sort((a, b) => b.diff - a.diff);

  return (
    <ChartShell>
      <Legend items={DEFAULT_LEGEND} />

      <div className="mt-6">
        {/* column head */}
        <div className="grid grid-cols-[minmax(96px,150px)_1fr] items-end gap-x-4 sm:grid-cols-[minmax(120px,168px)_1fr_3.25rem_3.25rem_3.5rem]">
          <span />
          <AxisLabels ticks={RUNS_TICKS} ceiling={RUNS_CEILING} />
          {["For", "Against", "Diff"].map((h) => (
            <span
              key={h}
              className="hidden pb-0.5 text-right font-display text-[10.5px] font-semibold uppercase tracking-[0.13em] text-muted-foreground sm:block"
            >
              {h}
            </span>
          ))}
        </div>

        <ul className="mt-1 border-t border-[var(--chart-rule)]">
          {rows.map((r) => {
            const lo = Math.min(r.for, r.against);
            const hi = Math.max(r.for, r.against);
            const on = hover === r.key;
            return (
              <li
                key={r.key}
                onMouseEnter={() => setHover(r.key)}
                onMouseLeave={() => setHover(null)}
                className={cn(
                  "grid grid-cols-[minmax(96px,150px)_1fr] items-center gap-x-4 gap-y-1 border-b border-[var(--chart-rule)] py-3 transition-colors",
                  "sm:grid-cols-[minmax(120px,168px)_1fr_3.25rem_3.25rem_3.5rem]",
                  on && "bg-secondary/70",
                )}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <ZoneBadge zone={r.key} size={26} />
                  <span className="truncate font-display text-[15px] font-bold uppercase tracking-[0.03em] text-navy-800">
                    {r.zone.name.replace(" Zone", "")}
                  </span>
                </span>

                {/* plot */}
                <span className="relative col-span-1 block h-7">
                  <GridLines ticks={RUNS_TICKS} ceiling={RUNS_CEILING} />
                  {/* connector: the gap is the message */}
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[var(--color-line,#c3cfe3)]"
                    style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%`, background: "#c3cfe3" }}
                  />
                  {[
                    { v: r.against, c: "var(--chart-b)", label: "conceded" },
                    { v: r.for, c: "var(--chart-a)", label: "scored" },
                  ].map((d) => (
                    <span
                      key={d.label}
                      className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform"
                      style={{
                        left: `${pct(d.v)}%`,
                        background: d.c,
                        boxShadow: "0 0 0 2px var(--color-background)",
                        transform: `translate(-50%,-50%) scale(${on ? 1.25 : 1})`,
                      }}
                    >
                      <span className="sr-only">
                        {r.zone.name} {d.label} {d.v} runs
                      </span>
                    </span>
                  ))}
                </span>

                {/* values — the table half of the chart */}
                <span className="num col-start-2 flex gap-4 text-[12.5px] text-muted-foreground sm:col-start-auto sm:block sm:text-right sm:text-[13px] sm:text-navy-800">
                  <span className="sm:hidden">For </span>{r.for}
                </span>
                <span className="num hidden text-right text-[13px] text-navy-800 sm:block">{r.against}</span>
                <span
                  className="num hidden text-right text-[13px] font-semibold sm:block"
                  style={{ color: r.diff >= 0 ? "var(--chart-a)" : "var(--chart-b)" }}
                >
                  {r.diff >= 0 ? "+" : ""}{r.diff}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
          Summed from all ten scorecards. Every run scored is a run conceded, so both columns
          total 3,549. West Zone&apos;s +144 is the
          widest margin in the trophy; Central Zone conceded 137 more than they made.
        </p>
      </div>
    </ChartShell>
  );
}
