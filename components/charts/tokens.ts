/**
 * Chart palette. Two series — runs scored and runs conceded — carried as the
 * validated blue/orange pair from the data-viz reference palette.
 *
 * Verified with scripts/validate_palette.js on the light surface:
 *   lightness band PASS · chroma floor PASS
 *   CVD separation PASS  — worst adjacent ΔE 24.7 (protan), 32.7 (tritan)
 *   normal-vision floor PASS — ΔE 33.6
 *   contrast vs surface PASS — both ≥ 3:1
 * Re-run the validator before changing either hex.
 */
export const SERIES = {
  /** slot 1 — runs scored, and the positive pole of a diverging scale */
  a: { light: "#2a78d6", dark: "#3987e5" },
  /** slot 2 — runs conceded, and the negative pole */
  b: { light: "#eb6834", dark: "#d95926" },
} as const;

/** Neutral for connectors, gridlines and the diverging midpoint. */
export const NEUTRAL = {
  rule: "#dfe7f3",
  connector: "#c3cfe3",
  midpoint: "#9aa8c0",
} as const;

/** Every runs chart shares one ceiling so rows stay comparable. */
export const RUNS_CEILING = 900;
export const RUNS_TICKS = [0, 300, 600, 900];

export const pct = (value: number, ceiling = RUNS_CEILING) =>
  Math.max(0, Math.min(100, (value / ceiling) * 100));
