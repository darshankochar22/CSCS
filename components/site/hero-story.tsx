import Image from "next/image";
import Link from "next/link";
import { NEWS } from "@/lib/data";

/** ICC's lead story: full-bleed image, gradient scrim, category, headline, time. */
export function HeroStory() {
  const lead = NEWS[0];
  return (
    <section className="relative bg-navy-800">
      <Link href="/news" className="group block">
        <div className="relative h-[clamp(320px,52vw,560px)] w-full overflow-hidden">
          <Image
            src="/gallery/25.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%] transition-transform duration-[900ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/55 to-navy-800/10" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-[1400px] px-5 pb-8 sm:px-8 sm:pb-12">
              <p className="font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80">
                {lead.tag}
              </p>
              <h1 className="mt-2 max-w-[22ch] text-[clamp(1.6rem,4.2vw,3rem)] uppercase leading-[1.02] text-white">
                {lead.title}
              </h1>
              <p className="num mt-2.5 text-[13px] text-white/65">{lead.ago}</p>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
