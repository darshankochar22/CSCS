import { SQUAD, STAFF } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/magicui/blur-fade";

export function SquadGrid() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SQUAD.map((p, i) => (
          <BlurFade key={p.name} inView delay={Math.min(i * 0.03, 0.4)}>
            <Card className="h-full py-4 transition-all hover:-translate-y-0.5 hover:border-royal/40 hover:shadow-md">
              <CardContent className="px-4">
                <p className="text-[15px] font-bold leading-tight text-navy-800">{p.name}</p>
                <p className="mt-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  {p.role}
                </p>
                {p.note ? <p className="mt-2 text-[11.5px] font-semibold text-royal">{p.note}</p> : null}
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>

      <h3 id="staff" className="mt-12 scroll-mt-24 font-display text-sm font-semibold uppercase tracking-[0.16em] text-royal">
        Support staff
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAFF.map((p, i) => (
          <BlurFade key={p.name} inView delay={i * 0.05}>
            <div className="rounded-xl border bg-secondary p-4">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-royal">{p.role}</p>
              <p className="mt-1 text-[15px] font-bold text-navy-800">{p.name}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </>
  );
}
