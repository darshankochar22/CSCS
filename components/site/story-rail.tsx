import Image from "next/image";
import Link from "next/link";
import { NEWS } from "@/lib/data";

/** The four-across card row ICC runs directly beneath the lead story. */
export function StoryRail() {
  return (
    <section className="bg-navy-800 pb-10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {NEWS.slice(1, 5).map((n) => (
            <Link key={n.title} href="/news" className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                <Image
                  src={n.img}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.15em] text-white/60">
                {n.tag}
              </p>
              <h3 className="mt-1 font-sans text-[14px] font-bold leading-snug tracking-normal text-white group-hover:underline">
                {n.title}
              </h3>
              <p className="num mt-1.5 text-[12px] text-white/50">{n.ago}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
