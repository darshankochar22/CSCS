import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/cscs/section";
import { PlayerCard } from "@/components/cscs/player-card";
import { PlayerFilter } from "@/components/cscs/player-filter";
import { PLAYERS, STATE_TEAMS } from "@/lib/demo";

export const metadata: Metadata = { title: "Players", description: "Every player in Chhattisgarh's state squads." };

export default function PlayersPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Players" }]}
        eyebrow="Season 2026-27"
        title="Players"
        blurb={`${PLAYERS.length} players across ${STATE_TEAMS.length} state squads. Open a player for their profile, season stats and recent form.`}
      />
      <Section bordered={false} className="pt-0 sm:pt-0">
        <PlayerFilter
          teams={STATE_TEAMS.map((t) => ({ id: t.id, name: t.name }))}
          items={PLAYERS.map((p) => ({ id: p.id, name: p.name, team: p.teamId, role: p.role, card: <PlayerCard key={p.id} p={p} /> }))}
        />
      </Section>
    </>
  );
}
