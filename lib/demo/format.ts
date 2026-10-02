import { VENUES, teamById, tournamentBySlug, type Match } from "./index";
import { oversText, type Innings } from "./sim";

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(`${iso}${iso.length === 16 ? ":00+05:30" : ""}`).toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });

export const fmtTime = (iso: string) =>
  new Date(`${iso}:00+05:30`).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

export const scoreText = (i?: Innings) => (i ? `${i.runs}${i.wickets < 10 ? `/${i.wickets}` : ""}` : "");
export const oversOf = (i?: Innings) => (i ? oversText(i.legalBalls) : "");

export function matchTitle(m: Match) {
  return `${teamById(m.home).name} v ${teamById(m.away).name}`;
}

export function matchMeta(m: Match) {
  const t = tournamentBySlug(m.tournament)!;
  const v = VENUES[m.venue];
  return { t, venue: v, label: `${t.short} · Match ${m.matchNo}` };
}

/** Situation line for a live match: "Need 50 from 33 balls". */
export function liveLine(m: Match) {
  const inn = m.innings[1];
  if (!inn || !m.target) return "";
  const total = (m.format === "T20" ? 20 : 50) * 6;
  const need = m.target - inn.runs;
  const left = total - inn.legalBalls;
  return `${teamById(inn.battingTeam).short} need ${need} from ${left} balls`;
}

export function inningsOf(m: Match, teamId: string) {
  return m.innings.find((i) => i.battingTeam === teamId);
}
