import { ZONES, type Match } from "./data";

const COLS = 22;

function line(left: string, right = "") {
  const gap = Math.max(1, COLS - left.length - right.length);
  return (left + " ".repeat(gap) + right).slice(0, COLS).toUpperCase();
}

/** Rows for the Text Flipping Board (6 x 22, A–Z 0–9 and basic punctuation only). */
export function boardRows(m: Match): string[] {
  const [day, mon] = m.date.split(" ");
  return [
    line(`MATCH ${m.id}`, `${day} ${mon}`),
    "",
    line(ZONES[m.first].name, m.firstScore),
    line(ZONES[m.second].name, m.secondScore),
    "",
    line(`${ZONES[m.winner].short} WON BY ${m.margin}`),
  ];
}
