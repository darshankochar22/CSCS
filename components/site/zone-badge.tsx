import Image from "next/image";
import { ZONES, type ZoneKey } from "@/lib/data";
import { cn } from "@/lib/utils";

/** The Sangh's own zone crest, used wherever ICC would show a national flag. */
export function ZoneBadge({ zone, size = 28, className }: { zone: ZoneKey; size?: number; className?: string }) {
  const z = ZONES[zone];
  return (
    <Image
      src={z.badge}
      alt={`${z.name} crest`}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
