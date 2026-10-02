import Link from "next/link";
import { ArrowRight, Building2, Layers, Shield, Trophy, Users } from "lucide-react";
import { HeroParallax } from "@/components/aceternity/hero-parallax";
import { Highlight } from "@/components/aceternity/hero-highlight";
import { FlipWords } from "@/components/aceternity/flip-words";
import { TextFlippingBoard } from "@/components/aceternity/text-flipping-board";
import { Tabs as AnimatedTabs } from "@/components/aceternity/tabs";
import { Carousel, Card as AppleCard } from "@/components/aceternity/apple-cards-carousel";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { GlareCard } from "@/components/aceternity/glare-card";
import { ContainerScroll } from "@/components/aceternity/container-scroll-animation";
import { Spotlight } from "@/components/aceternity/spotlight-new";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Container, Section, SectionHeader } from "@/components/cscs/section";
import { MovingLink } from "@/components/cscs/moving-link";
import { ScoreStrip } from "@/components/cscs/score-strip";
import { TeamMark } from "@/components/cscs/match-card";
import { Jersey } from "@/components/cscs/jersey";
import { surname } from "@/components/cscs/player-card";
import { HighlightCard } from "@/components/cscs/highlight-card";
import { SponsorMarquee, SponsorMark } from "@/components/cscs/sponsors";
import {
  ARTICLES, LEADERS, LIVE, PRODUCTS, RESULTS, SPONSORS, STARS, TOURNAMENTS, anyPlayer, avg, pointsTable, statFor, teamById,
} from "@/lib/demo";
import { inningsOf, liveLine, oversOf, scoreText } from "@/lib/demo/format";
import { highlightViews } from "@/lib/demo/views";
import { PHOTOS, SEASON } from "@/lib/data";

const FEATURE = LIVE[0] ?? RESULTS[0];
const HERO_TILES = Array.from({ length: 15 }, (_, i) => {
  const p = PHOTOS[i % PHOTOS.length];
  return { title: p.title, link: "/photos", thumbnail: p.src };
});

function HeroHeader() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 md:py-28 lg:px-8">
      <p className="eyebrow">Chhattisgarh State Cricket Sangh · Season 2026-27</p>
      <h1 className="mt-5 max-w-[14ch] text-[clamp(3rem,9vw,7.25rem)] uppercase leading-[0.9]">
        Where the state&apos;s <Highlight className="text-neutral-900">cricket</Highlight> begins
      </h1>
      <div className="mt-6 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold uppercase tracking-[0.04em]">
        Play. Train.
        <FlipWords words={["Win.", "Inspire.", "Compete.", "Represent."]} className="px-2 text-neutral-900" />
      </div>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <MovingLink href={`/matches/${FEATURE.id}`}>{FEATURE.status === "live" ? "Watch live" : "Latest result"}</MovingLink>
        <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6">
          <Link href="/shop">Shop the new kit <ArrowRight /></Link>
        </Button>
      </div>
    </div>
  );
}

function boardRows() {
  const m = FEATURE;
  const line = (id: string) => {
    const inn = inningsOf(m, id);
    const right = inn ? `${scoreText(inn)} ${oversOf(inn)}` : "YET TO BAT";
    const left = teamById(id).short;
    return left + " ".repeat(Math.max(1, 22 - left.length - right.length)) + right;
  };
  return [m.status === "live" ? "LIVE NOW" : "LATEST RESULT", "", line(m.home), line(m.away), "", (m.status === "live" ? liveLine(m) : m.result ?? "").toUpperCase().slice(0, 22)];
}

function Leader({ title, id, value, unit, sub }: { title: string; id: string; value: number | string; unit: string; sub: string }) {
  const p = anyPlayer(id)!;
  return (
    <Link href={`/players/${p.slug}`} className="group grid grid-cols-[96px_1fr] items-center gap-4 rounded-2xl border bg-white p-4 transition-shadow hover:shadow-md">
      <div className="rounded-xl bg-neutral-50 p-2"><Jersey side="back" name={surname(p.name)} number={p.number} variant={p.gender === "women" ? "women" : "home"} /></div>
      <div className="min-w-0">
        <p className="eyebrow text-[11px]">{title}</p>
        <p className="mt-1 truncate font-display text-2xl font-bold uppercase leading-none">{p.name}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{teamById(p.teamId).name} · {sub}</p>
        <p className="num mt-2 text-4xl font-semibold">{value}<span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span></p>
      </div>
    </Link>
  );
}

