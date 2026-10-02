"use client";

import { useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TOURNAMENTS, type AgeGroup } from "@/lib/data";

const GROUPS: AgeGroup[] = ["SENIOR", "UNDER-23", "UNDER-19", "UNDER-16", "UNDER-15"];
const label = (g: string) => g.charAt(0) + g.slice(1).toLowerCase().replace("under", "Under");

export function TournamentExplorer() {
  const [gender, setGender] = useState("all");
  const [groups, setGroups] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      TOURNAMENTS.filter((t) => gender === "all" || t.gender === gender).filter(
        (t) => !groups.length || groups.includes(t.group),
      ),
    [gender, groups],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Tabs value={gender} onValueChange={setGender}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="men">Men</TabsTrigger>
            <TabsTrigger value="women">Women</TabsTrigger>
          </TabsList>
        </Tabs>
        <ToggleGroup type="multiple" variant="outline" size="sm" value={groups} onValueChange={setGroups} className="flex-wrap">
          {GROUPS.map((g) => (
            <ToggleGroupItem key={g} value={g} className="px-3">{label(g)}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {rows.length ? (
        <ItemGroup className="gap-2">
          {rows.map((t) => (
            <Item key={t.slug} variant="outline">
              <ItemMedia variant="icon"><CalendarRange /></ItemMedia>
              <ItemContent>
                <ItemTitle className="text-[15px]">{t.title}</ItemTitle>
                <ItemDescription>
                  {t.start} to {t.end} · {t.matches} matches
                </ItemDescription>
              </ItemContent>
              <ItemActions className="hidden gap-2 sm:flex">
                <Badge variant="outline">{label(t.group)}</Badge>
                <Badge variant={t.status === "UPCOMING" ? "default" : "secondary"} className="border-border">
                  {t.status === "UPCOMING" ? "On now" : "Completed"}
                </Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No tournaments</EmptyTitle>
            <EmptyDescription>Nothing matches those filters this season.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
