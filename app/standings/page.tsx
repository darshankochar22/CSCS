import type { Metadata } from "next";
import { CardSpotlight } from "@/components/aceternity/card-spotlight";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, Section, SectionHeader } from "@/components/cscs/section";
import { StandingsTable } from "@/components/cscs/standings-table";
import { NrrChart, RunsForAgainstChart } from "@/components/cscs/charts";
import { ZoneBadge } from "@/components/cscs/zone-badge";
import { LADDER, TOP_RUNS, TOP_WICKETS, ZONES, zoneRunTotals, type Performer, type ZoneKey } from "@/lib/data";

export const metadata: Metadata = {
  title: "Standings",
  description: "The zone table, run differentials and leading performers from the 2026-27 Challenger Trophy.",
};

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

function Leaders({ title, unit, rows }: { title: string; unit: string; rows: Performer[] }) {
  const [top, ...rest] = rows;
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <CardSpotlight radius={260} color="#f1f1f1" className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="relative z-20 flex items-center gap-4">
          <Avatar className="size-14 border"><AvatarFallback className="bg-white font-semibold">{initials(top.name)}</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-neutral-900">{top.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-neutral-500">
              <ZoneBadge zone={top.zone} size={16} /> {ZONES[top.zone].name}
            </p>
          </div>
          <p className="num text-right text-4xl font-semibold text-neutral-900">
            {top.value}
            <span className="block text-xs font-normal text-neutral-500">{unit}</span>
          </p>
        </div>
      </CardSpotlight>
      <ul className="mt-3 divide-y rounded-2xl border">
        {rest.map((p, i) => (
          <li key={p.name} className="flex items-center gap-3 px-5 py-3.5">
            <span className="num w-4 text-sm text-muted-foreground">{i + 2}</span>
            <Avatar className="size-8 border"><AvatarFallback className="bg-white text-xs">{initials(p.name)}</AvatarFallback></Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{p.name}</span>
              <span className="block text-xs text-muted-foreground">{ZONES[p.zone].name}</span>
            </span>
            <span className="num font-semibold">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StandingsPage() {
  const totals = zoneRunTotals();
  const forAgainst = (Object.keys(ZONES) as ZoneKey[]).map((z) => ({
    zone: ZONES[z].short, for: totals[z].for, against: totals[z].against,
  }));

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Standings" }]}
        eyebrow="Women's Senior & U23 One Day Challenger Trophy 2026-27"
        title="Standings"
        blurb="Four matches each, two points a win. West Zone finished clear on twelve; East, South and Central all tied on eight, split only by net run rate."
      />
      <Section bordered={false} className="pt-0 sm:pt-0">
        <StandingsTable />
        <p className="mt-3 text-xs text-muted-foreground">Select a column heading to sort. Hover it for the full name.</p>
      </Section>

      <Section id="analysis">
        <SectionHeader eyebrow="Derived from all ten scorecards" title="Where the table was decided" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Runs for and against</CardTitle>
              <CardDescription>Every run each zone scored and conceded in the group stage.</CardDescription>
            </CardHeader>
            <CardContent><RunsForAgainstChart rows={forAgainst} /></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Net run rate</CardTitle>
              <CardDescription>The tie-breaker that separated three sides on eight points.</CardDescription>
            </CardHeader>
            <CardContent>
              <NrrChart rows={LADDER.map((r) => ({ zone: ZONES[r.team].name, nrr: r.nrr }))} />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section id="performers">
        <SectionHeader eyebrow="Top performers" title="Leading the trophy" />
        <div className="grid gap-10 md:grid-cols-2">
          <Leaders title="Most runs" unit="runs" rows={TOP_RUNS} />
          <Leaders title="Most wickets" unit="wickets" rows={TOP_WICKETS} />
        </div>
      </Section>
    </>
  );
}
