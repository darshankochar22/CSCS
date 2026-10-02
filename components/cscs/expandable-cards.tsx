"use client";

/**
 * Aceternity "Expandable Card" (standard), adapted from the registry demo so
 * the cards come in as props. Palette reduced to the site's neutrals.
 */
import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { CloseIcon } from "@/components/aceternity/expandable-card-demo-standard";

export type ExpandableCardItem = {
  title: string;
  description: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: React.ReactNode;
};

export function ExpandableCards({ cards }: { cards: ExpandableCardItem[] }) {
  const [active, setActive] = useState<ExpandableCardItem | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] h-full w-full bg-white/70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border bg-white lg:hidden"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-[520px] flex-col overflow-hidden border bg-white shadow-2xl sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              <motion.div layoutId={`image-${active.title}-${id}`} className="grid place-items-center border-b bg-white py-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active.src} alt={active.title} width={160} height={160} className="h-40 w-40 rounded-full border object-cover" />
              </motion.div>
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <motion.h3 layoutId={`title-${active.title}-${id}`} className="font-display text-2xl font-bold uppercase">
                    {active.title}
                  </motion.h3>
                  <motion.p layoutId={`description-${active.title}-${id}`} className="text-neutral-600">
                    {active.description}
                  </motion.p>
                </div>
                <motion.div layoutId={`cta-${active.title}-${id}`}>
                  <Link href={active.ctaLink} className="inline-block rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white">
                    {active.ctaText}
                  </Link>
                </motion.div>
              </div>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-auto px-5 pb-8 text-sm text-neutral-600 [scrollbar-width:none]"
              >
                {active.content}
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="mx-auto w-full gap-2">
        {cards.map((card) => (
          <motion.li
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="flex cursor-pointer flex-col items-center justify-between gap-4 rounded-2xl p-4 hover:bg-neutral-50 md:flex-row"
          >
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.src} alt={card.title} width={56} height={56} className="h-20 w-20 rounded-full border object-cover md:h-14 md:w-14" />
              </motion.div>
              <div>
                <motion.h3 layoutId={`title-${card.title}-${id}`} className="text-center font-display text-xl font-bold uppercase md:text-left">
                  {card.title}
                </motion.h3>
                <motion.p layoutId={`description-${card.title}-${id}`} className="text-center text-sm text-neutral-600 md:text-left">
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.span
              layoutId={`cta-${card.title}-${id}`}
              className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-neutral-900 hover:text-white"
            >
              View record
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
