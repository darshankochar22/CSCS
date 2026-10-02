import Image from "next/image";
import Link from "next/link";
import { NEWS } from "@/lib/data";

/** ICC's circular-thumbnail rail. Short captions, horizontal scroll. */
export function TopStories() {
  const items = [...NEWS, ...NEWS.slice(0, 2)];
  return (
    <section className="border-b bg-white py-9">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <h2 className="font-display text-lg uppercase tracking-[0.13em] text-navy-800">Top stories</h2>
        <div className="mt-5 flex gap-5 overflow-x-auto pb-2">
          {items.map((n, i) => (
            <Link key={`${n.title}-${i}`} href="/news" className="group flex w-[112px] shrink-0 flex-col items-center text-center">
              <div className="relative size-[86px] overflow-hidden rounded-full ring-2 ring-navy-800/10 transition-all group-hover:ring-navy-800/40">
                <Image src={n.img} alt="" fill sizes="86px" className="object-cover" />
              </div>
              <p className="mt-2.5 line-clamp-3 text-[12.5px] font-semibold leading-snug text-navy-800 group-hover:underline">
                {n.title.split(":")[0].split("—")[0].trim().slice(0, 44)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
