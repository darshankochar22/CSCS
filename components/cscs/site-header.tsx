"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { StickyBanner } from "@/components/aceternity/sticky-banner";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/aceternity/resizable-navbar";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SearchCommand } from "./search-command";
import { NAV, NAV_SECONDARY, TOURNAMENTS } from "@/lib/data";

const LIVE = TOURNAMENTS.find((t) => t.status === "UPCOMING");

function Logo() {
  return (
    <Link href="/" className="relative z-20 flex shrink-0 items-center gap-2.5 px-2 py-1" aria-label="CSCS home">
      <Image src="/brand/cscs-logo.png" alt="" width={86} height={32} priority className="h-8 w-auto" style={{ width: "auto" }} />
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {LIVE ? (
        <StickyBanner className="relative min-h-11 border-b bg-white text-neutral-900">
          <p className="mx-0 max-w-[88%] text-center text-[13px]">
            <span className="mr-2 inline-flex items-center gap-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.16em]">
              <span className="size-1.5 animate-pulse rounded-full bg-neutral-900" /> On now
            </span>
            {LIVE.title}, {LIVE.start} to {LIVE.end}.{" "}
            <Link href="/tournaments" className="font-medium underline underline-offset-4 hover:no-underline">
              See the calendar
            </Link>
          </p>
        </StickyBanner>
      ) : null}

      <Navbar className="top-0 z-50 pt-2">
        <NavBody className="bg-white/90">
          <Logo />
          <NavItems items={NAV.slice(0, 6)} className="text-[13px]" />
          <div className="relative z-20 flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="size-4" />
              <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
            </button>
            <NavbarButton as={Link} href="/register" variant="dark" className="rounded-full">
              Register
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav className="bg-white/90">
          <MobileNavHeader>
            <Logo />
            <div className="flex items-center gap-3">
              <button aria-label="Search" onClick={() => setSearchOpen(true)} className="p-1">
                <Search className="size-5" />
              </button>
              <MobileNavToggle isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
            </div>
          </MobileNavHeader>
          <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            {[...NAV, ...NAV_SECONDARY].map((item) => (
              <Link
                key={item.link}
                href={item.link}
                onClick={() => setMenuOpen(false)}
                className="w-full font-display text-xl font-semibold uppercase tracking-[0.06em]"
              >
                {item.name}
              </Link>
            ))}
            <NavbarButton as={Link} href="/register" variant="dark" onClick={() => setMenuOpen(false)} className="mt-2 w-full rounded-full">
              Register for trials
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
