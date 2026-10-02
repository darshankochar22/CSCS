"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";

type Two = { a: string; b: string };

const cfg = (l: Two): ChartConfig => ({
  a: { label: l.a, color: "var(--chart-1)" },
  b: { label: l.b, color: "var(--chart-3)" },
});

/** Cumulative runs, over by over: the "worm". */
export function WormChart({ data, labels }: { data: { over: number; a?: number; b?: number }[]; labels: Two }) {
  return (
    <ChartContainer config={cfg(labels)} className="aspect-auto h-72 w-full">
      <LineChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="over" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => `After over ${v}`} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="a" stroke="var(--color-a)" strokeWidth={2.5} dot={false} connectNulls={false} />
        <Line dataKey="b" stroke="var(--color-b)" strokeWidth={2.5} strokeDasharray="6 4" dot={false} connectNulls={false} />
      </LineChart>
    </ChartContainer>
  );
}

/** Runs per over for both innings: the "Manhattan". */
export function ManhattanChart({ data, labels }: { data: { over: number; a?: number; b?: number }[]; labels: Two }) {
  return (
    <ChartContainer config={cfg(labels)} className="aspect-auto h-72 w-full">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }} barGap={1}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="over" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={30} />
        <ChartTooltip cursor={{ fill: "var(--accent)" }} content={<ChartTooltipContent labelFormatter={(v) => `Over ${v}`} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="a" fill="var(--color-a)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="b" fill="var(--color-b)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

/** How each innings' runs were made. */
export function RunTypesChart({ data, labels }: { data: { kind: string; a: number; b: number }[]; labels: Two }) {
  return (
    <ChartContainer config={cfg(labels)} className="aspect-auto h-72 w-full">
      <BarChart data={data} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="kind" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={30} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="a" fill="var(--color-a)" radius={4}><LabelList dataKey="a" position="top" fontSize={11} className="fill-foreground" /></Bar>
        <Bar dataKey="b" fill="var(--color-b)" radius={4}><LabelList dataKey="b" position="top" fontSize={11} className="fill-foreground" /></Bar>
      </BarChart>
    </ChartContainer>
  );
}

/** Partnerships, wicket by wicket. */
export function PartnershipChart({ data }: { data: { label: string; runs: number }[] }) {
  const config = { runs: { label: "Runs", color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height: Math.max(180, data.length * 34) }}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 40 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" width={150} tickLine={false} axisLine={false} fontSize={11} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="runs" fill="var(--color-runs)" radius={4} barSize={18}>
          <LabelList dataKey="runs" position="right" fontSize={11} className="fill-foreground" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

/** Run rate by phase (powerplay, middle, death). */
export function PhaseChart({ data, labels }: { data: { phase: string; a: number; b: number }[]; labels: Two }) {
  return (
    <ChartContainer config={cfg(labels)} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="phase" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={30} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="a" fill="var(--color-a)" radius={4}><LabelList dataKey="a" position="top" fontSize={11} className="fill-foreground" /></Bar>
        <Bar dataKey="b" fill="var(--color-b)" radius={4}><LabelList dataKey="b" position="top" fontSize={11} className="fill-foreground" /></Bar>
      </BarChart>
    </ChartContainer>
  );
}

/** Small area sparkline for player form. */
export function FormSpark({ data }: { data: { i: number; v: number }[] }) {
  const config = { v: { label: "Runs", color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="i" tickLine={false} axisLine={false} tickFormatter={(v) => `M${v}`} />
        <YAxis tickLine={false} axisLine={false} width={30} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => `Match ${v}`} />} />
        <Area dataKey="v" type="monotone" fill="var(--color-v)" fillOpacity={0.08} stroke="var(--color-v)" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  );
}
