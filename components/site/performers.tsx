"use client";

import { TOP_RUNS, TOP_WICKETS, ZONES, type Performer } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ZoneBadge } from "./zone-badge";
import { SERIES } from "@/components/charts/tokens";

function Board({ rows, unit }: { rows: Performer[]; unit: string }) {
  const max = rows[0].value;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((p, i) => {
        const z = ZONES[p.zone];
        return (
          <Card key={p.name} className="transition-shadow hover:shadow-lg hover:shadow-royal/5">
            <CardContent className="pt-0">
              <p className="eyebrow text-royal">{i === 0 ? "Leader" : `#${i + 1}`}</p>
              <h3 className="mt-2 text-2xl leading-tight text-navy-800">{p.name}</h3>
              <span className="mt-2.5 flex items-center gap-2 text-[11.5px] uppercase tracking-[0.09em] text-muted-foreground">
                <ZoneBadge zone={p.zone} size={20} />
                {z.name}
              </span>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="num text-[2.6rem] font-semibold leading-none" style={{ color: SERIES.a.light }}>
                  <NumberTicker value={p.value} />
                </span>
                <span className="font-display text-xs uppercase tracking-[0.14em] text-muted-foreground">{unit}</span>
              </p>
              <span className="mt-4 block h-2 bg-[#e6ecf6]">
                <span
                  className="block h-full"
                  style={{ width: `${(p.value / max) * 100}%`, background: SERIES.a.light, borderRadius: "0 4px 4px 0" }}
                />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function Performers() {
  return (
    <Tabs defaultValue="runs">
      <TabsList>
        <TabsTrigger value="runs">Run getters</TabsTrigger>
        <TabsTrigger value="wickets">Wicket takers</TabsTrigger>
      </TabsList>
      <TabsContent value="runs" className="pt-6"><Board rows={TOP_RUNS} unit="runs" /></TabsContent>
      <TabsContent value="wickets" className="pt-6"><Board rows={TOP_WICKETS} unit="wickets" /></TabsContent>
    </Tabs>
  );
}
