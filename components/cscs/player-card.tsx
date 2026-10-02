import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/demo";
import { Jersey } from "./jersey";

export const surname = (n: string) => n.split(" ").slice(-1)[0];

/** Squad tile: jersey back as the portrait, name, role and leadership tags. */
export function PlayerCard({ p, className }: { p: Player; className?: string }) {
  return (
    <Link href={`/players/${p.slug}`} className={cn("group block overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-lg", className)}>
      <div className="relative bg-neutral-50 px-8 pt-6">
        <Jersey side="back" variant={p.gender === "women" ? "women" : "home"} name={surname(p.name)} number={p.number}
          className="transition-transform duration-300 group-hover:-translate-y-1" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {p.captain ? <Badge>Captain</Badge> : null}
          {p.viceCaptain ? <Badge variant="outline" className="bg-white">Vice-captain</Badge> : null}
        </div>
        <span className="num absolute top-3 right-4 text-sm text-muted-foreground">#{p.number}</span>
      </div>
      <div className="border-t p-4">
        <p className="font-display text-xl font-bold uppercase leading-tight">{p.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{p.role} · {p.district}</p>
      </div>
    </Link>
  );
}
