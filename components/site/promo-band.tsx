import Image from "next/image";
import Link from "next/link";
import { GALLERIES } from "@/lib/data";

/** ICC's navy campaign band with a media rail beneath the heading. */
export function PromoBand() {
  return (
    <section className="bg-navy-800 py-12 text-white">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 font-display text-[11.5px] font-bold uppercase tracking-[0.14em]">
          Domestic season 2026-27
        </span>
        <h2 className="mt-4 text-[clamp(1.6rem,3.6vw,2.5rem)] uppercase">Photos from around the state</h2>
        <p className="mt-2.5 max-w-[60ch] text-[14.5px] text-white/70">
          Galleries published by the Sangh across the inter-district season, the Challenger Trophies and the CCPL.
        </p>

        <div className="mt-7 flex gap-4 overflow-x-auto pb-3">
          {GALLERIES.map((g) => (
            <Link key={g.title} href="/photos" className="group w-[232px] shrink-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={g.img}
                  alt=""
                  fill
                  sizes="232px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <h3 className="mt-2.5 font-sans text-[13.5px] font-bold leading-snug tracking-normal group-hover:underline">
                {g.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
