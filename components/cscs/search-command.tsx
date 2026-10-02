"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, FileText, Trophy, User } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { MATCHES, NAV, NAV_SECONDARY, SQUAD, TOURNAMENTS, ZONES } from "@/lib/data";

/** Global jump-to search: pages, scorecards, tournaments and players. */
export function SearchCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search CSCS"
      description="Find pages, scorecards, tournaments and players"
    >
      <CommandInput placeholder="Search matches, players, tournaments…" />
      <CommandList>
        <CommandEmpty>Nothing matches that search.</CommandEmpty>
        <CommandGroup heading="Pages">
          {[...NAV, ...NAV_SECONDARY].map((p) => (
            <CommandItem key={p.link} onSelect={() => go(p.link)}>
              <FileText /> {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Scorecards">
          {MATCHES.map((m) => (
            <CommandItem key={m.id} onSelect={() => go(`/matches/${m.id}`)}>
              <CalendarDays />
              Match {m.id}: {ZONES[m.first].name} v {ZONES[m.second].name}
              <span className="ml-auto text-xs text-muted-foreground">{m.date}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tournaments">
          {TOURNAMENTS.map((t) => (
            <CommandItem key={t.slug} onSelect={() => go("/tournaments")}>
              <Trophy /> {t.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Senior squad">
          {SQUAD.map((p) => (
            <CommandItem key={p.name} onSelect={() => go("/teams")}>
              <User /> {p.name}
              <span className="ml-auto text-xs text-muted-foreground">{p.role}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
