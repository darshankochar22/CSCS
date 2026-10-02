import type { Metadata } from "next";
import { LampContainer } from "@/components/aceternity/lamp";
import { Timeline } from "@/components/aceternity/timeline";
import { StickyScroll } from "@/components/aceternity/sticky-scroll-reveal";
import { CardSpotlight } from "@/components/aceternity/card-spotlight";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/cscs/section";
import { ADDRESSES, OFFICIALS, SEASON } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "The Chhattisgarh State Cricket Sangh: history, structure, office bearers and contact.",
};

const HISTORY = [
  { title: "2000", body: "The Chhattisgarh State Cricket Sangh is founded as the state's cricket body." },
  { title: "2008", body: "CSCS becomes an associate member of the Board of Control for Cricket in India." },
  { title: "2016", body: "Admitted as a full BCCI member in February. On 6 October Chhattisgarh play their first first-class match and beat Tripura by nine wickets." },
  { title: "Today", body: `The Sangh runs ${SEASON.tournaments} tournaments and ${SEASON.matches} matches a season from its headquarters at the Shaheed Veer Narayan Singh International Cricket Stadium, Nava Raipur.` },
];

const PATHWAY = [
  { title: "Clubs & schools", description: "Every pathway starts in local cricket, where district associations scout for their age-group squads." },
  { title: "District", description: "Eighteen district associations plus Bhilai Steel Plant as an invitational side contest the inter-district tournaments at every age group." },
  { title: "Zone", description: "The best district players move up to the five zone sides (North, South, East, West and Central) for the challenger trophies and selection matches." },
  { title: "State", description: "Selectors pick the Chhattisgarh squads that represent the state in BCCI competitions: Ranji Trophy, Vijay Hazare and Syed Mushtaq Ali." },
];

const FAQ = [
  { q: "How is the Sangh structured?", a: "Eighteen district associations plus Bhilai Steel Plant as an invitational team contest the inter-district tournament at every age group: nineteen sides in all." },
  { q: "Does the Sangh run an academy?", a: "Yes. The Sangh's cricket academy is affiliated to the National Cricket Academy, which provides regular coaching guidance and development programmes." },
  { q: "Which BCCI region is Chhattisgarh in?", a: "CSCS was a BCCI associate from 2008 and became a full member in February 2016. It sits in the BCCI's Central region." },
  { q: "Where do I send tenders and RFPs?", a: "Procurement notices, ground maintenance contracts and broadcast RFPs are published through the season. Submissions go to the registered office address." },
];

export default function AboutPage() {
  return (
    <>
      <LampContainer className="min-h-[38rem] rounded-none pt-56">
        <p className="eyebrow">About the Sangh</p>
        <h1 className="mt-4 max-w-[16ch] text-center text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.95] text-neutral-900">
          Chhattisgarh State Cricket Sangh
        </h1>
      </LampContainer>

      <Container className="-mt-16 pb-6">
        <TextGenerateEffect
          className="mx-auto max-w-3xl text-center [&_div]:text-xl [&_div]:font-medium [&_div]:leading-relaxed md:[&_div]:text-2xl"
          words="Founded in 2000, CSCS governs cricket across Chhattisgarh, from Under-15 district sides to the state teams that play in the Ranji Trophy."
        />
      </Container>

      <section className="border-t">
        <Timeline
          title={<span className="font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold uppercase">History</span>}
          description="Associate in 2008, full member in 2016."
          data={HISTORY.map((h) => ({
            title: h.title,
            content: <p key={h.title} className="max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg">{h.body}</p>,
          }))}
        />
      </section>

      <Section id="pathway">
        <SectionHeader eyebrow="Pathway" title="From club to state" blurb="How a cricketer moves up through the Sangh's competitions." />
        <div className="rounded-3xl border">
          <StickyScroll
            contentClassName="border rounded-2xl"
            content={PATHWAY.map((p, i) => ({
              ...p,
              content: (
                <div key={p.title} className="flex h-full w-full flex-col justify-between p-6">
                  <span className="num text-sm text-neutral-500">0{i + 1} / 0{PATHWAY.length}</span>
                  <span className="font-display text-5xl font-bold uppercase leading-none">{p.title}</span>
                </div>
              ),
            }))}
          />
        </div>
      </Section>

      <Section id="leadership">
        <SectionHeader eyebrow="Office bearers" title="Leadership" />
        <div className="grid gap-4 sm:grid-cols-3">
          {OFFICIALS.map((o) => (
            <CardSpotlight key={o.role} radius={240} color="#f4f4f4" className="rounded-2xl border-neutral-200 bg-white p-7">
              <div className="relative z-20">
                <p className="eyebrow text-[11px]">{o.role}</p>
                <p className="mt-3 text-2xl font-semibold text-neutral-900">{o.name}</p>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </Section>

      <Section id="faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeader eyebrow="Questions" title="How the Sangh works" className="mb-0 items-start" />
          <Accordion type="single" collapsible defaultValue="item-0" className="rounded-2xl border px-5">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-base font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section id="tenders">
        <div className="grid gap-4 md:grid-cols-3">
          <Card id="csr">
            <CardHeader>
              <CardTitle>CSR</CardTitle>
              <CardDescription>Corporate social responsibility</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              Grassroots coaching, school outreach and district infrastructure work carried out under the Sangh&apos;s CSR
              programme.
            </CardContent>
          </Card>
          {[
            { t: "Registered office", l: ADDRESSES.registered },
            { t: "Communication address", l: ADDRESSES.communication },
          ].map((a) => (
            <Card key={a.t}>
              <CardHeader>
                <CardTitle>{a.t}</CardTitle>
                <CardDescription>Chhattisgarh State Cricket Sangh</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {a.l.map((line) => <p key={line}>{line}</p>)}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
