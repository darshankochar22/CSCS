/**
 * Every figure here is published by the Chhattisgarh State Cricket Sangh
 * (cricketcscs.tv) for the 2026-27 domestic season, or is derived from those
 * scorecards. Nothing is invented.
 */

export type ZoneKey = "WEST" | "EAST" | "SOUTH" | "CENTRAL" | "NORTH";

/** Badge files are the Sangh's own zone crests, taken from cricketcscs.tv. */
export const ZONES: Record<ZoneKey, { name: string; short: string; hex: string; ink: string; badge: string }> = {
  WEST:    { name: "West Zone",    short: "WZ", hex: "#d4456e", ink: "#ffffff", badge: "/zones/168.jpg" },
  EAST:    { name: "East Zone",    short: "EZ", hex: "#2f9e4f", ink: "#ffffff", badge: "/zones/167.jpg" },
  SOUTH:   { name: "South Zone",   short: "SZ", hex: "#c9992a", ink: "#ffffff", badge: "/zones/170.jpg" },
  CENTRAL: { name: "Central Zone", short: "CZ", hex: "#1fa39b", ink: "#ffffff", badge: "/zones/171.jpg" },
  NORTH:   { name: "North Zone",   short: "NZ", hex: "#3d9bd6", ink: "#ffffff", badge: "/zones/169.jpg" },
};

export type Match = {
  id: number; date: string; ground: string; city: string;
  first: ZoneKey; firstScore: string; firstOvers: string;
  second: ZoneKey; secondScore: string; secondOvers: string;
  winner: ZoneKey; margin: string; marginRuns: number;
};

/** All ten group matches of the Women's Senior & U23 One Day Challenger Trophy 2026-27. */
export const MATCHES: Match[] = [
  { id: 10, date: "23 May 2026", ground: "Sector-10 Ground, BSP", city: "Bhilai",
    first: "SOUTH", firstScore: "235/4", firstOvers: "40.0", second: "NORTH", secondScore: "168/3", secondOvers: "40.0",
    winner: "SOUTH", margin: "67 runs", marginRuns: 67 },
  { id: 9, date: "23 May 2026", ground: "Kalyan College Ground", city: "Bhilai",
    first: "WEST", firstScore: "175/9", firstOvers: "35.0", second: "EAST", secondScore: "133/7", secondOvers: "35.0",
    winner: "WEST", margin: "42 runs", marginRuns: 42 },
  { id: 8, date: "21 May 2026", ground: "Sector-10 Ground, BSP", city: "Bhilai",
    first: "CENTRAL", firstScore: "203/8", firstOvers: "40.0", second: "EAST", secondScore: "190/10", secondOvers: "39.5",
    winner: "CENTRAL", margin: "13 runs", marginRuns: 13 },
  { id: 7, date: "21 May 2026", ground: "Kalyan College Ground", city: "Bhilai",
    first: "SOUTH", firstScore: "263/7", firstOvers: "40.0", second: "WEST", secondScore: "243/7", secondOvers: "40.0",
    winner: "SOUTH", margin: "20 runs", marginRuns: 20 },
  { id: 6, date: "20 May 2026", ground: "Sector-10 Ground, BSP", city: "Bhilai",
    first: "EAST", firstScore: "206/7", firstOvers: "40.0", second: "SOUTH", secondScore: "197/10", secondOvers: "39.1",
    winner: "EAST", margin: "9 runs", marginRuns: 9 },
  { id: 5, date: "20 May 2026", ground: "Kalyan College Ground", city: "Bhilai",
    first: "NORTH", firstScore: "150/10", firstOvers: "40.0", second: "CENTRAL", secondScore: "55/10", secondOvers: "24.3",
    winner: "NORTH", margin: "95 runs", marginRuns: 95 },
  { id: 4, date: "18 May 2026", ground: "Sector-10 Ground, BSP", city: "Bhilai",
    first: "WEST", firstScore: "257/4", firstOvers: "40.0", second: "CENTRAL", secondScore: "161/8", secondOvers: "40.0",
    winner: "WEST", margin: "96 runs", marginRuns: 96 },
  { id: 3, date: "18 May 2026", ground: "Kalyan College Ground", city: "Bhilai",
    first: "EAST", firstScore: "244/7", firstOvers: "40.0", second: "NORTH", secondScore: "146/9", secondOvers: "40.0",
    winner: "EAST", margin: "98 runs", marginRuns: 98 },
  { id: 2, date: "17 May 2026", ground: "Sector-10 Ground, BSP", city: "Bhilai",
    first: "CENTRAL", firstScore: "147/8", firstOvers: "40.0", second: "SOUTH", secondScore: "106/10", secondOvers: "31.0",
    winner: "CENTRAL", margin: "41 runs", marginRuns: 41 },
  { id: 1, date: "17 May 2026", ground: "Kalyan College Ground", city: "Bhilai",
    first: "WEST", firstScore: "148/5", firstOvers: "30.0", second: "NORTH", secondScore: "122/4", secondOvers: "30.0",
    winner: "WEST", margin: "26 runs", marginRuns: 26 },
];

