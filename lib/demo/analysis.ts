import { anyPlayer, econ, teamById, type Match } from "./index";
import { oversText, type Innings } from "./sim";
import type { CommentaryBall } from "@/components/cscs/commentary";

export function worm(m: Match) {
  const [a, b] = m.innings;
  const n = Math.max(a?.overs.length ?? 0, b?.overs.length ?? 0);
  return Array.from({ length: n }, (_, i) => ({ over: i + 1, a: a?.overs[i]?.total, b: b?.overs[i]?.total }));
}

export function manhattan(m: Match) {
  const [a, b] = m.innings;
  const n = Math.max(a?.overs.length ?? 0, b?.overs.length ?? 0);
  return Array.from({ length: n }, (_, i) => ({ over: i + 1, a: a?.overs[i]?.runs, b: b?.overs[i]?.runs }));
}

function runCounts(inn?: Innings) {
  const c = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "6": 0 } as Record<string, number>;
  for (const e of inn?.events ?? []) if (!e.extra && !e.wicket && String(e.runs) in c) c[String(e.runs)]++;
  return c;
}

export function runTypes(m: Match) {
  const a = runCounts(m.innings[0]), b = runCounts(m.innings[1]);
  return [["0", "Dots"], ["1", "1s"], ["2", "2s"], ["3", "3s"], ["4", "4s"], ["6", "6s"]].map(([k, kind]) => ({ kind, a: a[k], b: b[k] }));
}

export function phases(m: Match) {
  const cuts = m.format === "T20" ? [[1, 6, "Powerplay 1-6"], [7, 15, "Middle 7-15"], [16, 20, "Death 16-20"]] : [[1, 10, "Powerplay 1-10"], [11, 40, "Middle 11-40"], [41, 50, "Death 41-50"]];
  const rr = (inn: Innings | undefined, lo: number, hi: number) => {
    const os = inn?.overs.filter((o) => o.over >= lo && o.over <= hi) ?? [];
    return os.length ? Number((os.reduce((s, o) => s + o.runs, 0) / os.length).toFixed(2)) : 0;
  };
  return cuts.map(([lo, hi, phase]) => ({ phase: phase as string, a: rr(m.innings[0], lo as number, hi as number), b: rr(m.innings[1], lo as number, hi as number) }));
}

export function partnerships(inn: Innings) {
  return inn.partnerships.map((p) => ({
    label: `${p.wicket}: ${anyPlayer(p.a)?.name.split(" ")[1]} & ${anyPlayer(p.b)?.name.split(" ")[1]}`,
    runs: p.runs,
  }));
}

/** The stats-comparison panel, like the CSCS scoring app. */
export function comparison(m: Match) {
  const f = (i?: Innings) => {
    const top = i ? Math.max(0, ...i.partnerships.map((p) => p.runs)) : 0;
    return {
      Runs: i?.runs ?? 0,
      "Wickets lost": i?.wickets ?? 0,
      "Run rate": i ? econ(i.runs, i.legalBalls) : "-",
      Fours: i?.boundaries.fours ?? 0,
      Sixes: i?.boundaries.sixes ?? 0,
      "Dot balls": i?.dots ?? 0,
      Extras: i ? i.extras.wides + i.extras.noballs + i.extras.legbyes + i.extras.byes : 0,
      "50s": i?.batting.filter((b) => b.runs >= 50 && b.runs < 100).length ?? 0,
      "Best partnership": top,
    } as Record<string, number | string>;
  };
  const a = f(m.innings[0]), b = f(m.innings[1]);
  return Object.keys(a).map((k) => ({ stat: k, a: a[k], b: b[k] }));
}

export function topPerformers(m: Match) {
  return m.innings.map((inn) => {
    const bat = [...inn.batting].filter((b) => b.didBat).sort((x, y) => y.runs - x.runs)[0];
    const bowl = [...inn.bowling].sort((x, y) => y.wickets - x.wickets || x.runs - y.runs)[0];
    return { team: inn.battingTeam, bat, bowlTeam: inn.bowlingTeam, bowl };
  });
}

export function keyMoments(m: Match) {
  const out: { over: string; text: string }[] = [];
  m.innings.forEach((inn, idx) => {
    const team = teamById(inn.battingTeam).short;
    let score = 0;
    const milestones = new Set<string>();
    const tally = new Map<string, number>();
    for (const e of inn.events) {
      if (e.extra) continue;
      const over = `${e.over}.${e.ball}`;
      tally.set(e.batterId, (tally.get(e.batterId) ?? 0) + e.runs);
      score += e.runs;
      const t = tally.get(e.batterId)!;
      for (const mark of [50, 100]) {
        const key = `${e.batterId}-${mark}`;
        if (t >= mark && !milestones.has(key)) { milestones.add(key); out.push({ over, text: `${anyPlayer(e.batterId)?.name} reaches ${mark} for ${team}` }); }
      }
    }
    const big = [...inn.overs].sort((a, b) => b.runs - a.runs)[0];
    if (big && big.runs >= 14) out.push({ over: `${big.over}`, text: `${big.runs} runs off over ${big.over} for ${team}` });
    for (const b of inn.bowling) if (b.wickets >= 3) out.push({ over: "", text: `${anyPlayer(b.playerId)?.name} takes ${b.wickets}/${b.runs}` });
    if (idx === 0) out.push({ over: oversText(inn.legalBalls), text: `${team} finish on ${inn.runs}/${inn.wickets}` });
  });
  if (m.result) out.push({ over: "", text: m.result });
  return out;
}

export function commentary(inn: Innings): CommentaryBall[] {
  const balls: CommentaryBall[] = [];
  let currentOver = -1;
  const overTotals = new Map(inn.overs.map((o) => [o.over, o]));
  for (const [i, e] of inn.events.entries()) {
    const firstOfOver = e.over !== currentOver;
    currentOver = e.over;
    balls.push({
      key: `${i}`,
      label: `${e.over}.${e.ball}`,
      runs: e.runs, wicket: e.wicket, extra: e.extra, text: e.text, score: e.score,
      overEnd: firstOfOver && e.over > 0 && overTotals.get(e.over) ? `End of over ${e.over}: ${overTotals.get(e.over)!.runs} runs · ${teamById(inn.battingTeam).short} ${overTotals.get(e.over)!.total}` : undefined,
    });
  }
  return balls.reverse();
}
