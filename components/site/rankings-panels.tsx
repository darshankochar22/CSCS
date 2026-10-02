import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LADDER, TOP_RUNS, TOP_WICKETS, ZONES, type ZoneKey } from "@/lib/data";
import { ZoneBadge } from "./zone-badge";

type Row = { rank: number; zone: ZoneKey; label: string; value: string };

function Panel({ title, rows, href }: { title: string; rows: Row[]; href: string }) {
  return (
    <div className="flex flex-col border bg-white">
      <div className="border-b px-4 py-3">
        <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-navy-800">{title}</h3>
      </div>
      <ul className="flex-1">
        {rows.map((r) => (
          <li key={`${r.rank}-${r.label}`} className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <span className="num w-5 text-[12.5px] text-muted-foreground">
              {String(r.rank).padStart(2, "0")}
            </span>
            <ZoneBadge zone={r.zone} size={26} />
            <span className="min-w-0 flex-1 truncate font-display text-[15px] font-bold uppercase tracking-[0.03em] text-navy-800">
              {r.label}
            </span>
            <span className="num shrink-0 text-[14px] font-semibold text-navy-800">{r.value}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="flex items-center justify-center gap-1 border-t px-4 py-3 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-navy-800 transition-colors hover:bg-secondary"
      >
        Full table <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}

/** ICC runs three ranking cards side by side. Ours: ladder, run-getters, wicket-takers. */
export function RankingsPanels() {
  const ladder: Row[] = LADDER.map((r, i) => ({
    rank: i + 1, zone: r.team, label: ZONES[r.team].name.replace(" Zone", ""), value: String(r.points),
  }));
  const runs: Row[] = TOP_RUNS.map((p, i) => ({
    rank: i + 1, zone: p.zone, label: p.name.split(" ").slice(0, 2).join(" "), value: String(p.value),
  }));
  const wickets: Row[] = TOP_WICKETS.map((p, i) => ({
    rank: i + 1, zone: p.zone, label: p.name.split(" ").slice(0, 2).join(" "), value: String(p.value),
  }));

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <h2 className="font-display text-[clamp(1.35rem,2.6vw,1.75rem)] uppercase tracking-[0.1em] text-navy-800">
          Challenger Trophy standings
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Panel title="League — points" rows={ladder} href="/standings" />
          <Panel title="Most runs" rows={runs} href="/standings#performers" />
          <Panel title="Most wickets" rows={wickets} href="/standings#performers" />
        </div>
      </div>
    </section>
  );
}
