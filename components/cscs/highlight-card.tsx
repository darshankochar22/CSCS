"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "@/components/aceternity/animated-modal";
import { Badge } from "@/components/ui/badge";

export type HighlightView = { id: number; matchId: number; title: string; duration: string; img: string; moments: string[]; when: string; tournament: string };

/** Video-style highlight tile; opens a lightbox with the reel and its key moments. */
export function HighlightCard({ h, large = false }: { h: HighlightView; large?: boolean }) {
  return (
    <Modal>
      <ModalTrigger className="group block w-full p-0 text-left">
        <div className={`relative overflow-hidden rounded-2xl border ${large ? "aspect-[16/9]" : "aspect-video"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={h.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
            <Play className="ml-0.5 size-6 fill-neutral-900 text-neutral-900" />
          </span>
          <Badge className="num absolute right-3 bottom-3 bg-white text-neutral-900">{h.duration}</Badge>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{h.tournament} · {h.when}</p>
        <p className={`mt-1 font-semibold leading-snug ${large ? "text-xl" : ""}`}>{h.title}</p>
      </ModalTrigger>
      <ModalBody className="border-neutral-200 shadow-2xl md:max-w-4xl">
        <ModalContent>
          <p className="eyebrow">{h.tournament}</p>
          <h3 className="mt-1 text-3xl uppercase">{h.title}</h3>
          <div className="relative mt-5 aspect-video overflow-hidden rounded-xl border bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-xl">
              <Play className="ml-1 size-7 fill-neutral-900 text-neutral-900" />
            </span>
            <span className="num absolute right-3 bottom-3 rounded bg-white px-2 py-0.5 text-xs font-semibold">{h.duration}</span>
          </div>
          <p className="mt-6 eyebrow text-[11px]">In this reel</p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {h.moments.map((m, i) => (
              <li key={i} className="flex gap-3 rounded-lg border px-3 py-2 text-sm">
                <span className="num text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>{m}
              </li>
            ))}
          </ol>
          <Link href={`/matches/${h.matchId}`} className="mt-5 inline-block text-sm font-semibold underline underline-offset-4">Full scorecard</Link>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
