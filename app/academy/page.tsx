import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Medal, Users } from "lucide-react";
import { WobbleCard } from "@/components/aceternity/wobble-card";
import { CardSpotlight } from "@/components/aceternity/card-spotlight";
import { HoverBorderGradient } from "@/components/aceternity/hover-border-gradient";
import { Button } from "@/components/ui/button";
import { PageHeader, Section, SectionHeader } from "@/components/cscs/section";
import { MovingLink } from "@/components/cscs/moving-link";
import { STAFF, TOURNAMENTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Academy",
  description: "The CSCS cricket academy, affiliated to the National Cricket Academy, and the age-group pathway.",
};

const WOMEN = TOURNAMENTS.filter((t) => t.gender === "women").length;
const YOUTH = TOURNAMENTS.filter((t) => t.group !== "SENIOR").length;

export default function AcademyPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Academy" }]}
        eyebrow="Academy & coaching"
        title="Built for the next state cap"
        blurb="The Sangh's cricket academy is affiliated to the National Cricket Academy, which provides regular coaching guidance and development programmes."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <MovingLink href="/register">Register for trials</MovingLink>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6">
            <Link href="/about#pathway">See the pathway</Link>
          </Button>
        </div>
      </PageHeader>

      <Section>
        <SectionHeader eyebrow="Programmes" title="What the academy covers" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <WobbleCard containerClassName="col-span-1 min-h-[300px] lg:col-span-2">
            <GraduationCap className="size-7" />
            <h3 className="mt-6 max-w-sm text-4xl uppercase leading-none text-neutral-900">NCA-affiliated coaching</h3>
            <p className="mt-4 max-w-md text-neutral-600">
              Coaching guidance and development programmes from the National Cricket Academy, delivered through the
              Sangh&apos;s own academy.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px]">
            <Users className="size-7" />
            <h3 className="mt-6 text-4xl uppercase leading-none text-neutral-900">{YOUTH} youth tournaments</h3>
            <p className="mt-4 text-neutral-600">Under-15, Under-16, Under-19 and Under-23 competitions in 2026-27.</p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px] lg:col-span-3">
            <Medal className="size-7" />
            <h3 className="mt-6 max-w-xl text-4xl uppercase leading-none text-neutral-900">{WOMEN} women&apos;s competitions this season</h3>
            <p className="mt-4 max-w-xl text-neutral-600">
              Senior, Under-23, Under-19 and Under-15 challenger trophies and selection matches, played in both one-day
              and T20 formats.
            </p>
          </WobbleCard>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="State team" title="Coaching & support staff" blurb="The specialists working with the senior men's squad in 2026-27." />
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
      </Section>

      <Section>
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-[18ch] text-[clamp(2.25rem,5vw,4rem)] uppercase leading-[0.95]">Ready for the next trial?</h2>
          <p className="mt-4 max-w-[48ch] text-muted-foreground">Register your interest and the Sangh will contact you when district trials open.</p>
          <HoverBorderGradient as="div" containerClassName="mt-8 rounded-full" className="bg-white px-0 py-0 text-neutral-900">
            <Link href="/register" className="block px-6 py-2.5 font-semibold">Start registration</Link>
          </HoverBorderGradient>
        </div>
      </Section>
    </>
  );
}
