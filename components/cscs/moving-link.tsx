"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button as MovingBorderButton } from "@/components/aceternity/moving-border";
import { cn } from "@/lib/utils";

/** Aceternity Moving Border, rendered as a Next.js link — the primary CTA style. */
export function MovingLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <MovingBorderButton
      as={Link}
      href={href}
      borderRadius="9999px"
      containerClassName={cn("h-12 w-52", className)}
      className="border-neutral-200 bg-white font-semibold text-neutral-900"
    >
      {children}
    </MovingBorderButton>
  );
}
