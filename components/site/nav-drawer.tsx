"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { ChevronRight, X, ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/lib/data";
import { cn } from "@/lib/utils";

export type DrawerLink = { label: string; href: string; external?: boolean };

const LINKS: DrawerLink[] = [
  { label: "Home", href: "/" },
  { label: "Match Centre", href: "/matches" },
  { label: "Standings", href: "/standings" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Teams", href: "/teams" },
  { label: "Grounds", href: "/grounds" },
  { label: "News", href: "/news" },
  { label: "Photos", href: "/photos" },
  { label: "About the Sangh", href: "/about" },
  { label: "Tenders / RFP", href: "/about#tenders" },
  { label: "CSR", href: "/about#csr" },
  { label: "CCPL T20", href: "https://ccplt20.tv/", external: true },
];

export function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-[60] bg-black/45 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex w-[min(92vw,360px)] flex-col bg-white transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <button onClick={onClose} aria-label="Close menu" className="text-navy-800">
            <X className="size-5" />
          </button>
          <Image src="/brand/cscs-logo.png" alt="CSCS" width={92} height={34} className="h-9 w-auto" />
        </div>

        <nav className="flex-1 overflow-y-auto py-1">
          {LINKS.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-between border-b px-5 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.13em] text-navy-800 transition-colors hover:bg-secondary"
              >
                {l.label}
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={onClose}
                className="flex items-center justify-between border-b px-5 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.13em] text-navy-800 transition-colors hover:bg-secondary"
              >
                {l.label}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-4 border-t px-5 py-4">
          {SOCIALS.filter((s) => s.label !== "CCPL T20").map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-full bg-navy-800 font-display text-[11px] font-bold uppercase text-white transition-opacity hover:opacity-85"
            >
              {s.label.slice(0, 2)}
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}
