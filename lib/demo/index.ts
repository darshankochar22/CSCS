/**
 * DEMO DATA. Players, fixtures, scores, sponsors and products here are
 * fictional and generated deterministically, so the design can show every
 * feature a full association site needs. Swap for real feeds later.
 */
import { int, mulberry32, pick, shuffle, slug } from "./rng";
import { LAST, MEN_FIRST, WOMEN_FIRST } from "./names";
import { pickXI, simulateInnings, type Format, type Innings, type SimPlayer } from "./sim";

export const TODAY = new Date("2026-10-02T12:00:00+05:30");

/* ------------------------------------------------------------------ */
/* Teams                                                               */
/* ------------------------------------------------------------------ */

export type Gender = "men" | "women";
export type Team = {
  id: string; name: string; short: string; gender: Gender; group: string; home: boolean; venue: string;
};

export const STATE_TEAMS: Team[] = [
  { id: "cg-sm", name: "Chhattisgarh", short: "CG", gender: "men", group: "Senior", home: true, venue: "svns" },
  { id: "cg-sw", name: "Chhattisgarh Women", short: "CG-W", gender: "women", group: "Senior", home: true, venue: "svns" },
  { id: "cg-u23", name: "Chhattisgarh U-23", short: "CG U23", gender: "men", group: "Under-23", home: true, venue: "bsp" },
  { id: "cg-u19", name: "Chhattisgarh U-19", short: "CG U19", gender: "men", group: "Under-19", home: true, venue: "rdca" },
  { id: "cg-wu19", name: "Chhattisgarh Women U-19", short: "CG-W U19", gender: "women", group: "Under-19", home: true, venue: "kalyan" },
];

const OPP_STATES: [string, string, string][] = [
  ["Mumbai", "MUM", "wankhede"], ["Vidarbha", "VID", "vca"], ["Madhya Pradesh", "MP", "holkar"], ["Railways", "RLY", "karnail"],
  ["Baroda", "BRD", "kotambi"], ["Saurashtra", "SAU", "khandheri"], ["Hyderabad", "HYD", "uppal"], ["Bengal", "BEN", "eden"],
  ["Delhi", "DEL", "kotla"], ["Punjab", "PUN", "mullanpur"], ["Odisha", "ODI", "barabati"], ["Jharkhand", "JHA", "jsca"],
];

export const VENUES: Record<string, { name: string; city: string }> = {
  svns: { name: "Shaheed Veer Narayan Singh International Stadium", city: "Nava Raipur" },
  bsp: { name: "Sector-10 Ground, BSP", city: "Bhilai" },
  rdca: { name: "RDCA Ground", city: "Raipur" },
  kalyan: { name: "Kalyan College Ground", city: "Bhilai" },
  wankhede: { name: "Wankhede Stadium", city: "Mumbai" },
  vca: { name: "VCA Stadium, Jamtha", city: "Nagpur" },
  holkar: { name: "Holkar Stadium", city: "Indore" },
  karnail: { name: "Karnail Singh Stadium", city: "Delhi" },
  kotambi: { name: "Kotambi Stadium", city: "Vadodara" },
  khandheri: { name: "Niranjan Shah Stadium", city: "Rajkot" },
  uppal: { name: "Rajiv Gandhi International Stadium", city: "Hyderabad" },
  eden: { name: "Eden Gardens", city: "Kolkata" },
  kotla: { name: "Arun Jaitley Stadium", city: "Delhi" },
  mullanpur: { name: "Maharaja Yadavindra Singh Stadium", city: "Mullanpur" },
  barabati: { name: "Barabati Stadium", city: "Cuttack" },
  jsca: { name: "JSCA International Stadium", city: "Ranchi" },
};

export const DISTRICTS = [
  "Raipur", "Durg", "Bhilai", "Bilaspur", "Rajnandgaon", "Korba", "Raigarh", "Bastar", "Surguja", "Dhamtari",
  "Mahasamund", "Kanker", "Janjgir-Champa", "Kabirdham", "Balod", "Bemetara", "Mungeli", "Kondagaon", "BSP",
];

/* ------------------------------------------------------------------ */
/* Players                                                             */
/* ------------------------------------------------------------------ */

export type Role = "Batter" | "Bowler" | "All-rounder" | "Wicket-keeper";
export type Player = SimPlayer & {
  slug: string; teamId: string; number: number; role: Role; gender: Gender; age: number; district: string;
  batStyle: string; bowlStyle: string | null; captain?: boolean; viceCaptain?: boolean; star?: boolean;
  bio: string;
  career: { matches: number; runs: number; wickets: number; hs: number; best: string; fifties: number; hundreds: number; debut: number };
};

