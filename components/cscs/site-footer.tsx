import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { TextHoverEffect } from "@/components/aceternity/text-hover-effect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Container } from "./section";
import { ADDRESSES, NAV, NAV_SECONDARY, SOCIALS } from "@/lib/data";

const COLUMNS = [
  { title: "Cricket", links: NAV.slice(0, 4) },
  { title: "Media", links: NAV.slice(4, 6) },
  { title: "The Sangh", links: [...NAV.slice(6), ...NAV_SECONDARY] },
  { title: "Follow", links: SOCIALS.map((s) => ({ name: s.label, link: s.href })) },
];

function FooterLink({ name, link }: { name: string; link: string }) {
  const external = link.startsWith("http");
  return (
    <li>
      <Link
        href={link}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {name}
      </Link>
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t pb-28 pt-16 md:pb-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Image src="/brand/cscs-logo.png" alt="Chhattisgarh State Cricket Sangh" width={110} height={41} className="h-10 w-auto" style={{ width: "auto" }} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The governing body for cricket in Chhattisgarh. Full member of the Board of Control for Cricket in India
              since 2016.
            </p>
            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
              {[
                { t: "Registered office", l: ADDRESSES.registered },
                { t: "Communication", l: ADDRESSES.communication },
              ].map((a) => (
                <address key={a.t} className="not-italic">
                  <span className="eyebrow block text-[11px]">{a.t}</span>
                  <span className="mt-1 block leading-relaxed text-muted-foreground">{a.l.join(", ")}</span>
                </address>
              ))}
            </div>
          </div>

          {/* Desktop: open columns. Mobile: collapsible groups. */}
          <div className="hidden gap-8 sm:grid sm:grid-cols-4">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p className="eyebrow text-[11px]">{c.title}</p>
                <ul className="mt-4 space-y-2.5">{c.links.map((l) => <FooterLink key={l.link} {...l} />)}</ul>
              </div>
            ))}
          </div>
          <div className="sm:hidden">
            {COLUMNS.map((c) => (
              <Collapsible key={c.title} className="border-b">
                <CollapsibleTrigger className="group flex w-full items-center justify-between py-4 font-display text-sm font-semibold uppercase tracking-[0.14em]">
                  {c.title}
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="space-y-2.5 pb-4">{c.links.map((l) => <FooterLink key={l.link} {...l} />)}</ul>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>

        <div className="mt-10 hidden h-[16rem] items-center justify-center md:flex">
          <TextHoverEffect text="CSCS" />
        </div>

        <Separator className="my-8 md:mt-0" />
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Chhattisgarh State Cricket Sangh</p>
          <p className="flex items-center gap-2">
            Affiliated to
            <Image src="/brand/bcci-logo.png" alt="BCCI" width={40} height={40} className="h-7 w-auto" style={{ width: "auto" }} />
          </p>
        </div>
      </Container>
    </footer>
  );
}
