import Link from "next/link";
import { MATCHES, ZONES } from "@/lib/data";
import { ZoneBadge } from "./zone-badge";
import { cn } from "@/lib/utils";

/** ICC's fixtures rail: format badge, status, two sides with scores, venue, MATCH CENTRE. */
export function FixturesStrip() {
  return (
    <section className="border-b bg-white py-5">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex gap-4 overflow-x-auto pb-3">
          {MATCHES.map((m) => (
            <article key={m.id} className="flex w-[282px] shrink-0 flex-col border-r pr-4 last:border-r-0">
              <div className="flex items-center gap-2">
                <span className="num text-[11.5px] text-muted-foreground">{m.date}</span>
                <span className="ml-auto font-display text-[11px] font-bold uppercase tracking-[0.1em] text-navy-800">
                  ODI
                </span>
                <span className="rounded-sm bg-muted px-1.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  Result
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {[
                  { z: m.first, s: m.firstScore, o: m.firstOvers },
                  { z: m.second, s: m.secondScore, o: m.secondOvers },
                ].map(({ z, s, o }) => {
                  const won = m.winner === z;
                  return (
                    <div key={z} className={cn("flex items-center gap-2.5", !won && "opacity-55")}>
                      <ZoneBadge zone={z} size={24} />
                      <span className="font-display text-[15px] font-bold uppercase tracking-[0.04em] text-navy-800">
                        {ZONES[z].short}
                      </span>
                      <span className="num ml-auto text-[13px] font-semibold text-navy-800">
                        {s} <span className="font-normal text-muted-foreground">({o})</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">
                {ZONES[m.winner].name} won by {m.margin} · {m.ground}, {m.city}
              </p>

              <Link
                href={`/matches#match-${m.id}`}
                className="mt-3 inline-flex w-fit items-center gap-1 border border-navy-800 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.13em] text-navy-800 transition-colors hover:bg-navy-800 hover:text-white"
              >
                Match Centre
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
