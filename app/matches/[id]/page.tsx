import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Coins, MapPin, Trophy, Tv } from "lucide-react";
import { TextFlippingBoard } from "@/components/aceternity/text-flipping-board";
import { GlowingEffect } from "@/components/aceternity/glowing-effect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Section } from "@/components/cscs/section";
import { MatchCard, StatusBadge, TeamMark } from "@/components/cscs/match-card";
import { PlayerLink, Scorecard } from "@/components/cscs/scorecard";
import { Commentary } from "@/components/cscs/commentary";
import { Jersey } from "@/components/cscs/jersey";
import { surname } from "@/components/cscs/player-card";
import { ManhattanChart, PartnershipChart, PhaseChart, RunTypesChart, WormChart } from "@/components/cscs/match-charts";
import {
  MATCHES, VENUES, anyPlayer, econ, matchById, ov, playerById, pointsTable, squadFor, teamById, tournamentBySlug, type Match,
} from "@/lib/demo";
import { commentary, comparison, keyMoments, manhattan, partnerships, phases, runTypes, topPerformers, worm } from "@/lib/demo/analysis";
import { fmtDate, fmtTime, inningsOf, liveLine, oversOf, scoreText } from "@/lib/demo/format";

export function generateStaticParams() {
  return MATCHES.map((m) => ({ id: String(m.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const m = matchById(Number((await params).id));
  if (!m) return { title: "Match not found" };
  return { title: `${teamById(m.home).short} v ${teamById(m.away).short}`, description: m.result ?? `${teamById(m.home).name} v ${teamById(m.away).name}` };
}

const pad = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s + " ".repeat(n - s.length));

function boardRows(m: Match) {
  const line = (id: string) => {
    const inn = inningsOf(m, id);
    const right = inn ? `${scoreText(inn)} ${oversOf(inn)}` : "";
    return pad(teamById(id).short, 22 - right.length) + right;
  };
  const foot = m.status === "live" ? liveLine(m) : m.status === "completed" ? `${teamById(m.winner ?? m.home).short} WON BY ${m.marginText ?? ""}` : `${fmtDate(m.date, { day: "numeric", month: "short" })} ${fmtTime(m.date)}`;
  return [tournamentBySlug(m.tournament)!.short + ` MATCH ${m.matchNo}`, "", line(m.home), line(m.away), "", foot.toUpperCase().slice(0, 22)];
}

function ScoreHeader({ m }: { m: Match }) {
  const chase = m.innings[1];
  const total = (m.format === "T20" ? 20 : 50) * 6;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <TextFlippingBoard rows={boardRows(m)} className="max-w-none" />
      <div className="flex flex-col gap-4">
        {[m.home, m.away].map((id) => {
          const inn = inningsOf(m, id);
          return (
            <div key={id} className="flex items-center gap-4 rounded-2xl border p-4">
              <TeamMark teamId={id} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-2xl font-bold uppercase">{teamById(id).name}</p>
                <p className="text-xs text-muted-foreground">{m.toss?.winner === id ? `Won the toss, chose to ${m.toss.decision}` : " "}</p>
              </div>
              {inn ? (
                <p className="num text-right text-3xl font-semibold">
                  {scoreText(inn)}<span className="block text-xs font-normal text-muted-foreground">{oversOf(inn)} ov</span>
                </p>
              ) : <p className="text-sm text-muted-foreground">Yet to bat</p>}
            </div>
          );
        })}
        {m.status === "live" && chase && m.target ? (
          <Card className="gap-3 py-5">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{liveLine(m)}</span>
                <span className="num text-muted-foreground">CRR {econ(chase.runs, chase.legalBalls)} · RRR {econ(m.target - chase.runs, total - chase.legalBalls)}</span>
              </div>
              <Progress value={(chase.runs / m.target) * 100} />
            </CardContent>
          </Card>
        ) : null}
        {m.result ? (
          <Alert><Trophy /><AlertTitle>{m.result}</AlertTitle><AlertDescription>{tournamentBySlug(m.tournament)!.name}</AlertDescription></Alert>
        ) : null}
      </div>
    </div>
  );
}

function Summary({ m }: { m: Match }) {
  const potm = m.potm ? anyPlayer(m.potm) : undefined;
  const comp = comparison(m);
  const [ia, ib] = m.innings;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-6">
        {potm ? (
          <div className="relative rounded-3xl border p-1.5">
            <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} variant="white" />
            <div className="relative grid grid-cols-[120px_1fr] items-center gap-5 rounded-[1.25rem] bg-white p-5">
              <Jersey side="back" name={surname(potm.name)} number={potm.number} variant={potm.gender === "women" ? "women" : "home"} />
              <div>
                <p className="eyebrow text-[11px]">Player of the match</p>
                <p className="mt-1 font-display text-3xl font-bold uppercase leading-none"><PlayerLink id={potm.id} className="hover:underline" /></p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {m.innings.map((inn) => {
                    const b = inn.batting.find((x) => x.playerId === potm.id && x.didBat);
                    const w = inn.bowling.find((x) => x.playerId === potm.id);
                    return [b ? `${b.runs}${b.dismissal ? "" : "*"} (${b.balls})` : null, w ? `${w.wickets}/${w.runs} (${ov(w.balls)})` : null].filter(Boolean).join(" · ");
                  }).filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <Card>
          <CardHeader><CardTitle>Top performers</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {topPerformers(m).map((t) => (
              <div key={t.team} className="grid grid-cols-2 gap-3">
                {t.bat ? (
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">{teamById(t.team).short} batting</p>
                    <p className="mt-1 truncate text-sm"><PlayerLink id={t.bat.playerId} /></p>
                    <p className="num text-xl font-semibold">{t.bat.runs}{t.bat.dismissal ? "" : "*"} <span className="text-xs font-normal text-muted-foreground">({t.bat.balls})</span></p>
                  </div>
                ) : <div />}
                {t.bowl ? (
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">{teamById(t.bowlTeam).short} bowling</p>
                    <p className="mt-1 truncate text-sm"><PlayerLink id={t.bowl.playerId} /></p>
                    <p className="num text-xl font-semibold">{t.bowl.wickets}/{t.bowl.runs} <span className="text-xs font-normal text-muted-foreground">({ov(t.bowl.balls)})</span></p>
                  </div>
                ) : <div />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Key moments</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l pl-5">
              {keyMoments(m).map((k, i) => (
                <li key={i} className="relative">
                  <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-white bg-neutral-900" />
                  {k.over ? <span className="num mr-2 text-xs text-muted-foreground">{k.over}</span> : null}
                  <span className="text-sm">{k.text}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit gap-0 py-0">
        <div className="border-b px-5 py-4"><h3 className="font-display text-xl font-bold uppercase">Stats comparison</h3></div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">{ia ? teamById(ia.battingTeam).short : ""}</TableHead>
              <TableHead className="text-center" />
              <TableHead className="pr-5 text-right">{ib ? teamById(ib.battingTeam).short : ""}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comp.map((r) => {
              const na = Number(r.a), nb = Number(r.b);
              const share = na + nb ? (na / (na + nb)) * 100 : 50;
              return (
                <TableRow key={r.stat}>
                  <TableCell className="num pl-5 font-semibold">{r.a}</TableCell>
                  <TableCell className="w-1/2">
                    <p className="text-center text-xs text-muted-foreground">{r.stat}</p>
                    {Number.isFinite(share) ? (
                      <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-neutral-200">
                        <div className="bg-neutral-900" style={{ width: `${share}%` }} />
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="num pr-5 text-right font-semibold">{r.b}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Analysis({ m }: { m: Match }) {
  const labels = { a: teamById(m.innings[0].battingTeam).short, b: m.innings[1] ? teamById(m.innings[1].battingTeam).short : "" };
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>Worm</CardTitle><CardDescription>Cumulative runs after each over.</CardDescription></CardHeader>
        <CardContent><WormChart data={worm(m)} labels={labels} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Manhattan</CardTitle><CardDescription>Runs scored in every over.</CardDescription></CardHeader>
        <CardContent><ManhattanChart data={manhattan(m)} labels={labels} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Scoring shots</CardTitle><CardDescription>Dots, singles and boundaries off the bat.</CardDescription></CardHeader>
        <CardContent><RunTypesChart data={runTypes(m)} labels={labels} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Run rate by phase</CardTitle><CardDescription>Runs per over in each phase of the innings.</CardDescription></CardHeader>
        <CardContent><PhaseChart data={phases(m)} labels={labels} /></CardContent></Card>
      {m.innings.map((inn) => (
        <Card key={inn.battingTeam}>
          <CardHeader><CardTitle>{teamById(inn.battingTeam).short} partnerships</CardTitle><CardDescription>Runs added for each wicket.</CardDescription></CardHeader>
          <CardContent><PartnershipChart data={partnerships(inn)} /></CardContent>
        </Card>
      ))}
    </div>
  );
}

function Squads({ m }: { m: Match }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[m.home, m.away].map((id) => {
        const ids = m.xi?.[id] ?? squadFor(id).map((p) => p.id);
        return (
          <Card key={id} className="gap-0 py-0">
            <div className="flex items-center gap-3 border-b px-5 py-4">
              <TeamMark teamId={id} />
              <h3 className="font-display text-xl font-bold uppercase">{teamById(id).name}</h3>
              <Badge variant="outline" className="ml-auto">{m.xi ? "Playing XI" : "Squad"}</Badge>
            </div>
            <ol className="divide-y">
              {ids.map((pid, i) => {
                const p = anyPlayer(pid)!;
                return (
                  <li key={pid} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                    <span className="num w-5 text-muted-foreground">{i + 1}</span>
                    <PlayerLink id={pid} />
                    <span className="ml-auto text-xs text-muted-foreground">{p.role}</span>
                  </li>
                );
              })}
            </ol>
          </Card>
        );
      })}
    </div>
  );
}

function Info({ m }: { m: Match }) {
  const t = tournamentBySlug(m.tournament)!;
  const v = VENUES[m.venue];
  const rows: [string, string][] = [
    ["Tournament", t.name], ["Match", `Match ${m.matchNo} · ${m.format === "T20" ? "T20 (20 overs)" : "One Day (50 overs)"}`],
    ["Date", fmtDate(m.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })], ["Start", `${fmtTime(m.date)} IST`],
    ["Venue", `${v.name}, ${v.city}`],
    ["Toss", m.toss ? `${teamById(m.toss.winner).name}, chose to ${m.toss.decision}` : "Yet to happen"],
    ["Umpires", `${m.officials.umpire1}, ${m.officials.umpire2}`], ["Match referee", m.officials.referee], ["Scorer", m.officials.scorer],
    ["Points", m.winner ? `${teamById(m.winner).short} 4, ${teamById(m.winner === m.home ? m.away : m.home).short} 0` : m.status === "completed" ? "2 each" : "-"],
  ];
  return (
    <Card className="gap-0 py-0">
      <Table>
        <TableBody>
          {rows.map(([k, v2]) => (
            <TableRow key={k}>
              <TableCell className="w-48 pl-5 text-muted-foreground">{k}</TableCell>
              <TableCell className="pr-5 font-medium">{v2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function Preview({ m }: { m: Match }) {
  const t = tournamentBySlug(m.tournament)!;
  const table = pointsTable(t);
  const form = (id: string) => table.find((r) => r.team.id === id)?.form ?? [];
  const recent = MATCHES.filter((x) => x.tournament === m.tournament && x.status === "completed").slice(-3).reverse();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader><CardTitle>Form guide</CardTitle><CardDescription>Last results in the {t.short}.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {[m.home, m.away].map((id) => (
            <div key={id} className="flex items-center gap-3">
              <TeamMark teamId={id} />
              <span className="flex-1 font-semibold">{teamById(id).name}</span>
              <span className="flex gap-1">
                {form(id).length ? form(id).map((f, i) => (
                  <span key={i} className={`grid size-7 place-items-center rounded-full border text-xs font-semibold ${f === "W" ? "border-neutral-900 bg-neutral-900 text-white" : ""}`}>{f}</span>
                )) : <span className="text-sm text-muted-foreground">No games yet</span>}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Where to follow</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="flex items-center gap-2"><Tv className="size-4" /> Live on the CSCS app and the BCCI domestic stream</p>
          <p className="flex items-center gap-2"><Clock className="size-4" /> Starts {fmtTime(m.date)} IST, {fmtDate(m.date, { weekday: "long", day: "numeric", month: "long" })}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4" /> {VENUES[m.venue].name}, {VENUES[m.venue].city}</p>
          <p className="flex items-center gap-2"><Coins className="size-4" /> Entry free for domestic matches</p>
        </CardContent>
      </Card>
      {recent.length ? (
        <div className="lg:col-span-2">
          <p className="eyebrow mb-3">Recent in this tournament</p>
          <div className="grid gap-3 md:grid-cols-3">{recent.map((x) => <MatchCard key={x.id} m={x} />)}</div>
        </div>
      ) : null}
    </div>
  );
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const m = matchById(Number((await params).id));
  if (!m) notFound();
  const t = tournamentBySlug(m.tournament)!;
  const played = m.status !== "upcoming";

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Matches", href: "/matches" }, { name: t.short, href: `/tournaments/${t.slug}` }, { name: `Match ${m.matchNo}` }]}
        eyebrow={t.name}
        title={`${teamById(m.home).short} v ${teamById(m.away).short}`}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <StatusBadge m={m} />
          <Badge variant="outline"><CalendarDays /> {fmtDate(m.date)}</Badge>
          <Badge variant="outline"><MapPin /> {VENUES[m.venue].name}, {VENUES[m.venue].city}</Badge>
          <Badge variant="outline">{m.format}</Badge>
        </div>
      </PageHeader>

      <Section bordered={false} className="pt-0 sm:pt-0">
        <ScoreHeader m={m} />

        <Tabs defaultValue={m.status === "live" ? "commentary" : played ? "summary" : "preview"} className="mt-12">
          <TabsList className="h-auto flex-wrap justify-start">
            {played ? (
              <>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
                <TabsTrigger value="commentary">Commentary</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </>
            ) : <TabsTrigger value="preview">Preview</TabsTrigger>}
            <TabsTrigger value="squads">{played ? "Playing XI" : "Squads"}</TabsTrigger>
            <TabsTrigger value="info">Match info</TabsTrigger>
          </TabsList>

          {played ? (
            <>
              <TabsContent value="summary" className="mt-6"><Summary m={m} /></TabsContent>
              <TabsContent value="scorecard" className="mt-6">
                <Tabs defaultValue="0">
                  <TabsList>
                    {m.innings.map((inn, i) => (
                      <TabsTrigger key={i} value={String(i)}>{teamById(inn.battingTeam).short} {scoreText(inn)}</TabsTrigger>
                    ))}
                  </TabsList>
                  {m.innings.map((inn, i) => (
                    <TabsContent key={i} value={String(i)} className="mt-4"><Scorecard inn={inn} /></TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
              <TabsContent value="commentary" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {[...m.innings].reverse().map((inn) => (
                    <Commentary key={inn.battingTeam} balls={commentary(inn)} title={`${teamById(inn.battingTeam).short} innings`} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="analysis" className="mt-6"><Analysis m={m} /></TabsContent>
            </>
          ) : (
            <TabsContent value="preview" className="mt-6"><Preview m={m} /></TabsContent>
          )}
          <TabsContent value="squads" className="mt-6"><Squads m={m} /></TabsContent>
          <TabsContent value="info" className="mt-6"><Info m={m} /></TabsContent>
        </Tabs>

        <p className="mt-10 text-sm text-muted-foreground">
          More from the <Link href={`/tournaments/${t.slug}`} className="font-medium text-foreground underline underline-offset-4">{t.name}</Link>
          {playerById.size ? "" : ""}
        </p>
      </Section>
    </>
  );
}