const BOWL_STYLES = ["Right-arm fast-medium", "Right-arm medium", "Left-arm orthodox", "Right-arm off-break", "Right-arm leg-break", "Left-arm fast-medium"];

function makeSquad(teamId: string, gender: Gender, size: number, seed: number, ageBase: number, profiles: boolean): Player[] {
  const r = mulberry32(seed);
  const firsts = shuffle(r, gender === "men" ? MEN_FIRST : WOMEN_FIRST);
  const lasts = shuffle(r, LAST);
  const numbers = shuffle(r, Array.from({ length: 98 }, (_, i) => i + 1));
  const roles: Role[] = ["Wicket-keeper", "Wicket-keeper", "Batter", "Batter", "Batter", "Batter", "Batter",
    "All-rounder", "All-rounder", "All-rounder", "Bowler", "Bowler", "Bowler", "Bowler", "Bowler", "Bowler"];
  return Array.from({ length: size }, (_, i) => {
    const role = roles[i % roles.length];
    const name = `${firsts[i % firsts.length]} ${lasts[i % lasts.length]}`;
    const bat = role === "Batter" || role === "Wicket-keeper" ? 0.55 + r() * 0.4 : role === "All-rounder" ? 0.45 + r() * 0.35 : 0.1 + r() * 0.25;
    const bowl = role === "Bowler" ? 0.55 + r() * 0.4 : role === "All-rounder" ? 0.45 + r() * 0.35 : 0.05 + r() * 0.15;
    const age = ageBase + int(r, 0, ageBase > 20 ? 12 : 3);
    const matches = profiles ? int(r, 4, ageBase > 20 ? 70 : 18) : 0;
    const bowlStyle = role === "Batter" || role === "Wicket-keeper" ? (r() < 0.3 ? pick(r, BOWL_STYLES) : null) : pick(r, BOWL_STYLES);
    const district = pick(r, DISTRICTS);
    return {
      id: `${teamId}-${i + 1}`,
      slug: `${slug(name)}-${teamId}`,
      name, teamId, number: numbers[i], role, gender, age, district,
      bat, bowl, wk: role === "Wicket-keeper" && i === 0,
      batStyle: r() < 0.3 ? "Left-hand bat" : "Right-hand bat",
      bowlStyle,
      bio: `${name} came through the ${district} district system and the CSCS age-group pathway.`,
      career: {
        matches,
        runs: Math.round(matches * (bat * 38 + r() * 8)),
        wickets: Math.round(matches * bowl * (1.2 + r() * 0.6)),
        hs: Math.round(30 + bat * 120 + r() * 30),
        best: `${int(r, 2, Math.max(2, Math.round(bowl * 7)))}/${int(r, 12, 45)}`,
        fifties: Math.round(matches * bat * 0.18),
        hundreds: Math.round(matches * bat * bat * 0.05),
        debut: 2026 - int(r, 0, ageBase > 20 ? 9 : 2),
      },
    } satisfies Player;
  });
}

const AGE_BASE: Record<string, number> = { "cg-sm": 21, "cg-sw": 19, "cg-u23": 19, "cg-u19": 16, "cg-wu19": 15 };

export const PLAYERS: Player[] = STATE_TEAMS.flatMap((t, i) => {
  const squad = makeSquad(t.id, t.gender, 16, 1000 + i * 77, AGE_BASE[t.id], true);
  // leadership and stars
  const byAbility = [...squad].sort((a, b) => b.bat + b.bowl - (a.bat + a.bowl));
  byAbility[0].captain = true;
  byAbility[1].viceCaptain = true;
  if (t.group === "Senior") byAbility.slice(0, t.gender === "men" ? 4 : 2).forEach((p) => (p.star = true));
  return squad;
});

export const playerById = new Map(PLAYERS.map((p) => [p.id, p]));
export const playerBySlug = new Map(PLAYERS.map((p) => [p.slug, p]));
export const squadOf = (teamId: string) => PLAYERS.filter((p) => p.teamId === teamId);
export const STARS = PLAYERS.filter((p) => p.star);

/* ------------------------------------------------------------------ */
/* Tournaments & matches                                               */
/* ------------------------------------------------------------------ */

export type Tournament = {
  slug: string; name: string; short: string; format: Format; gender: Gender; group: string;
  stateTeam: string; teams: Team[]; start: string; organiser: "BCCI" | "CSCS";
};

type TDef = { slug: string; name: string; short: string; format: Format; stateTeam: string; opp: number[]; dates: string[]; organiser?: "BCCI" | "CSCS" };

/**
 * dates: one per Chhattisgarh fixture (ISO). Matches before TODAY are complete,
 * the one on TODAY is live, later ones are upcoming.
 */
