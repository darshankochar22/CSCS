import { Clock, MapPin, Sun } from "lucide-react";
import { MATCHES, ZONES, BIGGEST_WIN, SEASON, TOP_RUNS, TOP_WICKETS, type Match } from "@/lib/data";
import { runRate, runsOf, wicketsOf } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ZoneBadge } from "./zone-badge";
import { RateBullet } from "@/components/charts/rate-bullet";
import { cn } from "@/lib/utils";

function Innings({ zone, score, overs, note, lead }: {
  zone: keyof typeof ZONES; score: string; overs: string; note: string; lead?: boolean;
}) {
  const z = ZONES[zone];
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t py-4 first:border-0 first:pt-0">
      <span className="flex min-w-0 items-center gap-3">
        <ZoneBadge zone={zone} size={40} />
        <span className="min-w-0">
          <span className="block truncate font-display text-[1.6rem] font-semibold uppercase leading-none tracking-[0.03em] text-navy-800">
            {z.name}
          </span>
          <span className="mt-1 block text-[11.5px] text-muted-foreground">{note}</span>
        </span>
      </span>
      <span className="text-right">
        <span className={cn("num block text-3xl font-semibold tracking-tight", lead ? "text-royal" : "text-navy-800")}>
          {score}
        </span>
        <span className="num mt-0.5 block text-[11.5px] text-muted-foreground">
          {overs} ov · {runRate(score, overs)} rpo
        </span>
      </span>
    </div>
  );
}

function Stat({ label, value, decimals = 0, suffix }: { label: string; value: number; decimals?: number; suffix?: string }) {
  return (
    <div className="rounded-lg border bg-secondary p-3.5">
      <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className="num mt-1 text-2xl font-semibold text-navy-800">
        <NumberTicker value={value} decimalPlaces={decimals} className="text-navy-800" />
        {suffix ? <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span> : null}
      </p>
    </div>
  );
}

