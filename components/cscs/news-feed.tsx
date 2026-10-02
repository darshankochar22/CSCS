"use client";

import Image from "next/image";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/aceternity/placeholders-and-vanish-input";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { NEWS } from "@/lib/data";

/** Searchable news feed laid out along a scroll-following beam. */
export function NewsFeed() {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");

  const items = NEWS.filter((n) =>
    `${n.title} ${n.tag}`.toLowerCase().includes(applied.trim().toLowerCase()),
  );

  return (
    <div>
      <PlaceholdersAndVanishInput
        placeholders={["Search selections", "Search results", "Search Ayush Pandey", "Search women's cricket"]}
        onChange={(e) => setQuery(e.target.value)}
        onSubmit={(e) => { e.preventDefault(); setApplied(query); }}
      />
      {applied ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "story" : "stories"} for “{applied}”.{" "}
          <Button variant="link" className="h-auto p-0" onClick={() => { setApplied(""); setQuery(""); }}>Show all</Button>
        </p>
      ) : null}

      <div className="mt-14">
        {items.length ? (
          <TracingBeam className="px-6">
            <div className="relative mx-auto max-w-2xl antialiased">
              {items.map((n, i) => (
                <article key={`${n.title}-${i}`} className="mb-16">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{n.tag}</Badge>
                    <span className="text-sm text-muted-foreground">{n.date} · {n.ago} ago</span>
                  </div>
                  <h2 className="mt-4 text-3xl uppercase leading-tight md:text-4xl">{n.title}</h2>
                  <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl border">
                    <Image src={n.img} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
                  </div>
                </article>
              ))}
            </div>
          </TracingBeam>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No stories found</EmptyTitle>
              <EmptyDescription>Try a player&apos;s name, “selection” or “result”.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}
