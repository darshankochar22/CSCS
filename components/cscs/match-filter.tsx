"use client";

import { useState, type ReactNode } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type MatchItem = { id: number; status: "live" | "upcoming" | "completed"; tournament: string; gender: string; card: ReactNode };

/** Live / Fixtures / Results switcher with tournament and gender filters. Cards are server-rendered. */
export function MatchFilter({ items, tournaments }: { items: MatchItem[]; tournaments: { slug: string; name: string }[] }) {
  const hasLive = items.some((i) => i.status === "live");
  const [tab, setTab] = useState(hasLive ? "live" : "upcoming");
  const [tour, setTour] = useState("all");
  const [gender, setGender] = useState("all");

  const rows = items
    .filter((i) => (tab === "live" ? i.status === "live" : tab === "upcoming" ? i.status === "upcoming" : i.status === "completed"))
    .filter((i) => tour === "all" || i.tournament === tour)
    .filter((i) => gender === "all" || i.gender === gender);
  const ordered = tab === "completed" ? [...rows].reverse() : rows;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="upcoming">Fixtures</TabsTrigger>
            <TabsTrigger value="completed">Results</TabsTrigger>
          </TabsList>
        </Tabs>
        <ToggleGroup type="single" variant="outline" value={gender} onValueChange={(v) => setGender(v || "all")}>
          <ToggleGroupItem value="all" className="px-3">All</ToggleGroupItem>
          <ToggleGroupItem value="men" className="px-3">Men</ToggleGroupItem>
          <ToggleGroupItem value="women" className="px-3">Women</ToggleGroupItem>
        </ToggleGroup>
        <Select value={tour} onValueChange={setTour}>
          <SelectTrigger className="w-full sm:w-72"><SelectValue placeholder="All tournaments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tournaments</SelectItem>
            {tournaments.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {ordered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((i) => <div key={i.id}>{i.card}</div>)}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>{tab === "live" ? "No matches live right now" : "Nothing here"}</EmptyTitle>
            <EmptyDescription>Try another tab or filter.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
