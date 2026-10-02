import type { Metadata } from "next";
import { PointerHighlight } from "@/components/aceternity/pointer-highlight";
import { PageHeader, Section } from "@/components/cscs/section";
import { NewsFeed } from "@/components/cscs/news-feed";

export const metadata: Metadata = { title: "News", description: "Announcements from the Chhattisgarh State Cricket Sangh." };

export default function NewsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "News" }]}
        eyebrow="Announcements"
        title={
          <>
            News from{" "}
            <PointerHighlight containerClassName="inline-block" pointerClassName="text-neutral-900">
              <span className="px-2">the Sangh</span>
            </PointerHighlight>
          </>
        }
        blurb="Selections, results and notices, newest first. Search by player, team or topic."
      />
      <Section>
        <NewsFeed />
      </Section>
    </>
  );
}
