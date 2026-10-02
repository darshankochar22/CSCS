import { MapPin } from "lucide-react";
import { MATCHES, ZONES } from "@/lib/data";
import { runRate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ZoneBadge } from "./zone-badge";
import { cn } from "@/lib/utils";

export function MatchList() {
  return (
    <div className="flex flex-col gap-4">
      {MATCHES.map((m) => {
        const w = ZONES[m.winner];
        return (
          <Card key={m.id} id={`match-${m.id}`} className="scroll-mt-28 transition-all hover:border-royal/40 hover:shadow-lg hover:shadow-royal/5">
            <CardContent className="grid gap-5 pt-0 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="lg:w-32">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-royal">
                  Match {m.id}
                </p>
                <p className="num mt-1 text-xs text-muted-foreground">{m.date}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <MapPin className="size-3" />{m.city}
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  { z: m.first, s: m.firstScore, o: m.firstOvers },
                  { z: m.second, s: m.secondScore, o: m.secondOvers },
                ].map(({ z, s, o }) => {
                  const zz = ZONES[z];
                  const won = m.winner === z;
                  return (
                    <div key={z} className={cn("flex items-center gap-3", !won && "opacity-60")}>
                      <ZoneBadge zone={z} size={28} />
                      <span className="font-display text-lg font-semibold uppercase tracking-[0.03em] text-navy-800">
                        {zz.name}
                      </span>
                      <span className="num ml-auto text-right text-base font-semibold text-navy-800">
                        {s}
                        <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                          ({o} ov · {runRate(s, o)} rpo)
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="lg:w-48 lg:text-right">
                <p className="text-sm font-semibold text-win">{w.name} won by {m.margin}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{m.ground}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
