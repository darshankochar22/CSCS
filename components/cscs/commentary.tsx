"use client";

import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type CommentaryBall = { key: string; label: string; runs: number; wicket: boolean; extra: string | null; text: string; score: string; overEnd?: string };

/** Ball-by-ball feed, newest first, with boundary and wicket filters. */
export function Commentary({ balls, title }: { balls: CommentaryBall[]; title: string }) {
  const [filter, setFilter] = useState("all");
  const rows = useMemo(
    () => balls.filter((b) => filter === "all" || (filter === "wickets" ? b.wicket : b.runs >= 4)),
    [balls, filter],
  );
  return (
    <div className="rounded-2xl border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <h3 className="font-display text-xl font-bold uppercase">{title}</h3>
        <ToggleGroup type="single" variant="outline" size="sm" value={filter} onValueChange={(v) => setFilter(v || "all")}>
          <ToggleGroupItem value="all" className="px-3">All</ToggleGroupItem>
          <ToggleGroupItem value="boundaries" className="px-3">4s &amp; 6s</ToggleGroupItem>
          <ToggleGroupItem value="wickets" className="px-3">Wickets</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ScrollArea className="h-[34rem]">
        <ol className="divide-y">
          {rows.map((b) => (
            <li key={b.key}>
              <div className="flex gap-4 px-5 py-3.5">
                <span className="num w-10 shrink-0 pt-0.5 text-sm text-muted-foreground">{b.label}</span>
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                    b.wicket && "border-neutral-900 bg-neutral-900 text-white",
                    (b.runs === 4 || b.runs === 6) && "border-neutral-900",
                  )}
                >
                  {b.wicket ? "W" : b.extra ? b.extra : b.runs}
                </span>
                <span className="min-w-0 flex-1 text-sm leading-relaxed">
                  <span className={cn((b.wicket || b.runs >= 4) && "font-semibold")}>{b.text}</span>
                  <span className="num ml-2 text-xs text-muted-foreground">{b.score}</span>
                </span>
              </div>
              {/* newest first, so the previous over's summary sits below its next ball */}
              {b.overEnd ? (
                <p className="border-t bg-neutral-50 px-5 py-2 text-xs font-medium text-muted-foreground">{b.overEnd}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  );
}
