import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { anyPlayer, econ, ov, playerById, sr, teamById } from "@/lib/demo";
import type { Innings } from "@/lib/demo/sim";
import { oversOf } from "@/lib/demo/format";

function Abbr({ s, l }: { s: string; l: string }) {
  return (
    <Tooltip>
      <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">{s}</TooltipTrigger>
      <TooltipContent>{l}</TooltipContent>
    </Tooltip>
  );
}

export function PlayerLink({ id, className }: { id: string; className?: string }) {
  const p = playerById.get(id);
  const name = p?.name ?? anyPlayer(id)?.name ?? id;
  const tag = p ? `${p.captain ? " (c)" : ""}${p.wk ? " †" : ""}` : "";
  return p ? (
    <Link href={`/players/${p.slug}`} className={className ?? "font-medium underline-offset-4 hover:underline"}>{name}{tag}</Link>
  ) : (
    <span className={className ?? "font-medium"}>{name}</span>
  );
}

export function Scorecard({ inn }: { inn: Innings }) {
  const batted = inn.batting.filter((b) => b.didBat);
  const dnb = inn.batting.filter((b) => !b.didBat);
  const extras = inn.extras.wides + inn.extras.noballs + inn.extras.byes + inn.extras.legbyes;
  return (
    <div className="space-y-5">
      <Card className="gap-0 py-0">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-display text-xl font-bold uppercase">{teamById(inn.battingTeam).name} batting</h3>
          <p className="num font-semibold">{inn.runs}/{inn.wickets} <span className="text-sm font-normal text-muted-foreground">({oversOf(inn)} ov)</span></p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Batter</TableHead>
              <TableHead className="hidden md:table-cell" />
              <TableHead className="text-right"><Abbr s="R" l="Runs" /></TableHead>
              <TableHead className="text-right"><Abbr s="B" l="Balls faced" /></TableHead>
              <TableHead className="text-right">4s</TableHead>
              <TableHead className="text-right">6s</TableHead>
              <TableHead className="pr-5 text-right"><Abbr s="SR" l="Strike rate: runs per 100 balls" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batted.map((b) => (
              <TableRow key={b.playerId}>
                <TableCell className="pl-5">
                  <PlayerLink id={b.playerId} />
                  <span className="block text-xs text-muted-foreground md:hidden">{b.dismissal ?? "not out"}</span>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{b.dismissal ?? "not out"}</TableCell>
                <TableCell className="num text-right font-semibold">{b.runs}{b.dismissal ? "" : "*"}</TableCell>
                <TableCell className="num text-right">{b.balls}</TableCell>
                <TableCell className="num text-right">{b.fours}</TableCell>
                <TableCell className="num text-right">{b.sixes}</TableCell>
                <TableCell className="num pr-5 text-right">{sr(b.runs, b.balls)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-white">
            <TableRow>
              <TableCell className="pl-5">Extras</TableCell>
              <TableCell colSpan={6} className="pr-5 text-right text-sm text-muted-foreground md:text-left">
                <span className="num font-semibold text-foreground">{extras}</span> (w {inn.extras.wides}, nb {inn.extras.noballs}, lb {inn.extras.legbyes})
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-5 font-semibold">Total</TableCell>
              <TableCell colSpan={6} className="num pr-5 text-right font-semibold md:text-left">
                {inn.runs}/{inn.wickets} <span className="font-normal text-muted-foreground">({oversOf(inn)} overs, RR {econ(inn.runs, inn.legalBalls)})</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {dnb.length ? (
          <p className="border-t px-5 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Did not bat: </span>
            {dnb.map((b, i) => <span key={b.playerId}>{i ? ", " : ""}<PlayerLink id={b.playerId} className="hover:underline" /></span>)}
          </p>
        ) : null}
        {inn.fow.length ? (
          <p className="border-t px-5 py-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Fall of wickets: </span>
            {inn.fow.map((f) => `${f.runs}-${f.wicket} (${anyPlayer(f.playerId)?.name}, ${f.over})`).join(", ")}
          </p>
        ) : null}
      </Card>

      <Card className="gap-0 py-0">
        <div className="border-b px-5 py-4">
          <h3 className="font-display text-xl font-bold uppercase">{teamById(inn.bowlingTeam).name} bowling</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Bowler</TableHead>
              <TableHead className="text-right"><Abbr s="O" l="Overs" /></TableHead>
              <TableHead className="text-right"><Abbr s="M" l="Maidens" /></TableHead>
              <TableHead className="text-right"><Abbr s="R" l="Runs conceded" /></TableHead>
              <TableHead className="text-right"><Abbr s="W" l="Wickets" /></TableHead>
              <TableHead className="text-right"><Abbr s="Econ" l="Economy: runs per over" /></TableHead>
              <TableHead className="hidden pr-5 text-right sm:table-cell"><Abbr s="0s" l="Dot balls" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inn.bowling.map((b) => (
              <TableRow key={b.playerId}>
                <TableCell className="pl-5"><PlayerLink id={b.playerId} /></TableCell>
                <TableCell className="num text-right">{ov(b.balls)}</TableCell>
                <TableCell className="num text-right">{b.maidens}</TableCell>
                <TableCell className="num text-right">{b.runs}</TableCell>
                <TableCell className="num text-right font-semibold">{b.wickets}</TableCell>
                <TableCell className="num text-right">{econ(b.runs, b.balls)}</TableCell>
                <TableCell className="num hidden pr-5 text-right sm:table-cell">{b.dots}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
