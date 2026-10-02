import { LADDER, ZONES } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ZoneBadge } from "./zone-badge";
import { NrrBar } from "@/components/charts/nrr-bar";
import { cn } from "@/lib/utils";

export function StandingsTable() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-navy-800 hover:bg-navy-800">
            {["#", "Team", "M", "W", "L", "NR", "Net run rate", "Pts"].map((h, i) => (
              <TableHead
                key={h}
                className={cn(
                  "font-display text-[11.5px] font-semibold uppercase tracking-[0.15em] text-sky",
                  i > 1 && i < 6 && "text-right",
                  i === 7 && "text-right",
                )}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {LADDER.map((r, i) => {
            const z = ZONES[r.team];
            return (
              <TableRow key={r.team} className={cn(i === 0 && "bg-royal/[0.04]")}>
                <TableCell className="num text-muted-foreground">
                  <span className={cn(i === 0 && "font-semibold text-royal")}>{i + 1}</span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2.5 font-semibold text-navy-800">
                    <ZoneBadge zone={r.team} size={26} />
                    {z.name}
                  </span>
                </TableCell>
                {[r.played, r.won, r.lost, r.noResult].map((n, k) => (
                  <TableCell key={k} className="num text-right">{n}</TableCell>
                ))}
                <TableCell><NrrBar value={r.nrr} /></TableCell>
                <TableCell className="num text-right text-base font-semibold text-royal">{r.points}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
