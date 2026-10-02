import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MatchCard } from "./match-card";
import { FIXTURES, LIVE, RESULTS } from "@/lib/demo";

/** BCCI/ICC-style strip of live, next and recent matches at the top of the home page. */
export function ScoreStrip() {
  const items = [...LIVE, ...FIXTURES.slice(0, 3), ...RESULTS.slice(0, 6)];
  return (
    <section aria-label="Scores" className="border-b bg-white py-4">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow text-[11px]">Live · Fixtures · Results</p>
          <Link href="/matches" className="flex items-center gap-1 text-sm font-medium hover:underline">All matches <ChevronRight className="size-4" /></Link>
        </div>
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-3">
            {items.map((m) => (
              <CarouselItem key={m.id} className="basis-[85%] pl-3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <MatchCard m={m} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 hidden bg-white md:flex" />
          <CarouselNext className="-right-3 hidden bg-white md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
