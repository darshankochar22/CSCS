import type { Metadata } from "next";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { PageHeader, Section } from "@/components/cscs/section";
import { MatchCard } from "@/components/cscs/match-card";
import { MatchFilter } from "@/components/cscs/match-filter";
import { MATCHES, RESULTS, TOURNAMENTS, teamById, tournamentBySlug } from "@/lib/demo";
import { inningsOf, scoreText } from "@/lib/demo/format";

export const metadata: Metadata = { title: "Matches", description: "Live scores, fixtures and results for every Chhattisgarh team." };

export default function MatchesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Matches" }]}
        eyebrow="Match centre"
        title="Live, fixtures & results"
        blurb="Every Chhattisgarh team across BCCI domestic competitions: senior men and women, Under-23 and Under-19."
      />
      <div className="border-y py-6">
        <InfiniteMovingCards
          speed="slow"
          className="mx-auto max-w-none"
          items={RESULTS.slice(0, 10).map((m) => ({
            quote: `${teamById(m.home).short} ${scoreText(inningsOf(m, m.home))} v ${teamById(m.away).short} ${scoreText(inningsOf(m, m.away))}`,
            name: m.result ?? "",
            title: tournamentBySlug(m.tournament)!.name,
          }))}
        />
      </div>
      <Section bordered={false}>
        <MatchFilter
          tournaments={TOURNAMENTS.map((t) => ({ slug: t.slug, name: t.name }))}
          items={MATCHES.map((m) => ({
            id: m.id, status: m.status, tournament: m.tournament, gender: tournamentBySlug(m.tournament)!.gender,
            card: <MatchCard key={m.id} m={m} />,
          }))}
        />
      </Section>
    </>
  );
}
