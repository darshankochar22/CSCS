import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PinContainer } from "@/components/aceternity/3d-pin";
import { PageHeader, Section } from "@/components/cscs/section";
import { GROUNDS } from "@/lib/data";

export const metadata: Metadata = { title: "Grounds", description: "Venues used by the CSCS across Chhattisgarh." };

const mapsUrl = (name: string, city: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${city}, Chhattisgarh`)}`;

export default function GroundsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Grounds" }]}
        eyebrow="Venues"
        title="Grounds"
        blurb="Ten grounds in the state are cleared for first-class cricket. These carried the 2026-27 season. Hover a ground for its pin, click to open it in Maps."
      />
      <Section>
        <div className="grid justify-items-center gap-x-8 gap-y-4 md:grid-cols-2">
          {GROUNDS.map((g) => (
            <div key={g.name} className="flex h-[26rem] w-full items-center justify-center">
              <PinContainer title={`Open ${g.city} in Maps`} href={mapsUrl(g.name, g.city)}>
                <div className="flex w-[19rem] flex-col p-2 sm:w-[22rem]">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    <MapPin className="size-3.5" /> {g.city}
                  </p>
                  <h2 className="mt-3 text-3xl uppercase leading-tight text-neutral-900">{g.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{g.note}</p>
                  <p className="num mt-auto pt-5 text-sm font-medium text-neutral-900">{g.stat}</p>
                </div>
              </PinContainer>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
