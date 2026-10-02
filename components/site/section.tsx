import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({ id, children, className, tone = "light" }: {
  id?: string; children: ReactNode; className?: string; tone?: "light" | "tint" | "navy";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 sm:py-20",
        tone === "tint" && "bg-secondary",
        tone === "navy" && "bg-navy-800 text-white pattern-weave",
        className,
      )}
    >
      <div className="relative mx-auto w-full max-w-[1320px] px-5 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, blurb, aside, tone = "light" }: {
  eyebrow: string; title: string; blurb?: string; aside?: ReactNode; tone?: "light" | "navy";
}) {
  return (
    <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
      <div className="min-w-0">
        <p className={cn("eyebrow", tone === "navy" ? "text-gold" : "text-royal")}>{eyebrow}</p>
        <h2 className="mt-2 text-[clamp(2rem,4.6vw,3.25rem)] uppercase">{title}</h2>
        {blurb ? (
          <p className={cn("mt-3 max-w-[64ch] text-[15px] leading-relaxed",
            tone === "navy" ? "text-sky/75" : "text-muted-foreground")}>
            {blurb}
          </p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}

/** Small square team mark. */
export function ZoneChip({ short, hex, ink, size = 28 }: { short: string; hex: string; ink: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-md font-display font-bold"
      style={{ width: size, height: size, background: hex, color: ink, fontSize: size * 0.4 }}
    >
      {short}
    </span>
  );
}

/** ICC-style page banner: navy band, eyebrow, big uppercase title. */
export function PageHeader({ eyebrow, title, blurb, children }: {
  eyebrow: string; title: string; blurb?: string; children?: ReactNode;
}) {
  return (
    <section className="bg-navy-800 text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16">
        <p className="font-display text-[12.5px] font-bold uppercase tracking-[0.18em] text-white/65">{eyebrow}</p>
        <h1 className="mt-2.5 max-w-[20ch] text-[clamp(2rem,5.5vw,3.75rem)] uppercase leading-[0.98]">{title}</h1>
        {blurb ? <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-white/70">{blurb}</p> : null}
        {children}
      </div>
    </section>
  );
}
