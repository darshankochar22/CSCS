"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ZoneBadge } from "./zone-badge";
import { MATCHES, ZONES, type ZoneKey } from "@/lib/data";

const MATCH_DAYS = [...new Set(MATCHES.map((m) => m.date))].map((d) => new Date(`${d} 12:00`));
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function ZoneFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={(v) => onChange(v || "ALL")}
      className="flex-wrap"
    >
      <ToggleGroupItem value="ALL" className="px-4">All zones</ToggleGroupItem>
      {(Object.keys(ZONES) as ZoneKey[]).map((z) => (
        <ToggleGroupItem key={z} value={z} className="px-4">{ZONES[z].name}</ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function MatchExplorer() {
  const [zone, setZone] = useState<string>("ALL");
  const [day, setDay] = useState<Date | undefined>();

  const rows = useMemo(
    () =>
      MATCHES.filter((m) => zone === "ALL" || m.first === zone || m.second === zone).filter(
        (m) => !day || sameDay(new Date(`${m.date} 12:00`), day),
      ),
    [zone, day],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="hidden md:block"><ZoneFilter value={zone} onChange={setZone} /></div>
          {/* Mobile: filters live in a bottom drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="rounded-full md:hidden"><ListFilter /> Filter by zone</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter results</DrawerTitle>
                <DrawerDescription>Show matches involving one zone.</DrawerDescription>
              </DrawerHeader>
              <div className="px-4"><ZoneFilter value={zone} onChange={setZone} /></div>
              <DrawerFooter>
                <DrawerClose asChild><Button>Show {rows.length} matches</Button></DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          {day || zone !== "ALL" ? (
            <Button variant="ghost" size="sm" onClick={() => { setZone("ALL"); setDay(undefined); }}>
              Clear filters
            </Button>
          ) : null}
        </div>

        {rows.length ? (
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Match</TableHead>
                  <TableHead>Batting first</TableHead>
                  <TableHead>Chasing</TableHead>
                  <TableHead className="hidden sm:table-cell">Result</TableHead>
                  <TableHead className="w-10 pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((m) => (
                  <TableRow key={m.id} className="group relative">
                    <TableCell className="pl-5">
                      <Link href={`/matches/${m.id}`} className="after:absolute after:inset-0">
                        <span className="num font-semibold">{m.id}</span>
                      </Link>
                      <span className="block text-xs text-muted-foreground">{m.date}</span>
                    </TableCell>
                    {([[m.first, m.firstScore, m.firstOvers], [m.second, m.secondScore, m.secondOvers]] as const).map(([z, s, o]) => (
                      <TableCell key={z}>
                        <span className="flex items-center gap-2.5">
                          <ZoneBadge zone={z} size={26} />
                          <span>
                            <span className={z === m.winner ? "font-semibold" : "text-muted-foreground"}>{ZONES[z].short}</span>
                            <span className="num ml-2">{s}</span>
                            <span className="num block text-xs text-muted-foreground">{o} ov</span>
                          </span>
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{ZONES[m.winner].short} by {m.margin}</Badge>
                    </TableCell>
                    <TableCell className="pr-5">
                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No matches</EmptyTitle>
              <EmptyDescription>No fixture fits those filters. Try another zone or date.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      <Card className="h-fit gap-3">
        <CardHeader>
          <CardTitle>Fixture calendar</CardTitle>
          <CardDescription>Bold dates had matches. Pick one to filter.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center px-2">
          <Calendar
            mode="single"
            selected={day}
            onSelect={setDay}
            defaultMonth={new Date(2026, 4, 1)}
            modifiers={{ match: MATCH_DAYS }}
            modifiersClassNames={{ match: "font-bold underline underline-offset-4" }}
            disabled={(d) => !MATCH_DAYS.some((md) => sameDay(md, d))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
