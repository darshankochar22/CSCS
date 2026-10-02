import { cn } from "@/lib/utils";
import { SPONSORS, type Sponsor } from "@/lib/demo";

/** Typographic stand-in for a partner logo. */
export function SponsorMark({ s, size = "md", className }: { s: Sponsor; size?: "sm" | "md" | "lg"; className?: string }) {
  const [first, ...rest] = s.name.split(" ");
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span className={cn("font-display font-bold uppercase tracking-[0.06em]", size === "lg" ? "text-5xl md:text-6xl" : size === "md" ? "text-2xl" : "text-lg")}>
        {first}
      </span>
      {rest.length ? (
        <span className={cn("mt-1 font-medium uppercase tracking-[0.3em] text-muted-foreground", size === "lg" ? "text-sm" : "text-[10px]")}>{rest.join(" ")}</span>
      ) : null}
    </span>
  );
}

/** Endless partner strip (uses the Infinite Moving Cards keyframes). */
export function SponsorMarquee() {
  const list = SPONSORS.filter((s) => s.tier !== "Title partner");
  return (
    <div className="scroller relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]"
      style={{ ["--animation-duration" as string]: "45s", ["--animation-direction" as string]: "forwards" }}>
      <ul className="flex w-max animate-scroll gap-4 py-2 hover:[animation-play-state:paused]">
        {[...list, ...list].map((s, i) => (
          <li key={`${s.name}-${i}`} className="grid h-24 w-56 shrink-0 place-items-center rounded-2xl border bg-white">
            <SponsorMark s={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}
