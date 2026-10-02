import { HIGHLIGHTS, matchById, tournamentBySlug } from "./index";
import { fmtDate } from "./format";
import type { HighlightView } from "@/components/cscs/highlight-card";

export function highlightViews(): HighlightView[] {
  return HIGHLIGHTS.map((h) => ({
    ...h,
    when: fmtDate(h.date.slice(0, 10)),
    tournament: tournamentBySlug(matchById(h.matchId)!.tournament)!.short,
  }));
}
