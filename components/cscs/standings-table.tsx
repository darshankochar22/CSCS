"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoneBadge } from "./zone-badge";
import { LADDER, ZONES, type LadderRow } from "@/lib/data";

type Key = "played" | "won" | "lost" | "noResult" | "nrr" | "points";

const COLS: { key: Key; short: string; long: string }[] = [
  { key: "played", short: "P", long: "Played" },
  { key: "won", short: "W", long: "Won" },
  { key: "lost", short: "L", long: "Lost" },
  { key: "noResult", short: "NR", long: "No result" },
  { key: "nrr", short: "NRR", long: "Net run rate: run rate scored minus run rate conceded" },
  { key: "points", short: "Pts", long: "Points: two for a win" },
];

/** Points table with sortable columns (shadcn Data Table pattern). */
export function StandingsTable() {
  const [sort, setSort] = useState<{ key: Key; dir: "asc" | "desc" }>({ key: "points", dir: "desc" });

  const rows = useMemo(() => {
    const base = LADDER.map((r, i) => ({ ...r, pos: i + 1 }));
    return [...base].sort((a, b) => {
      const d = (a[sort.key] as number) - (b[sort.key] as number);
      return (sort.dir === "asc" ? d : -d) || a.pos - b.pos;
    });
  }, [sort]);

  const toggle = (key: Key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: "desc" }));

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 pl-5">#</TableHead>
            <TableHead>Zone</TableHead>
            {COLS.map((c) => {
              const Icon = sort.key !== c.key ? ArrowUpDown : sort.dir === "desc" ? ArrowDown : ArrowUp;
              return (
                <TableHead key={c.key} className="text-right last:pr-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggle(c.key)}
                        className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                        aria-label={`Sort by ${c.long}`}
                      >
                        {c.short} <Icon className="size-3.5 opacity-60" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{c.long}</TooltipContent>
                  </Tooltip>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r: LadderRow & { pos: number }) => (
            <TableRow key={r.team}>
              <TableCell className="num pl-5 text-muted-foreground">{r.pos}</TableCell>
              <TableCell>
                <span className="flex items-center gap-3">
                  <ZoneBadge zone={r.team} size={30} />
                  <span className="font-semibold">{ZONES[r.team].name}</span>
                  {r.pos === 1 ? <Badge>Top</Badge> : null}
                </span>
              </TableCell>
              {COLS.map((c) => (
                <TableCell
                  key={c.key}
                  className={`num text-right last:pr-5 ${c.key === "points" ? "text-base font-semibold" : ""}`}
                >
                  {c.key === "nrr" ? `${r.nrr > 0 ? "+" : ""}${r.nrr.toFixed(3)}` : r[c.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
