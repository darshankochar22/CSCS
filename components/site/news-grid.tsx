import { ArrowUpRight } from "lucide-react";
import { NEWS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/magicui/blur-fade";

export function NewsGrid({ limit }: { limit?: number }) {
  const list = limit ? NEWS.slice(0, limit) : NEWS;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((n, i) => (
        <BlurFade key={n.title} inView delay={i * 0.06}>
          <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-royal/40 hover:shadow-lg hover:shadow-royal/5">
            <CardContent className="pt-0">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary" className="font-display text-[10.5px] tracking-[0.13em]">{n.tag}</Badge>
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-royal" />
              </div>
              <time className="num mt-3 block text-[11.5px] text-muted-foreground">{n.date}</time>
              <h3 className="mt-2 font-sans text-[1.1rem] font-bold leading-snug tracking-normal text-navy-800">
                {n.title}
              </h3>
            </CardContent>
          </Card>
        </BlurFade>
      ))}
    </div>
  );
}
