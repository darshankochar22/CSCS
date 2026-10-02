import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardBody, CardContainer, CardItem } from "@/components/aceternity/3d-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Section, SectionHeader } from "@/components/cscs/section";
import { Jersey } from "@/components/cscs/jersey";
import { PlayerCard, surname } from "@/components/cscs/player-card";
import { FormSpark } from "@/components/cscs/match-charts";
import { RevealStat } from "@/components/cscs/reveal-stat";
import { MATCHES, PLAYERS, avg, econ, ov, playerBySlug, sr, squadOf, statFor, teamById, tournamentBySlug } from "@/lib/demo";
import { fmtDate } from "@/lib/demo/format";

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = playerBySlug.get((await params).slug);
  return p ? { title: p.name, description: `${p.name}, ${p.role} for ${teamById(p.teamId).name}.` } : { title: "Player not found" };
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = playerBySlug.get((await params).slug);
  if (!p) notFound();
  const team = teamById(p.teamId);
  const s = statFor(p.id);
  const log = MATCHES.filter((m) => m.status !== "upcoming" && m.xi && Object.values(m.xi).some((x) => x.includes(p.id))).map((m) => {
    const bat = m.innings.flatMap((i) => i.batting).find((b) => b.playerId === p.id && b.didBat);
    const bowl = m.innings.flatMap((i) => i.bowling).find((b) => b.playerId === p.id);
    const opp = m.home === p.teamId ? m.away : m.home;
    return { m, bat, bowl, opp };
  });

  const facts: [string, string][] = [
    ["Team", team.name], ["Role", p.role], ["Batting", p.batStyle], ["Bowling", p.bowlStyle ?? "-"],
    ["Age", `${p.age}`], ["District", p.district], ["Shirt", `#${p.number}`], ["State debut", `${p.career.debut}`],
  ];

  return (
    <>
      <PageHeader crumbs={[{ name: "Players", href: "/players" }, { name: p.name }]} eyebrow={team.name} title={p.name}>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant="outline">{p.role}</Badge>
          {p.captain ? <Badge>Captain</Badge> : null}
          {p.viceCaptain ? <Badge variant="outline">Vice-captain</Badge> : null}
          {p.star ? <Badge variant="outline">Hero icon</Badge> : null}
        </div>
      </PageHeader>

      <Section bordered={false} className="pt-0 sm:pt-0">
        <div className="grid items-start gap-10 lg:grid-cols-[380px_1fr]">
          <CardContainer containerClassName="py-0 justify-start" className="w-full">
            <CardBody className="relative h-auto w-full rounded-3xl border bg-white p-6">
              <CardItem translateZ={30} className="flex w-full items-center justify-between">
                <span className="eyebrow text-[11px]">{team.short}</span>
                <span className="num text-sm text-muted-foreground">#{p.number}</span>
              </CardItem>
              <CardItem translateZ={80} className="mt-4 w-full rounded-2xl bg-neutral-50 px-8 pt-6">
                <Jersey side="back" name={surname(p.name)} number={p.number} variant={p.gender === "women" ? "women" : "home"} />
              </CardItem>
              <CardItem translateZ={50} as="p" className="mt-5 font-display text-3xl font-bold uppercase leading-none">{p.name}</CardItem>
              <CardItem translateZ={20} as="p" className="mt-2 text-sm text-muted-foreground">{p.bio}</CardItem>
            </CardBody>
          </CardContainer>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <RevealStat value={s.bat?.runs ?? 0} label="Season runs" />
              <RevealStat value={avg(s.bat)} label="Batting avg" />
              <RevealStat value={s.bowl?.wickets ?? 0} label="Season wickets" />
              <RevealStat value={s.bowl ? econ(s.bowl.runs, s.bowl.balls) : "-"} label="Economy" />
            </div>

            <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border sm:grid-cols-4">
              {facts.map(([k, v]) => (
                <div key={k} className="border-b border-r p-4 [&:nth-child(4n)]:border-r-0">
                  <dt className="eyebrow text-[10px]">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <Tabs defaultValue="batting">
              <TabsList>
                <TabsTrigger value="batting">Batting</TabsTrigger>
                <TabsTrigger value="bowling">Bowling</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
              </TabsList>
              <TabsContent value="batting" className="mt-4">
                <Card className="py-0"><Table>
                  <TableHeader><TableRow>{["Inns", "Runs", "HS", "Avg", "SR", "50s", "100s", "4s", "6s"].map((h) => <TableHead key={h} className="text-right first:pl-5 last:pr-5">{h}</TableHead>)}</TableRow></TableHeader>
                  <TableBody><TableRow className="num">
                    {[s.bat?.inns ?? 0, s.bat?.runs ?? 0, s.bat?.hs ?? 0, avg(s.bat), s.bat ? sr(s.bat.runs, s.bat.balls) : "-", s.bat?.fifties ?? 0, s.bat?.hundreds ?? 0, s.bat?.fours ?? 0, s.bat?.sixes ?? 0].map((v, i) => (
                      <TableCell key={i} className="text-right first:pl-5 last:pr-5">{v}</TableCell>
                    ))}
                  </TableRow></TableBody>
                </Table></Card>
              </TabsContent>
              <TabsContent value="bowling" className="mt-4">
                <Card className="py-0"><Table>
                  <TableHeader><TableRow>{["Inns", "Overs", "Runs", "Wkts", "Best", "Econ", "Dots"].map((h) => <TableHead key={h} className="text-right first:pl-5 last:pr-5">{h}</TableHead>)}</TableRow></TableHeader>
                  <TableBody><TableRow className="num">
                    {[s.bowl?.inns ?? 0, s.bowl ? ov(s.bowl.balls) : 0, s.bowl?.runs ?? 0, s.bowl?.wickets ?? 0, s.bowl ? `${s.bowl.best[0]}/${s.bowl.best[1]}` : "-", s.bowl ? econ(s.bowl.runs, s.bowl.balls) : "-", s.bowl?.dots ?? 0].map((v, i) => (
                      <TableCell key={i} className="text-right first:pl-5 last:pr-5">{v}</TableCell>
                    ))}
                  </TableRow></TableBody>
                </Table></Card>
              </TabsContent>
              <TabsContent value="career" className="mt-4">
                <Card className="py-0"><Table>
                  <TableHeader><TableRow>{["Matches", "Runs", "HS", "50s", "100s", "Wickets", "Best"].map((h) => <TableHead key={h} className="text-right first:pl-5 last:pr-5">{h}</TableHead>)}</TableRow></TableHeader>
                  <TableBody><TableRow className="num">
                    {[p.career.matches, p.career.runs, p.career.hs, p.career.fifties, p.career.hundreds, p.career.wickets, p.career.best].map((v, i) => (
                      <TableCell key={i} className="text-right first:pl-5 last:pr-5">{v}</TableCell>
                    ))}
                  </TableRow></TableBody>
                </Table></Card>
              </TabsContent>
            </Tabs>

            {log.length ? (
              <Card>
                <CardHeader><CardTitle>Recent form</CardTitle><CardDescription>Runs in each match this season.</CardDescription></CardHeader>
                <CardContent><FormSpark data={log.map((l, i) => ({ i: i + 1, v: l.bat?.runs ?? 0 }))} /></CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </Section>

      {log.length ? (
        <Section>
          <SectionHeader eyebrow="Match log" title="Season 2026-27" />
          <Card className="py-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-5">Date</TableHead><TableHead>Match</TableHead>
                <TableHead className="text-right">Batting</TableHead><TableHead className="pr-5 text-right">Bowling</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {[...log].reverse().map(({ m, bat, bowl, opp }) => (
                  <TableRow key={m.id}>
                    <TableCell className="pl-5 text-muted-foreground">{fmtDate(m.date.slice(0, 10), { day: "numeric", month: "short" })}</TableCell>
                    <TableCell>
                      <Link href={`/matches/${m.id}`} className="font-medium hover:underline">v {teamById(opp).name}</Link>
                      <span className="block text-xs text-muted-foreground">{tournamentBySlug(m.tournament)!.short}</span>
                    </TableCell>
                    <TableCell className="num text-right">{bat ? `${bat.runs}${bat.dismissal ? "" : "*"} (${bat.balls})` : "DNB"}</TableCell>
                    <TableCell className="num pr-5 text-right">{bowl ? `${bowl.wickets}/${bowl.runs} (${ov(bowl.balls)})` : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Section>
      ) : null}

      <Section>
        <SectionHeader eyebrow={team.name} title="Teammates" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {squadOf(p.teamId).filter((x) => x.id !== p.id).slice(0, 4).map((x) => <PlayerCard key={x.id} p={x} />)}
        </div>
      </Section>
    </>
  );
}
