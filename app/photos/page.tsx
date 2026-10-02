import type { Metadata } from "next";
import { ImagesSlider } from "@/components/aceternity/images-slider";
import { LayoutGrid } from "@/components/aceternity/layout-grid";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";
import { PageHeader, Section, SectionHeader } from "@/components/cscs/section";
import { AlbumTile } from "@/components/cscs/album-tile";
import { GALLERIES, NEWS, PHOTOS } from "@/lib/data";

export const metadata: Metadata = { title: "Photos", description: "Galleries published by the Chhattisgarh State Cricket Sangh." };

const HIGHLIGHTS = NEWS.slice(0, 4).map((n, i) => ({
  id: i + 1,
  className: i === 0 || i === 3 ? "md:col-span-2" : "col-span-1",
  thumbnail: n.img,
  content: (
    <div key={n.title}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{n.tag} · {n.date}</p>
      <p className="mt-2 max-w-lg font-display text-3xl font-bold uppercase leading-tight text-white">{n.title}</p>
    </div>
  ),
}));

export default function PhotosPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Photos" }]}
        eyebrow="Galleries"
        title="Photos"
        blurb="Images published by the Sangh across the inter-district season, the challenger trophies and the CCPL."
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <ImagesSlider
          images={PHOTOS.slice(0, 7).map((p) => p.src)}
          className="mx-auto h-[60vh] max-w-[1280px] rounded-3xl border"
          overlayClassName="bg-transparent"
        >
          <div className="absolute bottom-6 left-6 z-50 max-w-sm rounded-2xl border bg-white/95 p-5 backdrop-blur">
            <p className="eyebrow text-[11px]">Featured</p>
            <p className="mt-1 font-display text-2xl font-bold uppercase leading-tight">The season so far</p>
            <p className="mt-1 text-sm text-muted-foreground">Use the arrow keys to move through the photos.</p>
          </div>
        </ImagesSlider>
      </div>

      <Section bordered={false}>
        <SectionHeader eyebrow="Albums" title="Browse the galleries" blurb="Open any album to see it full size." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERIES.map((g) => <AlbumTile key={g.title} title={g.title} src={g.img} />)}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="From the news desk" title="Highlights" blurb="Click a photo to expand it in place." />
        <div className="h-[56rem] md:h-[44rem]">
          <LayoutGrid cards={HIGHLIGHTS} />
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Every photo" title="The wall" blurb="Scroll inside the wall: the columns move in opposite directions." />
        <ParallaxScroll images={[...PHOTOS, ...PHOTOS].map((p) => p.src)} className="rounded-3xl border" />
      </Section>
    </>
  );
}
