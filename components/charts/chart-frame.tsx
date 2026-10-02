import type { ReactNode } from "react";
import { SERIES } from "./tokens";
import { cn } from "@/lib/utils";

/** A legend is always present once a chart carries two or more series. */
export function Legend({ items }: { items: { label: string; color: string; shape?: "dot" | "bar" }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn("shrink-0", i.shape === "bar" ? "h-2.5 w-4 rounded-[2px]" : "size-3 rounded-full")}
            style={{ background: i.color, boxShadow: "0 0 0 2px var(--color-background)" }}
          />
          <span className="font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {i.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export const DEFAULT_LEGEND = [
  { label: "Runs scored", color: SERIES.a.light, shape: "dot" as const },
  { label: "Runs conceded", color: SERIES.b.light, shape: "dot" as const },
];

/** Solid hairline gridlines, one shade off the surface — never dashed. */
export function GridLines({ ticks, ceiling }: { ticks: number[]; ceiling: number }) {
  return (
    <>
      {ticks.map((t) => (
        <span
          key={t}
          aria-hidden
          className="absolute inset-y-0 w-px bg-[var(--chart-rule)]"
          style={{ left: `${(t / ceiling) * 100}%` }}
        />
      ))}
    </>
  );
}

export function AxisLabels({ ticks, ceiling }: { ticks: number[]; ceiling: number }) {
  return (
    <div className="relative h-4">
      {ticks.map((t, i) => (
        <span
          key={t}
          className="num absolute top-0 text-[10.5px] leading-4 text-muted-foreground"
          style={{
            left: `${(t / ceiling) * 100}%`,
            transform: i === 0 ? "none" : i === ticks.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function ChartShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("[--chart-rule:#e6ecf6]", className)}
      style={{ ["--chart-a" as string]: SERIES.a.light, ["--chart-b" as string]: SERIES.b.light }}
    >
      {children}
    </div>
  );
}
