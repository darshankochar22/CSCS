import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "235/4" -> 235 */
export function runsOf(score: string) { return parseInt(score.split("/")[0], 10); }

/** "235/4" -> 4 */
export function wicketsOf(score: string) {
  const w = score.split("/")[1];
  return w ? parseInt(w, 10) : 0;
}

/** Runs per over from a score and an overs figure like "39.5". */
export function runRate(score: string, overs: string) {
  const [o, b] = overs.split(".");
  const balls = parseInt(o, 10) * 6 + (b ? parseInt(b, 10) : 0);
  if (!balls) return "0.00";
  return ((runsOf(score) / balls) * 6).toFixed(2);
}
