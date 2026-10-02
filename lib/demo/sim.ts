/**
 * Ball-by-ball cricket simulator. Every scorecard, chart and commentary line
 * on the demo site comes out of here, so totals always agree with each other.
 */
import { int, pick, type Rng } from "./rng";

export type Format = "T20" | "ODI";

export type SimPlayer = {
  id: string;
  name: string;
  bat: number; // batting skill 0..1
  bowl: number; // bowling skill 0..1
  wk?: boolean;
};

export type BatLine = {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dismissal: string | null; // null = not out
  didBat: boolean;
};

export type BowlLine = { playerId: string; balls: number; maidens: number; runs: number; wickets: number; dots: number; wides: number; noballs: number };

export type BallEvent = {
  over: number; // 0-based over index
  ball: number; // legal ball number in the over, 1..6
  bowlerId: string;
  batterId: string;
  runs: number; // off the bat
  extra: "wd" | "nb" | null;
  wicket: boolean;
  text: string;
  score: string; // running total, e.g. "87/3"
};

export type OverLine = { over: number; runs: number; wickets: number; total: number };

export type Innings = {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  legalBalls: number;
  extras: { wides: number; noballs: number; byes: number; legbyes: number };
  batting: BatLine[];
  bowling: BowlLine[];
  fow: { wicket: number; runs: number; over: string; playerId: string }[];
  overs: OverLine[];
  partnerships: { wicket: number; a: string; b: string; runs: number; balls: number }[];
  events: BallEvent[];
  boundaries: { fours: number; sixes: number };
  dots: number;
  complete: boolean;
};

export const oversText = (legal: number) => `${Math.floor(legal / 6)}.${legal % 6}`;

const RUN_DIST: Record<Format, number[][]> = {
  // [runs, weight] for a legal ball that is not a wicket
  T20: [[0, 40], [1, 35], [2, 7], [3, 1], [4, 11], [6, 6]],
  ODI: [[0, 52], [1, 30], [2, 6], [3, 1], [4, 9], [6, 2]],
};

function weighted(r: Rng, dist: number[][]) {
  const total = dist.reduce((s, d) => s + d[1], 0);
  let x = r() * total;
  for (const [v, w] of dist) {
    x -= w;
    if (x <= 0) return v;
  }
  return 0;
}

const SHOTS = {
  0: ["defended back to the bowler", "beaten outside off", "straight to cover", "left alone", "dot ball, good length"],
  1: ["pushed to long-on for one", "worked off the pads for a single", "dabbed to third man", "tucked to square leg"],
  2: ["driven into the gap for two", "pulled, they come back for the second", "flicked fine, two runs"],
  3: ["placed into the deep, they run three", "chased down just inside the rope, three"],
  4: ["FOUR, driven through extra cover", "FOUR, pulled hard to the boundary", "FOUR, cut past point", "FOUR, flicked off the pads"],
  6: ["SIX, launched over long-on", "SIX, slog-swept into the stands", "SIX, straight down the ground"],
} as Record<number, string[]>;

type SimOpts = {
  r: Rng;
  format: Format;
  battingTeam: string;
  bowlingTeam: string;
  batters: SimPlayer[]; // batting order, 11
  bowlers: SimPlayer[]; // fielding XI
  target?: number;
  maxLegalBalls?: number; // stop early (live match)
};