export type LadderRow = { team: ZoneKey; played: number; won: number; lost: number; noResult: number; nrr: number; points: number };

export const LADDER: LadderRow[] = [
  { team: "WEST",    played: 4, won: 3, lost: 1, noResult: 0, nrr:  0.993, points: 12 },
  { team: "EAST",    played: 4, won: 2, lost: 2, noResult: 0, nrr:  0.315, points: 8 },
  { team: "SOUTH",   played: 4, won: 2, lost: 2, noResult: 0, nrr: -0.325, points: 8 },
  { team: "CENTRAL", played: 4, won: 2, lost: 2, noResult: 0, nrr: -0.371, points: 8 },
  { team: "NORTH",   played: 4, won: 1, lost: 3, noResult: 0, nrr: -0.600, points: 4 },
];

export type Performer = { name: string; zone: ZoneKey; value: number };

export const TOP_RUNS: Performer[] = [
  { name: "Shivani T Hari Krishna", zone: "SOUTH", value: 288 },
  { name: "Neha Badwaik",           zone: "EAST",  value: 287 },
  { name: "Kumud Sahu",             zone: "WEST",  value: 212 },
];

export const TOP_WICKETS: Performer[] = [
  { name: "Japneet Kaur",    zone: "CENTRAL", value: 10 },
  { name: "Shivika Agrawal", zone: "EAST",    value: 8 },
  { name: "Kiran Verma",     zone: "NORTH",   value: 7 },
];

export type AgeGroup = "SENIOR" | "UNDER-23" | "UNDER-19" | "UNDER-16" | "UNDER-15";
export type Tournament = {
  slug: string; title: string; start: string; end: string; matches: number;
  group: AgeGroup; gender: "men" | "women"; status: "UPCOMING" | "COMPLETED";
};

export const TOURNAMENTS: Tournament[] = [
  { slug: "w-u15-selection", title: "Women's Under-15 Selection Matches 2026-27", start: "01 Oct 2026", end: "03 Oct 2026", matches: 3, group: "UNDER-15", gender: "women", status: "UPCOMING" },
  { slug: "w-sr-u23-od", title: "Women's Senior & Under-23 One Day Challenger Trophy 2026-27", start: "17 May 2026", end: "23 May 2026", matches: 10, group: "SENIOR", gender: "women", status: "COMPLETED" },
  { slug: "w-sr-u23-t20", title: "Women's Senior & Under-23 T20 Challenger Trophy 2026-27", start: "09 May 2026", end: "15 May 2026", matches: 10, group: "SENIOR", gender: "women", status: "COMPLETED" },
  { slug: "w-u15-od", title: "Women's Under-15 One Day Challenger Trophy 2026-27", start: "02 May 2026", end: "06 May 2026", matches: 6, group: "UNDER-15", gender: "women", status: "COMPLETED" },
  { slug: "m-sr-elite-t20", title: "Men's Senior Elite Group T20 Inter-District Tournament 2026-27", start: "30 Apr 2026", end: "08 May 2026", matches: 23, group: "SENIOR", gender: "men", status: "COMPLETED" },
  { slug: "m-u16-elite", title: "Men's Under-16 Elite Group Inter-District Tournament 2026-27", start: "26 Apr 2026", end: "29 May 2026", matches: 23, group: "UNDER-16", gender: "men", status: "COMPLETED" },
  { slug: "m-sr-plate-t20", title: "Men's Senior Plate Group T20 Inter-District Tournament 2026-27", start: "23 Apr 2026", end: "27 Apr 2026", matches: 20, group: "SENIOR", gender: "men", status: "COMPLETED" },
  { slug: "w-u19-od", title: "Women's Under-19 One Day Challenger Trophy 2026-27", start: "23 Apr 2026", end: "29 Apr 2026", matches: 10, group: "UNDER-19", gender: "women", status: "COMPLETED" },
  { slug: "w-u19-t20", title: "Women's Under-19 T20 Challenger Trophy 2026-27", start: "16 Apr 2026", end: "21 Apr 2026", matches: 10, group: "UNDER-19", gender: "women", status: "COMPLETED" },
  { slug: "m-u16-plate", title: "Men's Under-16 Plate Group Inter-District Tournament 2026-27", start: "11 Apr 2026", end: "21 Apr 2026", matches: 20, group: "UNDER-16", gender: "men", status: "COMPLETED" },
  { slug: "m-u19-od", title: "Men's Under-19 One Day Challenger Trophy 2026-27", start: "08 Apr 2026", end: "14 Apr 2026", matches: 10, group: "UNDER-19", gender: "men", status: "COMPLETED" },
  { slug: "m-u23-selection", title: "Men's Under-23 Selection Matches 2026-27", start: "08 Apr 2026", end: "21 Apr 2026", matches: 6, group: "UNDER-23", gender: "men", status: "COMPLETED" },
  { slug: "w-u23-exposure", title: "Women's Under-23 One Day Exposure Matches 2025-26", start: "23 Feb 2026", end: "27 Feb 2026", matches: 3, group: "UNDER-23", gender: "women", status: "COMPLETED" },
  { slug: "m-sr-elite", title: "Men's Senior Elite Group Inter-District Tournament 2026-27", start: "21 Feb 2026", end: "01 Apr 2026", matches: 23, group: "SENIOR", gender: "men", status: "COMPLETED" },
  { slug: "sr-plate", title: "Senior Plate Group Inter-District Tournament 2026-27", start: "02 Feb 2026", end: "17 Feb 2026", matches: 20, group: "SENIOR", gender: "men", status: "COMPLETED" },
  { slug: "m-u19-elite", title: "Men's Under-19 Elite Group Inter-District Tournament 2026-27", start: "28 Dec 2025", end: "30 Jan 2026", matches: 23, group: "UNDER-19", gender: "men", status: "COMPLETED" },
  { slug: "m-u19-plate", title: "Men's Under-19 Plate Group Inter-District Tournament 2026-27", start: "07 Dec 2025", end: "21 Dec 2025", matches: 20, group: "UNDER-19", gender: "men", status: "COMPLETED" },
];