function MiniTable({ slug }: { slug: string }) {
  const t = TOURNAMENTS.find((x) => x.slug === slug)!;
  return (
    <div className="w-full rounded-2xl border bg-white p-2 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Team</TableHead>
            <TableHead className="text-right">P</TableHead>
            <TableHead className="text-right">W</TableHead>
            <TableHead className="text-right">NRR</TableHead>
            <TableHead className="pr-4 text-right">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pointsTable(t).map((r) => (
            <TableRow key={r.team.id} className={r.team.home ? "font-semibold" : ""}>
              <TableCell className="pl-4"><span className="flex items-center gap-2"><TeamMark teamId={r.team.id} size={24} />{r.team.name}</span></TableCell>
              <TableCell className="num text-right">{r.played}</TableCell>
              <TableCell className="num text-right">{r.won}</TableCell>
              <TableCell className="num text-right">{r.nrr > 0 ? "+" : ""}{r.nrr.toFixed(3)}</TableCell>
              <TableCell className="num pr-4 text-right">{r.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function HomePage() {
  const title = SPONSORS[0];
  const hl = highlightViews();
  const runs = LEADERS.runs[0], wkts = LEADERS.wickets[0], six = LEADERS.sixes[0];

  return (
    <>
      <ScoreStrip />
      <HeroParallax products={HERO_TILES} header={<HeroHeader />} />

      {/* Featured match */}
      <Section id="scores">
        <SectionHeader
          eyebrow={FEATURE.status === "live" ? "Live now" : "Latest result"}
          title={`${teamById(FEATURE.home).name} v ${teamById(FEATURE.away).name}`}
          aside={<Button asChild variant="outline" className="rounded-full"><Link href={`/matches/${FEATURE.id}`}>Match centre <ArrowRight /></Link></Button>}
        />
        <TextFlippingBoard rows={boardRows()} className="max-w-none" />
      </Section>

      {/* Hero icons */}
      <section className="relative overflow-hidden border-t py-16 sm:py-24">
        <Spotlight gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0,0%,0%,.06) 0, hsla(0,0%,0%,.02) 50%, hsla(0,0%,0%,0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(0,0%,0%,.04) 0, hsla(0,0%,0%,.01) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(0,0%,0%,.03) 0, hsla(0,0%,0%,.01) 80%, transparent 100%)" />
        <Container className="relative">
          <SectionHeader eyebrow="Hero icons" title="The stars of the state"
            aside={<Button asChild variant="outline" className="rounded-full"><Link href="/players">All players <ArrowRight /></Link></Button>} />
          <div className="grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {STARS.slice(0, 6).map((p) => {
              const s = statFor(p.id);
              return (
                <Link key={p.id} href={`/players/${p.slug}`} className="block">
                  <GlareCard className="flex flex-col p-6">
                    <div className="flex items-start justify-between">
                      <p className="eyebrow text-[11px]">{teamById(p.teamId).name}</p>
                      <span className="num text-sm text-neutral-500">#{p.number}</span>
                    </div>
                    <div className="mx-auto mt-4 w-40"><Jersey side="back" name={surname(p.name)} number={p.number} variant={p.gender === "women" ? "women" : "home"} /></div>
                    <p className="mt-auto font-display text-3xl font-bold uppercase leading-none text-neutral-900">{p.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">{p.role}{p.captain ? " · Captain" : ""}</p>
                    <div className="num mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-center text-neutral-900">
                      <div><p className="text-lg font-semibold">{s.bat?.runs ?? 0}</p><p className="text-[10px] text-neutral-500">RUNS</p></div>
                      <div><p className="text-lg font-semibold">{avg(s.bat)}</p><p className="text-[10px] text-neutral-500">AVG</p></div>
                      <div><p className="text-lg font-semibold">{s.bowl?.wickets ?? 0}</p><p className="text-[10px] text-neutral-500">WKTS</p></div>
                    </div>
                  </GlareCard>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <Section id="highlights">
        <SectionHeader eyebrow="Watch" title="Highlights"
          aside={<Button asChild variant="outline" className="rounded-full"><Link href="/highlights">All videos <ArrowRight /></Link></Button>} />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <HighlightCard h={hl[0]} large />
          <div className="grid gap-6 sm:grid-cols-2">
            {hl.slice(1, 5).map((h) => <HighlightCard key={h.id} h={h} />)}
          </div>
        </div>
      </Section>

      {/* Stat leaders + tables */}
      <Section id="stats">
        <SectionHeader eyebrow="Season 2026-27" title="Leaders & tables"
          aside={<Button asChild variant="outline" className="rounded-full"><Link href="/stats">Full stats <ArrowRight /></Link></Button>} />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-4">
            <Leader title="Most runs" id={runs.playerId} value={runs.runs} unit="runs" sub={`${runs.inns} inns · HS ${runs.hs}`} />
            <Leader title="Most wickets" id={wkts.playerId} value={wkts.wickets} unit="wkts" sub={`Best ${wkts.best[0]}/${wkts.best[1]}`} />
            <Leader title="Most sixes" id={six.playerId} value={six.sixes} unit="sixes" sub={`${six.runs} runs`} />
          </div>
          <div className="relative h-[34rem] [perspective:1000px]">
            <AnimatedTabs
              containerClassName="gap-1 flex-wrap"
              tabClassName="font-display text-sm font-semibold uppercase tracking-[0.1em]"
              activeTabClassName="bg-neutral-100"
              contentClassName="mt-6"
              tabs={TOURNAMENTS.slice(0, 4).map((t) => ({ title: t.short, value: t.slug, content: <MiniTable key={t.slug} slug={t.slug} /> }))}
            />
          </div>
        </div>
      </Section>

      {/* News */}
      <section className="border-t pt-16 sm:pt-24">
        <Container>
          <SectionHeader className="mb-0" eyebrow="News" title="From the Sangh"
            aside={<Button asChild variant="outline" className="rounded-full"><Link href="/news">All news <ArrowRight /></Link></Button>} />
        </Container>
        <Carousel
          items={ARTICLES.map((a, i) => (
            <AppleCard key={a.slug} index={i} card={{
              src: a.img, title: a.title, category: `${a.tag} · ${a.date}`,
              content: (
                <div className="max-w-3xl space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                  {a.body.map((p, j) => <p key={j}>{p}</p>)}
                  <Link href={`/news/${a.slug}`} className="inline-block font-semibold text-neutral-900 underline underline-offset-4">Read the full story</Link>
                </div>
              ),
            }} />
          ))}
        />
      </section>

      {/* Shop */}
      <section className="border-t">
        <ContainerScroll titleComponent={
          <div className="mb-6">
            <p className="eyebrow">Official store</p>
            <h2 className="mt-3 text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.95]">The 2026-27 kit is here</h2>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-full"><Link href="/shop">Shop now</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full"><Link href="/shop/home-jersey-2026">Personalise a jersey</Link></Button>
            </div>
          </div>
        }>
          <div className="grid h-full grid-cols-2 gap-4 overflow-auto bg-white p-4 md:grid-cols-4 md:p-8">
            {PRODUCTS.filter((p) => p.kind === "jersey").slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/shop/${p.slug}`} className="flex flex-col items-center justify-center rounded-2xl border p-4 hover:bg-neutral-50">
                <Jersey variant={p.variant} className="max-w-[180px]" />
                <p className="mt-3 text-center text-sm font-semibold">{p.name}</p>
                <p className="num text-sm text-muted-foreground">₹{p.price.toLocaleString("en-IN")}</p>
              </Link>
            ))}
          </div>
        </ContainerScroll>
      </section>

      {/* Partners */}
      <Section id="partners">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">Title partner</p>
          <SponsorMark s={title} size="lg" className="mt-6" />
          <p className="mt-4 max-w-md text-sm text-muted-foreground">{title.blurb}</p>
        </div>
        <div className="mt-12"><SponsorMarquee /></div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="rounded-full"><Link href="/sponsors">All partners &amp; partnership enquiries</Link></Button>
        </div>
      </Section>

      {/* Association */}
      <Section id="sangh">
        <SectionHeader eyebrow="The Sangh" title="Cricket across Chhattisgarh" />
        <BentoGrid className="mx-0 max-w-none md:auto-rows-[15rem]">
          <BentoGridItem className="md:col-span-2" icon={<Building2 className="size-5" />} title="Shaheed Veer Narayan Singh International Stadium"
            description="Nava Raipur. 65,000 seats. The Sangh's headquarters and the state's international venue."
            header={<p className="num text-6xl font-semibold tracking-tight md:text-7xl">65,000</p>} />
          <BentoGridItem icon={<Shield className="size-5" />} title="BCCI full member" description="Associate from 2008, full member from February 2016."
            header={<p className="num text-6xl font-semibold tracking-tight">2016</p>} />
          <BentoGridItem icon={<Users className="size-5" />} title="District sides" description="Eighteen district associations plus Bhilai Steel Plant."
            header={<p className="num text-6xl font-semibold tracking-tight">{SEASON.districtTeams}</p>} />
          <BentoGridItem icon={<Trophy className="size-5" />} title="State teams" description="Senior men and women, Under-23, Under-19 men and women."
            header={<p className="num text-6xl font-semibold tracking-tight">5</p>} />
          <BentoGridItem icon={<Layers className="size-5" />} title="Tournaments this season" description="BCCI domestic competitions plus the state's own inter-district calendar."
            header={<p className="num text-6xl font-semibold tracking-tight">{TOURNAMENTS.length + SEASON.tournaments}</p>} />
        </BentoGrid>
      </Section>

      <Section>
        <div className="flex flex-col items-center text-center">
          <Badge variant="outline">Academy &amp; trials</Badge>
          <h2 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)] uppercase leading-[0.95]">Your pathway from district to state</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <MovingLink href="/register">Register for trials</MovingLink>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6"><Link href="/academy">About the academy</Link></Button>
          </div>
        </div>
      </Section>
    </>
  );
}
