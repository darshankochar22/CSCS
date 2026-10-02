import type { Metadata } from "next";
import { Timeline } from "@/components/aceternity/timeline";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Section, SectionHeader } from "@/components/cscs/section";
import { RevealStat } from "@/components/cscs/reveal-stat";
import { TournamentExplorer } from "@/components/cscs/tournament-explorer";
import { SEASON, TOURNAMENTS } from "@/lib/data";

export const metadata: Metadata = { title: "Tournaments", description: "The full CSCS domestic calendar for 2026-27." };

/** Tournaments grouped by the month they started, newest first. */
function byMonth() {
  const groups = new Map<string, typeof TOURNAMENTS>();
  for (const t of TOURNAMENTS) {
    const [, mon, yr] = t.start.split(" ");
    const key = `${mon} ${yr}`;
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  return [...groups.entries()];
}

export default function TournamentsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tournaments" }]}
        eyebrow="Domestic season 2026-27"
        title="Tournaments"
        blurb={`${SEASON.tournaments} competitions and ${SEASON.matches} matches: inter-district championships, challenger trophies and selection matches, from Under-15 to Senior.`}
      >
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          <RevealStat value={SEASON.tournaments} label="Tournaments" />
          <RevealStat value={SEASON.matches} label="Matches" />
          <RevealStat value={SEASON.ageGroups} label="Age groups" />
          <RevealStat value={SEASON.districtTeams} label="District sides" />
        </div>
      </PageHeader>

      <Section>
        <SectionHeader eyebrow="Calendar" title="Every competition" />
        <TournamentExplorer />
      </Section>

      <section className="border-t">
        <Timeline
          title={<span className="font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold uppercase">The season, month by month</span>}
          description="From the Under-19 Plate Group in December to the Under-15 selection matches running now."
          data={byMonth().map(([month, list]) => ({
            title: month,
            content: (
              <div key={month} className="space-y-3">
                {list.map((t) => (
                  <div key={t.slug} className="rounded-2xl border bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{t.gender === "men" ? "Men" : "Women"}</Badge>
                      <Badge variant="outline">{t.matches} matches</Badge>
                      {t.status === "UPCOMING" ? <Badge>On now</Badge> : null}
                    </div>
                    <p className="mt-3 font-semibold">{t.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.start} to {t.end}</p>
                  </div>
                ))}
              </div>
            ),
          }))}
        />
      </section>
    </>
  );
}
