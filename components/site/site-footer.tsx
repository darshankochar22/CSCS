import Image from "next/image";
import Link from "next/link";
import { ADDRESSES, SOCIALS } from "@/lib/data";

const LINKS = [
  { href: "/matches", label: "Match Centre" },
  { href: "/standings", label: "Standings" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/teams", label: "Teams" },
  { href: "/grounds", label: "Grounds" },
  { href: "/news", label: "News" },
  { href: "/about#tenders", label: "Tenders / RFP" },
  { href: "/about", label: "About" },
];

/** ICC's footer: partner tiers, then a thin legal row. */
export function SiteFooter() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-10">
          <Image src="/brand/bcci-logo.png" alt="BCCI" width={92} height={92} className="h-16 w-auto object-contain" />
          <Image src="/brand/ccpl-logo.png" alt="CCPL" width={92} height={92} className="h-16 w-auto object-contain" />
        </div>
        <p className="mt-3 text-center font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Affiliations
        </p>

        <nav className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3 border-t pt-8">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-display text-[11.5px] font-bold uppercase tracking-[0.15em] text-navy-800 transition-colors hover:text-royal"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex justify-center gap-3">
          {SOCIALS.filter((s) => s.label !== "CCPL T20").map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-full bg-navy-800 font-display text-[11px] font-bold uppercase text-white transition-opacity hover:opacity-85"
            >
              {s.label.slice(0, 2)}
            </a>
          ))}
        </div>

        <div className="mt-9 grid gap-6 border-t pt-8 text-center sm:grid-cols-2 sm:text-left">
          {[
            { t: "Registered address", l: ADDRESSES.registered },
            { t: "Communication address", l: ADDRESSES.communication },
          ].map((a) => (
            <div key={a.t}>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-navy-800">{a.t}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {a.l.map((x) => (
                  <span key={x} className="block">{x}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-navy-800 py-5 text-center">
        <Image
          src="/brand/cscs-logo.png"
          alt="CSCS"
          width={80}
          height={30}
          className="mx-auto h-8 w-auto brightness-0 invert"
        />
        <p className="mt-2.5 text-[12px] text-white/55">
          Copyright 2026 Chhattisgarh State Cricket Sangh. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
