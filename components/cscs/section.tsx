import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({ id, children, className, bordered = true }: {
  id?: string; children: ReactNode; className?: string; bordered?: boolean;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-28 py-16 sm:py-24", bordered && "border-t", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, blurb, aside, className }: {
  eyebrow?: string; title: ReactNode; blurb?: ReactNode; aside?: ReactNode; className?: string;
}) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-2 text-[clamp(2rem,4.4vw,3.25rem)] uppercase">{title}</h2>
        {blurb ? <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{blurb}</p> : null}
      </div>
      {aside}
    </div>
  );
}

/** Inner-page banner: breadcrumb trail, eyebrow and a big uppercase title. */
export function PageHeader({ eyebrow, title, blurb, crumbs, children }: {
  eyebrow?: string;
  title: ReactNode;
  blurb?: ReactNode;
  crumbs: { name: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="pt-10 pb-12 sm:pt-14 sm:pb-16">
      <Container>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((c, i) => (
              <span key={c.name} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {c.href && i < crumbs.length - 1 ? (
                    <BreadcrumbLink asChild><Link href={c.href}>{c.name}</Link></BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        {eyebrow ? <p className="eyebrow mt-8">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-[18ch] text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.95]">{title}</h1>
        {blurb ? <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted-foreground">{blurb}</p> : null}
        {children}
      </Container>
    </header>
  );
}
