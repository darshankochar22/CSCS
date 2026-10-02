import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { BackgroundRippleEffect } from "@/components/aceternity/background-ripple-effect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Section } from "@/components/cscs/section";
import { ContactForm } from "@/components/cscs/contact-form";
import { ADDRESSES, SOCIALS } from "@/lib/data";

export const metadata: Metadata = { title: "Contact", description: "Contact the Chhattisgarh State Cricket Sangh." };

export default function ContactPage() {
  return (
    <>
      <header className="relative flex min-h-[26rem] items-end overflow-hidden border-b">
        <BackgroundRippleEffect rows={10} cols={30} cellSize={56} />
        <Container className="pointer-events-none relative z-10 pb-14">
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-3 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.95]">Contact the Sangh</h1>
          <p className="mt-4 max-w-[52ch] text-muted-foreground">Questions about tournaments, trials, tenders or media. Click the grid for a ripple.</p>
        </Container>
      </header>

      <Section bordered={false}>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <div className="flex flex-col gap-4">
            {[
              { t: "Registered office", l: ADDRESSES.registered },
              { t: "Communication address", l: ADDRESSES.communication },
            ].map((a) => (
              <Card key={a.t}>
                <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="size-4" /> {a.t}</CardTitle></CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {a.l.map((line) => <p key={line}>{line}</p>)}
                </CardContent>
              </Card>
            ))}
            <Card>
              <CardHeader><CardTitle>Follow</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {SOCIALS.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-accent"
                  >
                    {s.label} <ArrowUpRight className="size-3.5" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