export function MatchFeature({ match = MATCHES[0] }: { match?: Match }) {
  const totalRuns = runsOf(match.firstScore) + runsOf(match.secondScore);
  const totalWkts = wicketsOf(match.firstScore) + wicketsOf(match.secondScore);
  const target = runsOf(match.firstScore) + 1;
  const required = ((target / (parseFloat(match.firstOvers) * 6)) * 6).toFixed(2);
  const chaseRate = runRate(match.secondScore, match.secondOvers);
  const win = ZONES[match.winner];
  const lost = ZONES[match.winner === match.first ? match.second : match.first];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="relative overflow-hidden">
        <BorderBeam size={220} duration={9} colorFrom="#1d4ed8" colorTo="#f5c518" />
        <CardHeader className="border-b bg-navy-800 pattern-weave [.border-b]:pb-5">
          <p className="eyebrow text-gold">Match {match.id} · Final round</p>
          <h3 className="mt-1.5 text-lg uppercase tracking-[0.03em] text-white">
            Women&apos;s Senior &amp; Under-23 One Day Challenger Trophy 2026-27
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { i: Clock, t: match.date },
              { i: Sun, t: "Day match" },
              { i: MapPin, t: `${match.ground}, ${match.city}` },
            ].map((b) => (
              <Badge key={b.t} variant="outline" className="border-white/20 bg-white/5 text-sky">
                <b.i className="size-3" /> {b.t}
              </Badge>
            ))}
            <Badge variant="outline" className="border-white/20 bg-white/5 text-sky">40 overs</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Innings zone={match.first} score={match.firstScore} overs={match.firstOvers} note="Batted first" lead />
          <Innings zone={match.second} score={match.secondScore} overs={match.secondOvers} note={`Target ${target}`} />

          <p className="mt-4 rounded-lg border border-win/25 bg-win/8 px-4 py-3 font-display text-lg font-semibold uppercase tracking-[0.06em] text-win">
            {win.name} won by {match.margin}
          </p>

          <Tabs defaultValue="summary" className="mt-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="innings">Innings</TabsTrigger>
              <TabsTrigger value="facts">Match facts</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="pt-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Result" value={match.marginRuns} suffix="runs" />
                <Stat label="Runs in match" value={totalRuns} />
                <Stat label="Wickets fallen" value={totalWkts} />
                <Stat label="Overs bowled" value={parseFloat(match.firstOvers) + parseFloat(match.secondOvers)} decimals={1} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {win.name} set the highest total of their campaign and defended it without ever being threatened —{" "}
                {lost.name} batted out all {match.secondOvers} overs but lost only {wicketsOf(match.secondScore)} wickets
                doing it, finishing {match.marginRuns} short. The win left three sides level on eight points, separated
                only by net run rate.
              </p>
            </TabsContent>

            <TabsContent value="innings" className="pt-4">
              <RateBullet
                required={parseFloat(required)}
                rows={[
                  { label: ZONES[match.first].name, rate: parseFloat(runRate(match.firstScore, match.firstOvers)),
                    note: `${match.firstScore} in ${match.firstOvers} ov` },
                  { label: ZONES[match.second].name, rate: parseFloat(chaseRate),
                    note: `${match.secondScore} in ${match.secondOvers} ov` },
                ]}
              />
              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                {lost.name} never got within {(parseFloat(required) - parseFloat(chaseRate)).toFixed(1)} runs an over of
                the rate they needed.
              </p>
            </TabsContent>

            <TabsContent value="facts" className="pt-4">
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Venue", match.ground, match.city],
                  ["Format", "50-over rules", "Reduced to 40 overs"],
                  ["Match no.", `${match.id} of 10`, "Group stage"],
                  ["Season", "2026-27", "Challenger Trophy"],
                ].map(([k, v, sub]) => (
                  <div key={k} className="rounded-lg border bg-secondary p-3.5">
                    <dt className="font-display text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{k}</dt>
                    <dd className="mt-1.5 text-sm font-semibold leading-snug text-navy-800">{v}</dd>
                    <dd className="mt-0.5 text-[11px] text-muted-foreground">{sub}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader className="[.border-b]:pb-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-royal">Tournament leaders</h4>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { p: TOP_RUNS[0], unit: "runs" },
              { p: TOP_WICKETS[0], unit: "wickets" },
            ].map(({ p, unit }) => {
              const z = ZONES[p.zone];
              return (
                <div key={p.name} className="flex items-center gap-3 border-t pt-3 first:border-0 first:pt-0">
                  <ZoneBadge zone={p.zone} size={28} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy-800">{p.name}</span>
                    <span className="block text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{z.name} · {unit}</span>
                  </span>
                  <span className="num shrink-0 text-xl font-semibold text-royal">
                    <NumberTicker value={p.value} className="text-royal" />
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="[.border-b]:pb-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-royal">Season at a glance</h4>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Stat label="Tournaments" value={SEASON.tournaments} />
            <Stat label="Matches" value={SEASON.matches} />
            <Stat label="District teams" value={SEASON.districtTeams} />
            <Stat label="Age groups" value={SEASON.ageGroups} />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-navy-800 pattern-weave text-white">
          <CardHeader className="[.border-b]:pb-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-gold">Biggest win of the trophy</h4>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <ZoneBadge zone={BIGGEST_WIN.winner} size={40} />
            <span className="min-w-0">
              <span className="block font-display text-xl font-semibold uppercase tracking-[0.03em]">
                {ZONES[BIGGEST_WIN.winner].name}
              </span>
              <span className="block text-[12px] text-sky/70">
                beat {ZONES[BIGGEST_WIN.winner === BIGGEST_WIN.first ? BIGGEST_WIN.second : BIGGEST_WIN.first].name} ·
                Match {BIGGEST_WIN.id}
              </span>
            </span>
            <span className="ml-auto shrink-0 text-right">
              <span className="num block text-3xl font-semibold text-gold">
                <NumberTicker value={BIGGEST_WIN.marginRuns} className="text-gold" />
              </span>
              <span className="block font-display text-[10.5px] font-semibold uppercase tracking-[0.15em] text-sky/70">runs</span>
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