const TDEFS: TDef[] = [
  { slug: "smat-2026", name: "Syed Mushtaq Ali Trophy 2026-27", short: "SMAT", format: "T20", stateTeam: "cg-sm", opp: [0, 1, 2, 3, 4],
    dates: ["2026-09-20T14:00", "2026-09-23T14:00", "2026-09-26T19:00", "2026-10-02T14:00", "2026-10-05T19:00"] },
  { slug: "vht-2026", name: "Vijay Hazare Trophy 2026-27", short: "VHT", format: "ODI", stateTeam: "cg-sm", opp: [5, 6, 7, 8, 9],
    dates: ["2026-10-09T09:00", "2026-10-11T09:00", "2026-10-13T09:00", "2026-10-16T09:00", "2026-10-18T09:00"] },
  { slug: "swt20-2026", name: "Senior Women's T20 Trophy 2026-27", short: "SW T20", format: "T20", stateTeam: "cg-sw", opp: [0, 7, 2, 3, 1],
    dates: ["2026-09-08T09:30", "2026-09-10T09:30", "2026-09-12T13:30", "2026-09-14T09:30", "2026-09-16T13:30"] },
  { slug: "swod-2026", name: "Senior Women's One Day Trophy 2026-27", short: "SW OD", format: "ODI", stateTeam: "cg-sw", opp: [8, 10, 11, 4, 6],
    dates: ["2026-09-28T09:00", "2026-10-04T09:00", "2026-10-07T09:00", "2026-10-10T09:00", "2026-10-14T09:00"] },
  { slug: "u23-2026", name: "Men's U-23 State A Trophy 2026-27", short: "U23", format: "ODI", stateTeam: "cg-u23", opp: [10, 11, 6, 9, 0],
    dates: ["2026-08-24T09:00", "2026-08-26T09:00", "2026-08-29T09:00", "2026-09-01T09:00", "2026-09-04T09:00"] },
  { slug: "vinoo-2026", name: "Vinoo Mankad Trophy (U-19) 2026-27", short: "U19 OD", format: "ODI", stateTeam: "cg-u19", opp: [1, 2, 4, 10, 11],
    dates: ["2026-09-05T09:00", "2026-09-07T09:00", "2026-09-09T09:00", "2026-09-11T09:00", "2026-09-13T09:00"] },
  { slug: "wu19t20-2026", name: "Women's U-19 T20 Trophy 2026-27", short: "WU19 T20", format: "T20", stateTeam: "cg-wu19", opp: [3, 5, 7, 8, 1],
    dates: ["2026-08-12T09:30", "2026-08-13T13:30", "2026-08-15T09:30", "2026-08-17T09:30", "2026-08-18T13:30"] },
];

const OPP_TEAMS = new Map<string, Team>();
const OPP_SQUADS = new Map<string, Player[]>();

function oppTeam(idx: number, base: Team, tSeed: number): Team {
  const [state, short, venue] = OPP_STATES[idx];
  const suffix = base.id === "cg-sm" ? "" : base.id === "cg-sw" ? " Women" : base.id === "cg-wu19" ? " Women U-19" : base.group === "Under-23" ? " U-23" : " U-19";
  const id = `${slug(state)}-${base.id.replace("cg-", "")}`;
  if (!OPP_TEAMS.has(id)) {
    const team: Team = { id, name: `${state}${suffix}`, short: short + (suffix ? suffix.replace(" Women", "-W").replace(" U-", " U") : ""), gender: base.gender, group: base.group, home: false, venue };
    OPP_TEAMS.set(id, team);
    OPP_SQUADS.set(id, makeSquad(id, base.gender, 13, tSeed + idx * 13, AGE_BASE[base.id], false).map((p) => ({ ...p, bat: p.bat * 0.97, bowl: p.bowl * 0.97 })));
  }
  return OPP_TEAMS.get(id)!;
}

export const TOURNAMENTS: Tournament[] = TDEFS.map((d, i) => {
  const base = STATE_TEAMS.find((t) => t.id === d.stateTeam)!;
  return {
    slug: d.slug, name: d.name, short: d.short, format: d.format, gender: base.gender, group: base.group, stateTeam: base.id,
    teams: [base, ...d.opp.map((o) => oppTeam(o, base, 5000 + i * 101))], start: d.dates[0], organiser: d.organiser ?? "BCCI",
  };
});

export const teamById = (id: string): Team => STATE_TEAMS.find((t) => t.id === id) ?? OPP_TEAMS.get(id)!;
export const squadFor = (teamId: string): Player[] => (teamId.startsWith("cg-") ? squadOf(teamId) : OPP_SQUADS.get(teamId)!);
export const anyPlayer = (id: string): Player | undefined => playerById.get(id) ?? [...OPP_SQUADS.values()].flat().find((p) => p.id === id);

