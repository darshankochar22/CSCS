"use client";

import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type PlayerItem = { id: string; name: string; team: string; role: string; card: ReactNode };

export function PlayerFilter({ items, teams }: { items: PlayerItem[]; teams: { id: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const [team, setTeam] = useState("all");
  const [role, setRole] = useState("all");
  const rows = items.filter(
    (p) => (team === "all" || p.team === team) && (role === "all" || p.role === role) && p.name.toLowerCase().includes(q.trim().toLowerCase()),
  );
  return (
    <div>
      <div className="mb-6 grid gap-3 lg:grid-cols-[280px_1fr]">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players" className="pl-9" />
        </div>
        <ToggleGroup type="single" variant="outline" value={team} onValueChange={(v) => setTeam(v || "all")} className="flex-wrap justify-start">
          <ToggleGroupItem value="all" className="px-3">All teams</ToggleGroupItem>
          {teams.map((t) => <ToggleGroupItem key={t.id} value={t.id} className="px-3">{t.name.replace("Chhattisgarh", "CG")}</ToggleGroupItem>)}
        </ToggleGroup>
      </div>
      <ToggleGroup type="single" size="sm" variant="outline" value={role} onValueChange={(v) => setRole(v || "all")} className="mb-6 flex-wrap justify-start">
        {["all", "Batter", "Bowler", "All-rounder", "Wicket-keeper"].map((r) => (
          <ToggleGroupItem key={r} value={r} className="px-3">{r === "all" ? "All roles" : r}</ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="mb-4 text-sm text-muted-foreground">{rows.length} players</p>
      {rows.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{rows.map((p) => <div key={p.id}>{p.card}</div>)}</div>
      ) : (
        <Empty className="border"><EmptyHeader><EmptyTitle>No players found</EmptyTitle><EmptyDescription>Try another name or filter.</EmptyDescription></EmptyHeader></Empty>
      )}
    </div>
  );
}
