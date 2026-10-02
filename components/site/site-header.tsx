"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Search, User, ChevronDown } from "lucide-react";
import { NavDrawer } from "./nav-drawer";

/** ICC's header shape: burger left, centred crest, search + account right. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-navy-800 text-white">
        <div className="relative mx-auto flex h-[60px] max-w-[1400px] items-center px-4 sm:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="rounded p-1.5 transition-colors hover:bg-white/10"
          >
            <Menu className="size-[22px]" />
          </button>

          <Link
            href="/"
            aria-label="CSCS home"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2"
          >
            <Image
              src="/brand/cscs-logo.png"
              alt="Chhattisgarh State Cricket Sangh"
              width={104}
              height={38}
              priority
              className="h-[38px] w-auto brightness-0 invert"
            />
            <ChevronDown className="size-4 text-white/70" />
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <button className="hidden items-center gap-2 rounded px-2.5 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-white/10 sm:flex">
              Search <Search className="size-4" />
            </button>
            <button aria-label="Search" className="rounded p-1.5 transition-colors hover:bg-white/10 sm:hidden">
              <Search className="size-[20px]" />
            </button>
            <button aria-label="Account" className="rounded p-1.5 transition-colors hover:bg-white/10">
              <User className="size-[20px]" />
            </button>
          </div>
        </div>
      </header>

      <NavDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
