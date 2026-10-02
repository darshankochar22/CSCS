import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { teamById, type Match } from "@/lib/demo";
import { fmtDate, fmtTime, inningsOf, liveLine, matchMeta, oversOf, scoreText } from "@/lib/demo/format";

export function TeamMark({ teamId, size = 32, className }: { teamId: string; size?: number; className?: string }) {
  const t = teamById(teamId);
  const home = t.id.startsWith("cg-");
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full border font-display font-bold",
        home ? "border-neutral-900 bg-neutral-900 text-white" : "bg-white text-neutral-900",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-hidden
    >
      {t.short.split(/[\s-]/)[0]}
    </span>
  );
}

export function StatusBadge({ m }: { m: Match }) {
  if (m.status === "live") {
    return (
      <Badge className="gap-1.5">
        <span className="size-1.5 animate-pulse rounded-full bg-white" /> Live
      </Badge>
    );
  }
  if (m.status === "upcoming") return <Badge variant="outline">{fmtDate(m.date, { day: "numeric", month: "short" })} · {fmtTime(m.date)}</Badge>;
  return <Badge variant="secondary" className="border-border">Result</Badge>;
}

/** Compact match tile used in strips, lists and team pages. */
export function MatchCard({ m, className }: { m: Match; className?: string }) {
  const { label, venue } = matchMeta(m);
  const rows = [m.home, m.away];
  const footer =
    m.status === "live" ? liveLine(m) : m.status === "completed" ? m.result : `${venue.name}, ${venue.city}`;
  return (
    <Link
      href={`/matches/${m.id}`}
      className={cn("group flex h-full flex-col rounded-2xl border bg-white p-4 transition-shadow hover:shadow-md", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
        <StatusBadge m={m} />
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((id) => {
          const inn = inningsOf(m, id);
          const won = m.winner === id;
          return (
            <div key={id} className="flex items-center gap-2.5">
              <TeamMark teamId={id} size={28} />
              <span className={cn("min-w-0 flex-1 truncate text-sm", won ? "font-semibold" : m.winner ? "text-muted-foreground" : "font-medium")}>
                {teamById(id).name}
              </span>
              {inn ? (
                <span className="num text-sm">
                  <span className={cn(won && "font-semibold")}>{scoreText(inn)}</span>
                  <span className="ml-1 text-xs text-muted-foreground">({oversOf(inn)})</span>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-3 line-clamp-1 border-t pt-3 text-xs text-muted-foreground">{footer}</p>
    </Link>
  );
}
