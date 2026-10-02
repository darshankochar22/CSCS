"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/** Run rate of each innings against the rate the chase needed. */
export function RunRateChart({ rows, required }: {
  rows: { team: string; rate: number }[];
  required: number;
}) {
  const config = { rate: { label: "Runs per over", color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 48 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, "dataMax + 1"]} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="team" width={110} tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ReferenceLine
          x={required}
          stroke="var(--chart-2)"
          strokeDasharray="4 4"
          label={{ value: `Required ${required.toFixed(2)}`, position: "top", fontSize: 11, fill: "var(--chart-2)" }}
        />
        <Bar dataKey="rate" fill="var(--color-rate)" radius={6} barSize={34}>
          <LabelList dataKey="rate" position="right" className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

/** Runs scored and conceded by each zone across the group stage. */
export function RunsForAgainstChart({ rows }: { rows: { zone: string; for: number; against: number }[] }) {
  const config = {
    for: { label: "Runs scored", color: "var(--chart-1)" },
    against: { label: "Runs conceded", color: "var(--chart-3)" },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-auto h-80 w-full">
      <BarChart data={rows} margin={{ top: 24 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="zone" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="for" fill="var(--color-for)" radius={4} />
        <Bar dataKey="against" fill="var(--color-against)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

/** Net run rate, diverging from zero. */
export function NrrChart({ rows }: { rows: { zone: string; nrr: number }[] }) {
  const config = { nrr: { label: "Net run rate", color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 56 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[-1, 1]} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="zone" width={100} tickLine={false} axisLine={false} />
        <ReferenceLine x={0} stroke="var(--chart-2)" />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="nrr" fill="var(--color-nrr)" radius={4} barSize={22}>
          <LabelList dataKey="nrr" position="right" className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