export function simulateInnings(o: SimOpts): Innings {
  const { r, format } = o;
  const oversLimit = format === "T20" ? 20 : 50;
  const quota = format === "T20" ? 4 : 10;
  const byId = new Map([...o.batters, ...o.bowlers].map((p) => [p.id, p]));
  const name = (id: string) => byId.get(id)!.name;

  const batting: BatLine[] = o.batters.map((p) => ({ playerId: p.id, runs: 0, balls: 0, fours: 0, sixes: 0, dismissal: null, didBat: false }));
  const keeper = o.bowlers.find((p) => p.wk) ?? o.bowlers[0];
  const attack = [...o.bowlers].filter((p) => p !== keeper).sort((a, b) => b.bowl - a.bowl).slice(0, 6);
  const bowling = new Map<string, BowlLine>();
  const bl = (id: string) => {
    if (!bowling.has(id)) bowling.set(id, { playerId: id, balls: 0, maidens: 0, runs: 0, wickets: 0, dots: 0, wides: 0, noballs: 0 });
    return bowling.get(id)!;
  };

  const inn: Innings = {
    battingTeam: o.battingTeam, bowlingTeam: o.bowlingTeam, runs: 0, wickets: 0, legalBalls: 0,
    extras: { wides: 0, noballs: 0, byes: 0, legbyes: 0 }, batting, bowling: [], fow: [], overs: [], partnerships: [],
    events: [], boundaries: { fours: 0, sixes: 0 }, dots: 0, complete: false,
  };

  let striker = 0, nonStriker = 1, next = 2;
  batting[0].didBat = batting[1].didBat = true;
  let pship = { runs: 0, balls: 0 };
  let lastBowler = "";
  const maxBalls = Math.min(o.maxLegalBalls ?? Infinity, oversLimit * 6);

  outer: for (let ov = 0; ov < oversLimit; ov++) {
    // choose bowler: has quota, didn't bowl last over, weighted to the better ones
    const avail = attack.filter((b) => b.id !== lastBowler && bl(b.id).balls < quota * 6);
    const bowler = avail.length ? avail.sort((a, b) => b.bowl + r() * 0.5 - (a.bowl + r() * 0.5))[0] : attack[0];
    lastBowler = bowler.id;
    const line = bl(bowler.id);
    let overRuns = 0, overWkts = 0, legal = 0, concededThisOver = 0;
    const phase = format === "T20" ? (ov < 6 ? 1.05 : ov >= 16 ? 1.3 : 0.95) : (ov < 10 ? 1.0 : ov >= 40 ? 1.35 : 0.9);

    while (legal < 6) {
      if (inn.legalBalls >= maxBalls) break outer;
      const bat = o.batters[striker];
      const sl = batting[striker];
      // extras
      const ex = r();
      if (ex < 0.03 || ex > 0.995) {
        const kind = ex < 0.03 ? "wd" : "nb";
        inn.runs += 1; overRuns += 1; concededThisOver += 1; line.runs += 1;
        if (kind === "wd") { inn.extras.wides++; line.wides++; } else { inn.extras.noballs++; line.noballs++; }
        inn.events.push({ over: ov, ball: legal + 1, bowlerId: bowler.id, batterId: bat.id, runs: 0, extra: kind, wicket: false,
          text: `${name(bowler.id)} to ${name(bat.id)}, ${kind === "wd" ? "wide down the leg side" : "no-ball, overstepped"}`, score: `${inn.runs}/${inn.wickets}` });
        if (o.target && inn.runs >= o.target) break outer;
        continue;
      }

      legal++; inn.legalBalls++; line.balls++; sl.balls++; pship.balls++;
      const pWicket = (format === "T20" ? 0.05 : 0.032) * (1 + bowler.bowl * 0.9 - bat.bat * 0.9) * (phase > 1.2 ? 1.25 : 1);
      if (r() < Math.max(0.012, pWicket)) {
        // wicket
        const kind = weighted(r, [[0, 58], [1, 16], [2, 12], [3, 8], [4, keeper ? 6 : 0]]);
        const fielder = pick(r, o.bowlers.filter((p) => p.id !== bowler.id)).id;
        const dismissal = [
          `c ${name(fielder)} b ${name(bowler.id)}`,
          `b ${name(bowler.id)}`,
          `lbw b ${name(bowler.id)}`,
          `run out (${name(fielder)})`,
          `st ${name(keeper.id)} b ${name(bowler.id)}`,
        ][kind];
        if (kind !== 3) line.wickets++;
        line.dots++; inn.dots++;
        sl.dismissal = dismissal;
        inn.wickets++; overWkts++;
        inn.fow.push({ wicket: inn.wickets, runs: inn.runs, over: oversText(inn.legalBalls), playerId: bat.id });
        inn.partnerships.push({ wicket: inn.wickets, a: o.batters[striker].id, b: o.batters[nonStriker].id, runs: pship.runs, balls: pship.balls });
        pship = { runs: 0, balls: 0 };
        inn.events.push({ over: ov, ball: legal, bowlerId: bowler.id, batterId: bat.id, runs: 0, extra: null, wicket: true,
          text: `${name(bowler.id)} to ${name(bat.id)}, OUT! ${dismissal}. ${name(bat.id)} ${sl.runs} (${sl.balls})`, score: `${inn.runs}/${inn.wickets}` });
        if (inn.wickets >= 10) break outer;
        striker = next++;
        batting[striker].didBat = true;
        continue;
      }

      let runs = weighted(r, RUN_DIST[format]);
      // skill & phase tilt: good batters and death overs turn dots into boundaries
      if (runs === 0 && r() < (bat.bat - 0.4) * 0.25 * phase) runs = 1;
      if ((runs === 1 || runs === 2) && r() < (phase - 0.9) * 0.35 + bat.bat * 0.05) runs = r() < 0.6 ? 4 : 6;
      if (runs === 4 || runs === 6) {
        if (r() < bowler.bowl * 0.25) runs = 1;
      }
      // a leg-bye now and then
      if (runs === 1 && r() < 0.04) {
        inn.extras.legbyes++; inn.runs++; overRuns++; pship.runs++;
        inn.events.push({ over: ov, ball: legal, bowlerId: bowler.id, batterId: bat.id, runs: 0, extra: null, wicket: false,
          text: `${name(bowler.id)} to ${name(bat.id)}, leg bye`, score: `${inn.runs}/${inn.wickets}` });
        [striker, nonStriker] = [nonStriker, striker];
      } else {
        sl.runs += runs; inn.runs += runs; overRuns += runs; concededThisOver += runs; line.runs += runs; pship.runs += runs;
        if (runs === 0) { line.dots++; inn.dots++; }
        if (runs === 4) { sl.fours++; inn.boundaries.fours++; }
        if (runs === 6) { sl.sixes++; inn.boundaries.sixes++; }
        inn.events.push({ over: ov, ball: legal, bowlerId: bowler.id, batterId: bat.id, runs, extra: null, wicket: false,
          text: `${name(bowler.id)} to ${name(bat.id)}, ${pick(r, SHOTS[runs])}`, score: `${inn.runs}/${inn.wickets}` });
        if (runs % 2 === 1) [striker, nonStriker] = [nonStriker, striker];
      }
      if (o.target && inn.runs >= o.target) break outer;
    }

    if (legal === 6 && concededThisOver === 0) line.maidens++;
    inn.overs.push({ over: ov + 1, runs: overRuns, wickets: overWkts, total: inn.runs });
    [striker, nonStriker] = [nonStriker, striker];
  }

  // close a partial over (chase finished, or live)
  const lastOverNo = Math.ceil(inn.legalBalls / 6);
  if (inn.overs.length < lastOverNo) {
    const done = inn.overs.reduce((s, x) => s + x.runs, 0);
    const wk = inn.overs.reduce((s, x) => s + x.wickets, 0);
    inn.overs.push({ over: lastOverNo, runs: inn.runs - done, wickets: inn.wickets - wk, total: inn.runs });
  }
  if (inn.wickets < 10 && pship.balls) {
    inn.partnerships.push({ wicket: inn.wickets + 1, a: o.batters[striker].id, b: o.batters[nonStriker].id, runs: pship.runs, balls: pship.balls });
  }
  inn.bowling = [...bowling.values()];
  inn.complete = inn.legalBalls < maxBalls || inn.wickets >= 10 || inn.legalBalls >= oversLimit * 6 || (!!o.target && inn.runs >= o.target);
  if (o.maxLegalBalls !== undefined && inn.legalBalls >= o.maxLegalBalls && !(o.target && inn.runs >= o.target) && inn.wickets < 10) {
    inn.complete = false;
  }
  return inn;
}

/** Pick a batting order and XI from a squad: openers and top order by batting skill. */
export function pickXI(r: Rng, squad: SimPlayer[]) {
  const keeper = squad.find((p) => p.wk) ?? squad[0];
  const rest = squad.filter((p) => p !== keeper).sort((a, b) => b.bat + b.bowl - (a.bat + a.bowl) + (r() - 0.5) * 0.2);
  const xi = [keeper, ...rest.slice(0, 10)];
  const order = [...xi].sort((a, b) => b.bat - a.bat + (r() - 0.5) * 0.15);
  // keep the keeper in the middle order
  const ki = order.indexOf(keeper);
  if (ki < 4) { order.splice(ki, 1); order.splice(int(r, 4, 6), 0, keeper); }
  return order;
}
