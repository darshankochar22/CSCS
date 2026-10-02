"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { TOURNAMENTS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "SENIOR", label: "Senior" },
  { id: "UNDER-23", label: "U23" },
  { id: "UNDER-19", label: "U19" },
  { id: "UNDER-16", label: "U16" },
  { id: "UNDER-15", label: "U15" },
  { id: "UPCOMING", label: "Upcoming" },
];

export function TournamentGrid({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState("all");

  const list = useMemo(() => {
    const out = TOURNAMENTS.filter((t) => {
      if (filter === "all") return true;
      if (filter === "men" || filter === "women") return t.gender === filter;
      if (filter === "UPCOMING") return t.status === "UPCOMING";
      return t.group === filter;
    });
    return limit ? out.slice(0, limit) : out;
  }, [filter, limit]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tournaments">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={filter === f.id ? "default" : "outline"}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full font-display text-[13px] uppercase tracking-[0.1em]",
              filter === f.id && "bg-royal hover:bg-royal/90",
            )}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No tournaments match that filter this season.</p>
      ) : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <Card key={t.slug} className="group transition-all hover:-translate-y-0.5 hover:border-royal/40 hover:shadow-lg hover:shadow-royal/5">
              <CardContent className="flex h-full flex-col gap-3 pt-0">
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant={t.status === "UPCOMING" ? "default" : "secondary"}
                    className={cn("font-display text-[10.5px] tracking-[0.13em]", t.status === "UPCOMING" && "bg-royal")}
                  >
                    {t.status}
                  </Badge>
                  <Badge variant="outline" className="font-display text-[10.5px] tracking-[0.13em]">
                    {t.gender === "women" ? "Women" : "Men"}
                  </Badge>
                  <Badge variant="outline" className="font-display text-[10.5px] tracking-[0.13em]">{t.group}</Badge>
                </div>

                <h3 className="text-lg uppercase leading-tight text-navy-800">{t.title}</h3>

                <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
                  <span className="num flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {t.start} – {t.end}
                  </span>
                  <span className="num text-sm font-semibold text-navy-800">
                    {t.matches}
                    <span className="ml-1 text-[11px] font-normal text-muted-foreground">matches</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
