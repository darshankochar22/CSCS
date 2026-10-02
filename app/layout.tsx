import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/cscs/site-header";
import { SiteFooter } from "@/components/cscs/site-footer";
import { QuickDock } from "@/components/cscs/quick-dock";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const body = Plus_Jakarta_Sans({
  subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body", display: "swap",
});
const headline = Barlow_Condensed({
  subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-headline", display: "swap",
});
const data = IBM_Plex_Mono({
  subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-data", display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Chhattisgarh State Cricket Sangh", template: "%s · CSCS" },
  description:
    "Scorecards, standings, tournaments and news from the Chhattisgarh State Cricket Sangh's 2026-27 domestic season.",
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${headline.variable} ${data.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-background">
        <TooltipProvider delayDuration={150}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <QuickDock />
          <Toaster position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  );
}
