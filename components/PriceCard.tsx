import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PriceCardProps {
  region: string;
  price: number;
  unit?: string;
  lastUpdated: string;
  trend: "up" | "down" | "stable";
}

export function PriceCard({ region, price, unit = "kg", lastUpdated, trend }: PriceCardProps) {
  // Format price in IDR
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  // Determine trend styles and icons
  let trendText = "Stabil";
  let trendColorClass = "text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 dark:text-zinc-400";
  let trendIcon = <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-1.5 inline-block" />;

  if (trend === "up") {
    trendText = "Naik";
    trendColorClass = "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400";
    trendIcon = <ArrowUpRight className="w-4 h-4 mr-1 stroke-[2.5]" />;
  } else if (trend === "down") {
    trendText = "Turun";
    trendColorClass = "text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400";
    trendIcon = <ArrowDownRight className="w-4 h-4 mr-1 stroke-[2.5]" />;
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-950 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
      {/* Decorative top colored border on hover */}
      <div className={`absolute top-0 left-0 w-full h-[3px] scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
        trend === "up" ? "bg-emerald-500" : trend === "down" ? "bg-rose-500" : "bg-zinc-400"
      }`} />
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {region}
          </CardTitle>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${trendColorClass}`}>
            {trendIcon}
            {trendText}
          </span>
        </div>
        <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center">
          Update: {lastUpdated}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {formattedPrice}
          </span>
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            / {unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
