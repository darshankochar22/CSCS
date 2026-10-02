"use client";

import { CalendarDays, Camera, House, ListOrdered, Mail, Trophy } from "lucide-react";
import { FloatingDock } from "@/components/aceternity/floating-dock";

const ICON = "h-full w-full text-neutral-700";

const ITEMS = [
  { title: "Home", href: "/", icon: <House className={ICON} /> },
  { title: "Scores", href: "/matches", icon: <CalendarDays className={ICON} /> },
  { title: "Standings", href: "/standings", icon: <ListOrdered className={ICON} /> },
  { title: "Tournaments", href: "/tournaments", icon: <Trophy className={ICON} /> },
  { title: "Photos", href: "/photos", icon: <Camera className={ICON} /> },
  { title: "Contact", href: "/contact", icon: <Mail className={ICON} /> },
];

/** Quick links pinned to the bottom of every page. */
export function QuickDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-end px-4 md:justify-center">
      <div className="pointer-events-auto">
        <FloatingDock items={ITEMS} />
      </div>
    </div>
  );
}
