import * as React from "react";
import { RegionalPriceChecker } from "@/components/RegionalPriceChecker";
import { AdBanner } from "@/components/AdBanner";
import { Metadata } from "next";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cek Harga Regional Hari Ini",
  description: "Cari, saring, dan temukan harga telur ayam ras terupdate di tingkat konsumen dan peternak di berbagai kota dan kabupaten di Indonesia.",
};

export default function HargaRegionalPage() {
  return (
    <main className="flex-1 py-16 bg-zinc-50/50 dark:bg-zinc-950/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Indeks Harga Nasional</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Cek Harga Telur Harian per Wilayah
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
              Gunakan pencarian berbasis wilayah terstruktur untuk melihat rata-rata harga telur terkini di kota atau kabupaten Anda.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href="/" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
          </Button>
        </header>

        {/* Ad Banner Spot */}
        <div className="mb-12">
          <AdBanner slot="harga-regional-top-leaderboard" format="horizontal" />
        </div>

        {/* The Checker Widget */}
        <div className="mb-16">
          <RegionalPriceChecker />
        </div>

        {/* Bottom Ad Banner */}
        <div className="mb-8">
          <AdBanner slot="harga-regional-bottom-horizontal" format="horizontal" />
        </div>

      </div>
    </main>
  );
}