export type MatchStatus = "completed" | "live" | "upcoming";
export type Match = {
  id: number; tournament: string; matchNo: number; format: Format; date: string; venue: string;
  home: string; away: string; status: MatchStatus;
  toss?: { winner: string; decision: "bat" | "bowl" };
  xi?: Record<string, string[]>;
  innings: Innings[];
  result?: string; winner?: string; marginText?: string; potm?: string;
  officials: { umpire1: string; umpire2: string; referee: string; scorer: string };
  target?: number;
};

const UMPIRES = ["Jigar Bavaria", "Nitin Kathwar", "Ravi Shrivas", "Anil Dandekar", "Sunil Choudhary", "Pradeep Sahu", "Mahendra Sahu", "Rakesh Tiwari"];

function buildMatch(t: Tournament, def: TDef, k: number, id: number): Match {
  const r = mulberry32(9000 + id * 31);
  const cg = t.teams[0], opp = t.teams[k + 1];
  const atHome = k % 2 === 0;
  const home = atHome ? cg : opp, away = atHome ? opp : cg;
  const date = def.dates[k];
  const day = date.slice(0, 10), today = TODAY.toISOString().slice(0, 10);
  const status: MatchStatus = day < today ? "completed" : day === today ? "live" : "upcoming";
  const officials = { umpire1: pick(r, UMPIRES), umpire2: pick(r, UMPIRES.slice().reverse()), referee: pick(r, ["S. K. Bansal", "Anil Chaudhary", "V. Narayanan"]), scorer: pick(r, ["Mahendra Sahu", "Devendra Patel", "Rohit Jain"]) };
  const base: Match = { id, tournament: t.slug, matchNo: k + 1, format: t.format, date, venue: home.venue, home: home.id, away: away.id, status, innings: [], officials };
  if (status === "upcoming") return base;

  const tossWinner = r() < 0.5 ? home.id : away.id;
  const decision: "bat" | "bowl" = r() < 0.55 ? "bowl" : "bat";
  const first = decision === "bat" ? tossWinner : tossWinner === home.id ? away.id : home.id;
  const second = first === home.id ? away.id : home.id;
  const xiA = pickXI(r, squadFor(first)), xiB = pickXI(r, squadFor(second));
  const inn1 = simulateInnings({ r, format: t.format, battingTeam: first, bowlingTeam: second, batters: xiA, bowlers: xiB });
  const target = inn1.runs + 1;
  const liveBalls = status === "live" ? (t.format === "T20" ? 87 : 200) : undefined;
  const inn2 = simulateInnings({ r, format: t.format, battingTeam: second, bowlingTeam: first, batters: xiB, bowlers: xiA, target, maxLegalBalls: liveBalls });

  const m: Match = { ...base, toss: { winner: tossWinner, decision }, xi: { [first]: xiA.map((p) => p.id), [second]: xiB.map((p) => p.id) }, innings: [inn1, inn2], target };
  if (status === "live") return m;

  const allBalls = t.format === "T20" ? 120 : 300;
  if (inn2.runs >= target) {
    m.winner = second;
    m.marginText = `${10 - inn2.wickets} wicket${10 - inn2.wickets === 1 ? "" : "s"}`;
    const left = allBalls - inn2.legalBalls;
    m.result = `${teamById(second).name} won by ${m.marginText}${left ? ` (${left} balls left)` : ""}`;
  } else if (inn2.runs === inn1.runs) {
    m.result = "Match tied";
  } else {
    m.winner = first;
    m.marginText = `${inn1.runs - inn2.runs} runs`;
    m.result = `${teamById(first).name} won by ${m.marginText}`;
  }
  // player of the match: best impact from the winning side
  const side = m.winner ?? first;
  const impact = new Map<string, number>();
  for (const inn of m.innings) {
    for (const b of inn.batting) if (inn.battingTeam === side) impact.set(b.playerId, (impact.get(b.playerId) ?? 0) + b.runs + b.sixes * 2);
    for (const b of inn.bowling) if (inn.bowlingTeam === side) impact.set(b.playerId, (impact.get(b.playerId) ?? 0) + b.wickets * 22 - Math.max(0, b.runs - b.balls * 1.2) * 0.3);
  }
  m.potm = [...impact.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return m;
}

export const MATCHES: Match[] = TOURNAMENTS.flatMap((t, ti) => {
  const def = TDEFS[ti];
  return def.dates.map((_, k) => buildMatch(t, def, k, (ti + 1) * 100 + k + 1));
}).sort((a, b) => a.date.localeCompare(b.date));

export const matchById = (id: number) => MATCHES.find((m) => m.id === id);
export const LIVE = MATCHES.filter((m) => m.status === "live");
export const RESULTS = MATCHES.filter((m) => m.status === "completed").reverse();
export const FIXTURES = MATCHES.filter((m) => m.status === "upcoming");
export const tournamentBySlug = (s: string) => TOURNAMENTS.find((t) => t.slug === s);

/* ------------------------------------------------------------------ */
/* Tables & stats                                                      */
/* ------------------------------------------------------------------ */

export type TableRow = { team: Team; played: number; won: number; lost: number; nr: number; points: number; nrr: number; form: ("W" | "L")[] };

export function pointsTable(t: Tournament): TableRow[] {
  const r = mulberry32(t.slug.length * 997);
  const rows = new Map(t.teams.map((tm) => [tm.id, { team: tm, played: 0, won: 0, lost: 0, nr: 0, points: 0, nrr: 0, form: [] as ("W" | "L")[] }]));
  const ms = MATCHES.filter((m) => m.tournament === t.slug && m.status === "completed");
  // Chhattisgarh's real (simulated) results
  for (const m of ms) {
    for (const id of [m.home, m.away]) {
      const row = rows.get(id)!;
      row.played++;
      const won = m.winner === id;
      if (!m.winner) { row.nr++; row.points += 2; } else if (won) { row.won++; row.points += 4; row.form.push("W"); } else { row.lost++; row.form.push("L"); }
      const mine = m.innings.find((i) => i.battingTeam === id)!, theirs = m.innings.find((i) => i.battingTeam !== id)!;
      row.nrr += (mine.runs / Math.max(1, mine.legalBalls / 6) - theirs.runs / Math.max(1, theirs.legalBalls / 6)) / 5;
    }
  }
  // the other sides' fixtures against each other, rounds in step with CG's
  const others = t.teams.slice(1);
  const rounds = ms.length;
  for (let i = 0; i < others.length; i++) {
    const row = rows.get(others[i].id)!;
    while (row.played < rounds) {
      row.played++;
      if (r() < 0.5) { row.won++; row.points += 4; row.form.push("W"); row.nrr += r() * 0.4; } else { row.lost++; row.form.push("L"); row.nrr -= r() * 0.4; }
    }
  }
  return [...rows.values()]
    .map((x) => ({ ...x, nrr: Math.round(x.nrr * 1000) / 1000, form: x.form.slice(-5) }))
    .sort((a, b) => b.points - a.points || b.nrr - a.nrr);
}

export type BatStats = { playerId: string; inns: number; runs: number; balls: number; notOuts: number; hs: number; fours: number; sixes: number; fifties: number; hundreds: number };
export type BowlStats = { playerId: string; inns: number; balls: number; runs: number; wickets: number; best: [number, number]; dots: number };

export function aggregate(matches: Match[]) {
  const bat = new Map<string, BatStats>(), bowl = new Map<string, BowlStats>();
  for (const m of matches) for (const inn of m.innings) {
    for (const b of inn.batting) {
      if (!b.didBat) continue;
      const s = bat.get(b.playerId) ?? { playerId: b.playerId, inns: 0, runs: 0, balls: 0, notOuts: 0, hs: 0, fours: 0, sixes: 0, fifties: 0, hundreds: 0 };
      s.inns++; s.runs += b.runs; s.balls += b.balls; s.fours += b.fours; s.sixes += b.sixes;
      if (!b.dismissal) s.notOuts++;
      s.hs = Math.max(s.hs, b.runs);
      if (b.runs >= 100) s.hundreds++; else if (b.runs >= 50) s.fifties++;
      bat.set(b.playerId, s);
    }
    for (const b of inn.bowling) {
      const s = bowl.get(b.playerId) ?? { playerId: b.playerId, inns: 0, balls: 0, runs: 0, wickets: 0, best: [0, 999] as [number, number], dots: 0 };
      s.inns++; s.balls += b.balls; s.runs += b.runs; s.wickets += b.wickets; s.dots += b.dots;
      if (b.wickets > s.best[0] || (b.wickets === s.best[0] && b.runs < s.best[1])) s.best = [b.wickets, b.runs];
      bowl.set(b.playerId, s);
    }
  }
  return { bat: [...bat.values()], bowl: [...bowl.values()] };
}

export const SEASON_STATS = aggregate(MATCHES.filter((m) => m.status !== "upcoming"));
export const statFor = (id: string) => ({
  bat: SEASON_STATS.bat.find((s) => s.playerId === id),
  bowl: SEASON_STATS.bowl.find((s) => s.playerId === id),
});
export const avg = (s?: BatStats) => (s && s.inns - s.notOuts > 0 ? (s.runs / (s.inns - s.notOuts)).toFixed(2) : s?.runs ? "∞" : "-");
export const sr = (runs: number, balls: number) => (balls ? ((runs / balls) * 100).toFixed(1) : "-");
export const econ = (runs: number, balls: number) => (balls ? ((runs / balls) * 6).toFixed(2) : "-");
export const ov = (balls: number) => `${Math.floor(balls / 6)}${balls % 6 ? `.${balls % 6}` : ""}`;

/** State-team players only, for the "leaders" boards. */
export const isStatePlayer = (id: string) => id.startsWith("cg-");

export const LEADERS = {
  runs: [...SEASON_STATS.bat].filter((s) => isStatePlayer(s.playerId)).sort((a, b) => b.runs - a.runs).slice(0, 10),
  wickets: [...SEASON_STATS.bowl].filter((s) => isStatePlayer(s.playerId)).sort((a, b) => b.wickets - a.wickets || a.runs - b.runs).slice(0, 10),
  sixes: [...SEASON_STATS.bat].filter((s) => isStatePlayer(s.playerId)).sort((a, b) => b.sixes - a.sixes).slice(0, 10),
  strikeRate: [...SEASON_STATS.bat].filter((s) => isStatePlayer(s.playerId) && s.balls >= 60).sort((a, b) => b.runs / b.balls - a.runs / a.balls).slice(0, 10),
  economy: [...SEASON_STATS.bowl].filter((s) => isStatePlayer(s.playerId) && s.balls >= 60).sort((a, b) => a.runs / a.balls - b.runs / b.balls).slice(0, 10),
};

export function teamTotals() {
  const done = MATCHES.filter((m) => m.status === "completed");
  const cg = done.flatMap((m) => m.innings.filter((i) => i.battingTeam.startsWith("cg-")));
  return {
    played: done.length,
    won: done.filter((m) => m.winner?.startsWith("cg-")).length,
    runs: cg.reduce((s, i) => s + i.runs, 0),
    sixes: cg.reduce((s, i) => s + i.boundaries.sixes, 0),
    fours: cg.reduce((s, i) => s + i.boundaries.fours, 0),
    highest: cg.reduce((a, i) => (i.runs > a.runs ? i : a), cg[0]),
  };
}

/* ------------------------------------------------------------------ */
/* Highlights, news, sponsors, shop, governance                        */
/* ------------------------------------------------------------------ */

const PHOTO_POOL = ["/gallery/25.jpg", "/gallery/26.jpg", "/gallery/27.jpg", "/gallery/30.jpeg", "/news/71.webp", "/news/72.webp", "/news/73.webp", "/news/74.webp", "/gallery/32.webp"];

export type Highlight = { id: number; matchId: number; title: string; duration: string; img: string; moments: string[]; date: string };

export const HIGHLIGHTS: Highlight[] = RESULTS.slice(0, 10).map((m, i) => {
  const r = mulberry32(m.id * 7);
  const moments: string[] = [];
  for (const inn of m.innings) {
    const team = teamById(inn.battingTeam).short;
    for (const b of inn.batting) if (b.runs >= 50) moments.push(`${anyPlayer(b.playerId)?.name} ${b.runs} off ${b.balls} for ${team}`);
    for (const b of inn.bowling) if (b.wickets >= 3) moments.push(`${anyPlayer(b.playerId)?.name} takes ${b.wickets}/${b.runs}`);
    const big = [...inn.overs].sort((a, b) => b.runs - a.runs)[0];
    if (big && big.runs >= 15) moments.push(`${team} take ${big.runs} off the ${ordinal(big.over)} over`);
  }
  moments.push(m.result!);
  return {
    id: i + 1, matchId: m.id, date: m.date,
    title: `${teamById(m.home).short} v ${teamById(m.away).short}: ${pick(r, ["Full highlights", "Extended highlights", "Match highlights"])}`,
    duration: `${int(r, 4, 14)}:${String(int(r, 0, 59)).padStart(2, "0")}`,
    img: PHOTO_POOL[i % PHOTO_POOL.length],
    moments,
  };
});

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export type Article = { slug: string; title: string; tag: "Match report" | "Press release" | "Feature" | "Selection" | "Academy"; date: string; img: string; excerpt: string; body: string[]; matchId?: number };

export const ARTICLES: Article[] = [
  ...RESULTS.slice(0, 6).map((m, i): Article => {
    const w = teamById(m.winner ?? m.home), l = teamById(m.winner === m.home ? m.away : m.home);
    const potm = anyPlayer(m.potm ?? "");
    const t = tournamentBySlug(m.tournament)!;
    return {
      slug: `report-${m.id}`, tag: "Match report", date: m.date.slice(0, 10), img: PHOTO_POOL[(i + 3) % PHOTO_POOL.length], matchId: m.id,
      title: `${w.name} beat ${l.name} in the ${t.short}`,
      excerpt: `${m.result}. ${potm ? `${potm.name} was named player of the match.` : ""}`,
      body: [
        `${m.result} at ${VENUES[m.venue].name}, ${VENUES[m.venue].city}.`,
        `${teamById(m.innings[0].battingTeam).name} made ${m.innings[0].runs}/${m.innings[0].wickets} batting first, with ${m.innings[0].boundaries.fours} fours and ${m.innings[0].boundaries.sixes} sixes.`,
        `In reply, ${teamById(m.innings[1].battingTeam).name} finished on ${m.innings[1].runs}/${m.innings[1].wickets}.`,
        potm ? `${potm.name} was player of the match.` : "",
      ].filter(Boolean),
    };
  }),
  { slug: "squad-vht", tag: "Selection", date: "2026-10-01", img: "/news/74.webp", title: "Chhattisgarh name 16-member squad for the Vijay Hazare Trophy",
    excerpt: "The senior selection committee has named the squad for the 50-over competition starting 9 October.",
    body: ["The senior selection committee has named a 16-member squad for the Vijay Hazare Trophy 2026-27.", "The side opens its campaign against Saurashtra on 9 October."] },
  { slug: "trials-u16", tag: "Press release", date: "2026-09-29", img: "/gallery/26.jpg", title: "Under-16 district trials open across all 19 districts",
    excerpt: "Registration for the Under-16 inter-district trials is now open online.",
    body: ["The Sangh has opened registration for Under-16 trials across all district associations.", "Players can register online from the trials page."] },
  { slug: "academy-camp", tag: "Academy", date: "2026-09-25", img: "/gallery/25.jpg", title: "High-performance camp begins at Nava Raipur",
    excerpt: "Thirty probables report for a three-week conditioning and skills camp.",
    body: ["Thirty probables from the senior and Under-23 pools have reported to the academy for a three-week camp."] },
  { slug: "new-kit", tag: "Feature", date: "2026-09-18", img: "/gallery/27.jpg", title: "The 2026-27 kit: designed in Chhattisgarh",
    excerpt: "The new match kit goes on sale in the official store.",
    body: ["The new match kit takes its pattern from the state's tribal textile traditions.", "It is on sale now in the official store."] },
];

export type Sponsor = { name: string; tier: "Title partner" | "Principal partner" | "Official partner" | "Associate partner"; category: string; blurb: string };

export const SPONSORS: Sponsor[] = [
  { name: "Mahanadi Power", tier: "Title partner", category: "Energy", blurb: "Title partner of the Chhattisgarh senior teams since 2024." },
  { name: "Bastar Telecom", tier: "Principal partner", category: "Telecom", blurb: "Principal partner and official connectivity partner." },
  { name: "Raipur Steel Works", tier: "Principal partner", category: "Manufacturing", blurb: "Principal partner of the women's and age-group programmes." },
  { name: "Indravati Bank", tier: "Official partner", category: "Banking", blurb: "Official banking partner." },
  { name: "Sal Forest Water", tier: "Official partner", category: "Hydration", blurb: "Official hydration partner." },
  { name: "Chitrakote Motors", tier: "Official partner", category: "Automotive", blurb: "Official mobility partner." },
  { name: "Maikal Sportswear", tier: "Official partner", category: "Kit", blurb: "Official kit manufacturer." },
  { name: "Arpa Insurance", tier: "Associate partner", category: "Insurance", blurb: "Associate partner." },
  { name: "Kanha Foods", tier: "Associate partner", category: "Food", blurb: "Associate partner." },
  { name: "Sirpur Hotels", tier: "Associate partner", category: "Hospitality", blurb: "Official hospitality partner." },
  { name: "Hasdeo Cement", tier: "Associate partner", category: "Construction", blurb: "Associate partner." },
  { name: "Tirathgarh Media", tier: "Associate partner", category: "Broadcast", blurb: "Official streaming partner." },
];

export type Product = {
  slug: string; name: string; kind: "jersey" | "tee" | "cap" | "hoodie" | "accessory"; price: number; mrp?: number;
  variant: "home" | "away" | "training" | "retro" | "women" | "fan"; sizes: string[]; blurb: string; badge?: string; personalise?: boolean;
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const PRODUCTS: Product[] = [
  { slug: "home-jersey-2026", name: "2026-27 Home Jersey", kind: "jersey", variant: "home", price: 1999, sizes: SIZES, badge: "New", personalise: true, blurb: "The match jersey worn in white-ball cricket. Recycled-poly mesh, moisture-wicking." },
  { slug: "away-jersey-2026", name: "2026-27 Away Jersey", kind: "jersey", variant: "away", price: 1999, sizes: SIZES, badge: "New", personalise: true, blurb: "The away kit, with the inverted chevron pattern." },
  { slug: "womens-jersey-2026", name: "2026-27 Women's Match Jersey", kind: "jersey", variant: "women", price: 1999, sizes: SIZES, personalise: true, blurb: "Women's fit match jersey worn by Chhattisgarh Women." },
  { slug: "training-jersey", name: "Training Jersey", kind: "jersey", variant: "training", price: 1299, mrp: 1599, sizes: SIZES, badge: "Sale", blurb: "Lightweight training top, as worn at the academy." },
  { slug: "retro-2016", name: "2016 Retro Jersey", kind: "jersey", variant: "retro", price: 1499, sizes: SIZES, badge: "Limited", blurb: "Celebrating the first-class debut season. Limited run." },
  { slug: "fan-tee", name: "Fan T-shirt", kind: "tee", variant: "fan", price: 699, sizes: SIZES, blurb: "Cotton fan tee with the CSCS crest." },
  { slug: "team-cap", name: "Team Cap", kind: "cap", variant: "home", price: 599, sizes: ["One size"], blurb: "Six-panel cap with embroidered crest." },
  { slug: "hoodie", name: "Supporters' Hoodie", kind: "hoodie", variant: "fan", price: 2299, sizes: SIZES, blurb: "Heavyweight fleece hoodie for cold evening matches." },
];

export const APEX_COUNCIL = [
  { name: "V. Mohandas", role: "Honorary President" }, { name: "Gurucharan Singh Makhija", role: "Honorary Vice-President" },
  { name: "Ventesh Agrawal", role: "Honorary Secretary" }, { name: "Ajay Tiwari", role: "Honorary Joint Secretary" },
  { name: "Sumit Kumar Gupta", role: "Honorary Treasurer" }, { name: "Akhil Kumar Dhagat", role: "Apex Council Member" },
  { name: "Yogesh Vithlani", role: "Apex Council Member" }, { name: "Manjeet Singh Seeray", role: "Apex Council Member" },
  { name: "Anurag Sharma", role: "Apex Council Member" }, { name: "Anoop Chadha", role: "Apex Council Member (District representative)" },
];

export const DISTRICT_MEMBERS = [
  { name: "District Cricket Association Rajnandgaon", location: "Rajnandgaon", president: "Susil Kothari", secretary: "Yogesh Bagdi", type: "Full" },
  { name: "Durg District Cricket Association", location: "Durg", president: "Vijay Agarwal", secretary: "Pramod Parakh", type: "Full" },
  { name: "Bhilai Cricket Association", location: "Bhilai", president: "Arvind Jain", secretary: "Bhaskar Goswami", type: "Full" },
  { name: "Raipur District Cricket Association", location: "Raipur", president: "Vijay Shah", secretary: "Binay Bajaj", type: "Full" },
  { name: "Cricket Sangh Bilaspur", location: "Bilaspur", president: "Naveen Jajodia", secretary: "Ventesh Agarwal", type: "Full" },
  ...["Korba", "Raigarh", "Bastar", "Surguja", "Dhamtari", "Mahasamund", "Kanker", "Janjgir-Champa", "Kabirdham", "Balod", "Bemetara", "Mungeli", "Kondagaon"].map((d) => ({
    name: `${d} District Cricket Association`, location: d, president: "-", secretary: "-", type: "Associate",
  })),
];

export const HALL_OF_FAME = [
  { name: "First first-class win", year: 2016, note: "Beat Tripura by nine wickets on debut, 6 October 2016." },
  { name: "Highest team total (demo)", year: 2026, note: `${teamTotals().highest.runs} in the ${TOURNAMENTS[0].short}.` },
  { name: "Full BCCI membership", year: 2016, note: "Admitted as a full member in February 2016." },
  { name: "International venue", year: 2008, note: "Shaheed Veer Narayan Singh International Stadium opens in Nava Raipur." },
];

export const DOCUMENTS = [
  { title: "CSCS Constitution", type: "PDF", size: "1.2 MB", year: 2023 },
  { title: "Annual Report 2025-26", type: "PDF", size: "4.8 MB", year: 2026 },
  { title: "Audited Accounts 2025-26", type: "PDF", size: "2.1 MB", year: 2026 },
  { title: "Anti-Corruption Code", type: "PDF", size: "640 KB", year: 2025 },
  { title: "Player Code of Conduct", type: "PDF", size: "380 KB", year: 2025 },
  { title: "Age Verification Policy", type: "PDF", size: "410 KB", year: 2025 },
  { title: "Tender: Ground maintenance, Nava Raipur", type: "Tender", size: "Closes 20 Oct 2026", year: 2026 },
  { title: "RFP: Live-streaming of domestic matches", type: "RFP", size: "Closes 31 Oct 2026", year: 2026 },
];

export const MATCH_OFFICIALS = UMPIRES.map((n, i) => ({ name: n, role: i < 6 ? "Umpire" : "Scorer", panel: i < 3 ? "BCCI panel" : "State panel" }));
