"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/aceternity/canvas-reveal-effect";

/** Stat tile whose dotted canvas reveals on hover (Aceternity Canvas Reveal Effect). */
export function RevealStat({ value, label }: { value: string | number; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl border bg-white p-5"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-white"
              colors={[[212, 212, 212], [229, 229, 229]]}
              dotSize={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <p className="num relative z-10 text-5xl font-semibold tracking-tight">{value}</p>
      <p className="eyebrow relative z-10 mt-2 text-[11px]">{label}</p>
    </div>
  );
}
