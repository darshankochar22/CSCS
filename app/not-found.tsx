import Link from "next/link";
import { Boxes } from "@/components/aceternity/background-boxes";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-white [mask-image:radial-gradient(transparent,white)]" />
      <Boxes />
      <Empty className="pointer-events-none relative z-30">
        <EmptyHeader>
          <p className="num text-7xl font-semibold">404</p>
          <EmptyTitle className="font-display text-3xl uppercase">Out of the ground</EmptyTitle>
          <EmptyDescription>That page doesn&apos;t exist. It may have moved, or the link may be wrong.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="pointer-events-auto">
          <Button asChild className="rounded-full"><Link href="/">Back to the home page</Link></Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
