import type { Metadata } from "next";
import { CardBody, CardContainer, CardItem } from "@/components/aceternity/3d-card";
import { GlareCard } from "@/components/aceternity/glare-card";
import { HoverEffect } from "@/components/aceternity/card-hover-effect";
import { CardSpotlight } from "@/components/aceternity/card-spotlight";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Section, SectionHeader } from "@/components/cscs/section";
import { ExpandableCards } from "@/components/cscs/expandable-cards";
import { LADDER, MATCHES, SQUAD, STAFF, ZONES, type ZoneKey } from "@/lib/data";

export const metadata: Metadata = { title: "Teams", description: "The Chhattisgarh senior squad, support staff and zone sides." };

const FACTS = [
  { k: "Full member", v: "2016", s: "February" },
  { k: "First-class debut", v: "2016", s: "6 October, beat Tripura" },
  { k: "Senior squad", v: String(SQUAD.length), s: "Players" },
  { k: "First-class grounds", v: "10", s: "In the state" },
];

const CAPTAIN = SQUAD[0];
const IPL = SQUAD.filter((p) => p.note && /Capitals|Kings/.test(p.note));
const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

function zoneCards() {
  return (Object.keys(ZONES) as ZoneKey[]).map((z) => {
    const row = LADDER.find((r) => r.team === z)!;
    const games = MATCHES.filter((m) => m.first === z || m.second === z);
    return {
      title: ZONES[z].name,
      description: `${row.won} won, ${row.lost} lost · ${row.points} points`,
      src: ZONES[z].badge,
      ctaText: "Standings",
      ctaLink: "/standings",
      content: (
        <ul key={z} className="divide-y rounded-xl border">
          {games.map((m) => {
            const opp = m.first === z ? m.second : m.first;
            const won = m.winner === z;
            return (
              <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span>
                  <span className="font-medium text-neutral-900">v {ZONES[opp].name}</span>
                  <span className="block text-xs">Match {m.id} · {m.date}</span>
                </span>
                <Badge variant={won ? "default" : "outline"}>{won ? "Won" : "Lost"} by {m.margin}</Badge>
              </li>
            );
          })}
        </ul>
      ),
    };
  });
}

export default function TeamsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Teams" }]}
        eyebrow="Ranji Trophy · Vijay Hazare · Syed Mushtaq Ali"
        title="Chhattisgarh squad"
        blurb="Full BCCI member since February 2016. First-class debut on 6 October 2016 against Tripura, won by nine wickets."
      >
        <dl className="mt-10 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.k} className="border-b border-r p-5 last:border-r-0 sm:border-b-0">
              <dd className="num text-3xl font-semibold">{f.v}</dd>
              <dt className="eyebrow mt-1 text-[11px]">{f.k}</dt>
              <dd className="mt-0.5 text-xs text-muted-foreground">{f.s}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <Section id="featured">
        <SectionHeader eyebrow="Senior men" title="Leading the side" />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_auto]">
          {/* Captain: 3D Card Effect */}
          <CardContainer containerClassName="py-0 justify-start" className="w-full">
            <CardBody className="relative h-auto w-full max-w-md rounded-3xl border bg-white p-8">
              <CardItem translateZ={40} className="eyebrow">Captain</CardItem>
              <CardItem translateZ={80} className="mt-8 grid size-28 place-items-center rounded-full border font-display text-5xl font-bold">
                {initials(CAPTAIN.name)}
              </CardItem>
              <CardItem translateZ={60} as="h3" className="mt-8 text-4xl uppercase">{CAPTAIN.name}</CardItem>
              <CardItem translateZ={30} as="p" className="mt-2 text-muted-foreground">{CAPTAIN.role}</CardItem>
            </CardBody>
          </CardContainer>

          {/* IPL contracted players: Glare Card */}
          {IPL.map((p) => (
            <GlareCard key={p.name} className="flex flex-col justify-end p-6">
              <p className="eyebrow text-[11px]">{p.note?.split(" · ").pop()}</p>
              <p className="mt-2 font-display text-3xl font-bold uppercase leading-none text-neutral-900">{p.name}</p>
              <p className="mt-2 text-sm text-neutral-500">{p.role}{p.note?.includes("Vice") ? " · Vice-captain" : ""}</p>
            </GlareCard>
          ))}
        </div>
      </Section>

      <Section id="squad">
        <Tabs defaultValue="squad">
          <SectionHeader
            eyebrow="2026-27"
            title="Squad & staff"
            blurb="Captained by Amandeep Khare, coached by Hitesh Goswami."
            aside={
              <TabsList>
                <TabsTrigger value="squad">Players ({SQUAD.length})</TabsTrigger>
                <TabsTrigger value="staff">Support staff</TabsTrigger>
              </TabsList>
            }
          />
          <TabsContent value="squad">
            <HoverEffect
              className="py-0"
              items={SQUAD.map((p) => ({ title: p.name, description: p.note ? `${p.role} · ${p.note}` : p.role, link: "#squad" }))}
            />
          </TabsContent>
          <TabsContent value="staff">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STAFF.map((s) => (
                <CardSpotlight key={s.name} radius={220} color="#f4f4f4" className="rounded-2xl border-neutral-200 bg-white p-6">
                  <div className="relative z-20">
                    <p className="eyebrow text-[11px]">{s.role}</p>
                    <p className="mt-3 text-xl font-semibold text-neutral-900">{s.name}</p>
                  </div>
                </CardSpotlight>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="zones">
        <SectionHeader
          eyebrow="Challenger Trophy"
          title="The five zones"
          blurb="The state's inter-zone sides. Open a zone to see every result from the Women's Senior & U23 One Day Challenger Trophy."
        />
        <div className="rounded-3xl border p-2">
          <ExpandableCards cards={zoneCards()} />
        </div>
      </Section>
    </>
  );
}