export type Player = { name: string; role: string; note?: string };

export const SQUAD: Player[] = [
  { name: "Amandeep Khare", role: "Batter / all-rounder", note: "Captain" },
  { name: "Ajay Mandal", role: "Spin bowler", note: "Vice-captain · Delhi Capitals" },
  { name: "Shashank Singh", role: "Batter", note: "Punjab Kings" },
  { name: "Ashutosh Singh", role: "Batter" },
  { name: "Sanjeet Desai", role: "Batter" },
  { name: "Harpreet Singh", role: "Left-hand batter" },
  { name: "Mayank Verma", role: "Wicket-keeper" },
  { name: "Shashank Chandrakar", role: "Wicket-keeper" },
  { name: "Aditya Sarwate", role: "Spin bowler" },
  { name: "Shubham Agarwal", role: "Spin bowler" },
  { name: "Mohit Raut", role: "Spin bowler" },
  { name: "Ravi Kiran", role: "Pace bowler" },
  { name: "Sourabh Majumdar", role: "Pace bowler" },
  { name: "Dev Aditya Singh", role: "Pace bowler" },
  { name: "Vashudev Bareth", role: "Pace bowler" },
  { name: "Ashish Chouhan", role: "Pace bowler" },
  { name: "Harsh Yadav", role: "Pace bowler" },
];

export const STAFF: Player[] = [
  { name: "Hitesh Goswami", role: "Head coach" },
  { name: "Swadesh Nagare", role: "Trainer" },
  { name: "Kishore Nakhale", role: "Physiotherapist" },
  { name: "Yogesh Verma", role: "Video analyst" },
];

export const OFFICIALS = [
  { role: "President", name: "V Mohan Das" },
  { role: "Secretary", name: "Vitesh Agarwal" },
  { role: "Chief Executive", name: "Hari Gundlapalli" },
];

export const NEWS = [
  { date: "12 Sep 2026", ago: "4h",  title: "Varun & Mayank shine: selected for the Rest of India Under-23 team", tag: "Selection", img: "/news/74.webp" },
  { date: "10 Sep 2026", ago: "2d",  title: "Chhattisgarh finish runner-up in the MPMSC Senior Women's tournament", tag: "Women", img: "/news/73.webp" },
  { date: "09 Sep 2026", ago: "3d",  title: "Fantastic four! Chhattisgarh continue their winning streak", tag: "Result", img: "/news/72.webp" },
  { date: "09 Sep 2026", ago: "3d",  title: "Chhattisgarh's Ayush Pandey earns an India A call-up", tag: "Selection", img: "/news/71.webp" },
  { date: "08 Sep 2026", ago: "4d",  title: "Chhattisgarh continue winning momentum with a 16-run victory", tag: "Result", img: "/news/74.webp" },
];

