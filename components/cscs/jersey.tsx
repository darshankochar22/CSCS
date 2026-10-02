import { cn } from "@/lib/utils";

export type JerseyVariant = "home" | "away" | "training" | "retro" | "women" | "fan";

const BODY =
  "M92 22 L58 32 L10 84 L42 130 L72 110 L72 322 Q150 334 228 322 L228 110 L258 130 L290 84 L242 32 L208 22";

/**
 * Monochrome kit illustration. `side="back"` prints name and number, which is
 * also how player portraits are drawn until real photos exist.
 */
export function Jersey({
  variant = "home", side = "front", name, number, sponsor = "MAHANADI POWER", className,
}: {
  variant?: JerseyVariant; side?: "front" | "back"; name?: string; number?: number | string; sponsor?: string; className?: string;
}) {
  const dark = variant === "away";
  const fill = dark ? "#0a0a0a" : "#ffffff";
  const ink = dark ? "#ffffff" : "#0a0a0a";
  const trim = variant === "training" ? "#d4d4d4" : ink;
  const collar = side === "front" ? (variant === "women" ? "Q150 78 92 22" : variant === "fan" ? "Q150 50 92 22" : "Q150 64 92 22") : "Q150 40 92 22";
  const id = `j-${variant}-${side}`;

  return (
    <svg viewBox="0 0 300 340" className={cn("h-auto w-full", className)} role="img" aria-label={`${variant} jersey ${side}`}>
      <defs>
        <clipPath id={id}><path d={`${BODY} ${collar} Z`} /></clipPath>
        <pattern id={`${id}-weave`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill={fill} />
          <rect width="2" height="14" fill={ink} opacity="0.06" />
        </pattern>
      </defs>
      <path d={`${BODY} ${collar} Z`} fill={`url(#${id}-weave)`} stroke="#d4d4d4" strokeWidth="2" strokeLinejoin="round" />
      <g clipPath={`url(#${id})`}>
        {/* pattern bands */}
        {variant === "home" || variant === "women" ? (
          <path d="M0 150 L150 210 L300 150 L300 172 L150 232 L0 172 Z" fill={trim} opacity="0.9" />
        ) : null}
        {variant === "away" ? <path d="M0 210 L150 150 L300 210 L300 232 L150 172 L0 232 Z" fill={trim} opacity="0.9" /> : null}
        {variant === "retro" ? <path d="M40 20 L90 20 L270 340 L220 340 Z" fill={trim} /> : null}
        {variant === "training" ? (
          <>
            <rect x="0" y="0" width="74" height="340" fill={trim} opacity="0.5" />
            <rect x="226" y="0" width="74" height="340" fill={trim} opacity="0.5" />
          </>
        ) : null}
        {/* sleeve cuffs */}
        <path d="M10 84 L42 130 L50 124 L18 78 Z" fill={trim} />
        <path d="M290 84 L258 130 L250 124 L282 78 Z" fill={trim} />
      </g>
      {/* collar */}
      <path d={`M92 22 ${collar.replace("92 22", "208 22")}`} fill="none" stroke={trim} strokeWidth="6" />

      {side === "front" ? (
        <>
          <circle cx="190" cy="92" r="13" fill="none" stroke={ink} strokeWidth="2.5" />
          <text x="190" y="96" textAnchor="middle" fontSize="9" fontWeight="700" fill={ink} fontFamily="var(--font-headline), sans-serif">CG</text>
          {variant !== "fan" ? (
            <text x="150" y="132" textAnchor="middle" fontSize="16" fontWeight="700" letterSpacing="2" fill={ink} fontFamily="var(--font-headline), sans-serif">
              {sponsor}
            </text>
          ) : null}
          <text x="150" y={variant === "fan" ? 190 : 280} textAnchor="middle" fontSize={variant === "fan" ? 30 : 15} fontWeight="700" letterSpacing="3"
            fill={ink} fontFamily="var(--font-headline), sans-serif">
            CHHATTISGARH
          </text>
        </>
      ) : (
        <>
          <text x="150" y="98" textAnchor="middle" fontSize="24" fontWeight="700" letterSpacing="3" fill={ink} fontFamily="var(--font-headline), sans-serif">
            {(name ?? "YOUR NAME").toUpperCase().slice(0, 12)}
          </text>
          <text x="150" y="250" textAnchor="middle" fontSize="128" fontWeight="700" fill={ink} fontFamily="var(--font-headline), sans-serif">
            {number ?? 18}
          </text>
        </>
      )}
    </svg>
  );
}

/** Cap and hoodie line drawings for the store. */
export function MerchArt({ kind, className }: { kind: "cap" | "hoodie" | "tee"; className?: string }) {
  if (kind === "cap") {
    return (
      <svg viewBox="0 0 300 340" className={cn("h-auto w-full", className)} role="img" aria-label="Team cap">
        <path d="M60 210 Q60 110 150 105 Q240 110 240 210 Z" fill="#fff" stroke="#0a0a0a" strokeWidth="3" />
        <path d="M60 210 Q150 190 280 222 Q250 245 150 236 Q90 232 60 210 Z" fill="#0a0a0a" />
        <path d="M150 105 L150 205" stroke="#d4d4d4" strokeWidth="2" />
        <circle cx="150" cy="104" r="6" fill="#0a0a0a" />
        <text x="118" y="170" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0a0a0a" fontFamily="var(--font-headline), sans-serif">CG</text>
      </svg>
    );
  }
  if (kind === "hoodie") {
    return (
      <svg viewBox="0 0 300 340" className={cn("h-auto w-full", className)} role="img" aria-label="Hoodie">
        <path d="M100 40 Q150 0 200 40 L250 60 L292 200 L258 214 L232 140 L232 320 L68 320 L68 140 L42 214 L8 200 L50 60 Z" fill="#0a0a0a" />
        <path d="M110 40 Q150 110 190 40" fill="none" stroke="#fff" strokeWidth="3" />
        <rect x="102" y="220" width="96" height="50" rx="10" fill="none" stroke="#404040" strokeWidth="2" />
        <text x="150" y="180" textAnchor="middle" fontSize="20" fontWeight="700" letterSpacing="3" fill="#fff" fontFamily="var(--font-headline), sans-serif">CSCS</text>
      </svg>
    );
  }
  return <Jersey variant="fan" />;
}