/** Photo galleries as published by the Sangh. */
export const GALLERIES = [
  { title: "CSCS 2025-26", img: "/gallery/25.jpg" },
  { title: "Play action", img: "/gallery/26.jpg" },
  { title: "Winners", img: "/gallery/27.jpg" },
  { title: "Chief Minister Tournament 2019", img: "/gallery/28.png" },
  { title: "Chhattisgarh U23 — Semi Final", img: "/gallery/30.jpeg" },
  { title: "CCPL", img: "/gallery/32.webp" },
];

export const GROUNDS = [
  { name: "Shaheed Veer Narayan Singh International Stadium", city: "Nava Raipur",
    note: "CSCS headquarters and the state's international venue. Third largest cricket ground in India.",
    stat: "65,000 seats · 49,000 for domestic fixtures" },
  { name: "Sector-10 Ground, BSP", city: "Bhilai",
    note: "Hosted five of the ten Challenger Trophy fixtures, including Match 10.", stat: "5 matches in 2026-27" },
  { name: "Kalyan College Ground", city: "Bhilai",
    note: "Shared the Challenger Trophy schedule with Sector-10, running parallel fixtures on the same dates.",
    stat: "5 matches in 2026-27" },
  { name: "RDCA Ground", city: "Raipur",
    note: "VIP Square, Telibandha. The Sangh's communication address and district match venue.",
    stat: "Raipur District Cricket Association" },
];

export const ADDRESSES = {
  registered: ["#35/75, Sona House, Punjabi Colony", "Near SBI Zonal Office, Katora Talab", "Raipur — 492001"],
  communication: ["RDCA Ground, VIP Square", "Behind Wood Castle Hotel", "Telibandha, Raipur (C.G.)"],
};

export const SOCIALS = [
  { label: "CCPL T20", href: "https://ccplt20.tv/" },
  { label: "X", href: "https://x.com/CricketCSCS" },
  { label: "Facebook", href: "https://www.facebook.com/CricketCSCS/" },
  { label: "LinkedIn", href: "https://in.linkedin.com/company/cricketcscs" },
];

/* ---------------- derived ---------------- */
function runs(score: string) { return parseInt(score.split("/")[0], 10); }

export function zoneRunTotals() {
  const agg = {} as Record<ZoneKey, { for: number; against: number }>;
  (Object.keys(ZONES) as ZoneKey[]).forEach((z) => (agg[z] = { for: 0, against: 0 }));
  for (const m of MATCHES) {
    const a = runs(m.firstScore), b = runs(m.secondScore);
    agg[m.first].for += a; agg[m.first].against += b;
    agg[m.second].for += b; agg[m.second].against += a;
  }
  return agg;
}

export const SEASON = {
  tournaments: TOURNAMENTS.length,
  matches: TOURNAMENTS.reduce((s, t) => s + t.matches, 0),
  districtTeams: 19,
  ageGroups: new Set(TOURNAMENTS.map((t) => t.group)).size,
};

export const BIGGEST_WIN = MATCHES.reduce((a, b) => (b.marginRuns > a.marginRuns ? b : a));

/* ---------------- site structure ---------------- */
export const NAV = [
  { name: "Matches", link: "/matches" },
  { name: "Standings", link: "/standings" },
  { name: "Tournaments", link: "/tournaments" },
  { name: "Teams", link: "/teams" },
  { name: "News", link: "/news" },
  { name: "Photos", link: "/photos" },
  { name: "Grounds", link: "/grounds" },
  { name: "About", link: "/about" },
];

export const NAV_SECONDARY = [
  { name: "Academy", link: "/academy" },
  { name: "Trials registration", link: "/register" },
  { name: "Contact", link: "/contact" },
];

/** Every published photo the site has, news images included. */
export const PHOTOS = [
  ...GALLERIES.map((g) => ({ title: g.title, src: g.img })),
  { title: "Chief Minister Tournament 2019 — prize giving", src: "/gallery/29.png" },
  ...NEWS.slice(0, 4).map((n) => ({ title: n.title, src: n.img })),
];

export function matchById(id: number) {
  return MATCHES.find((m) => m.id === id);
}
