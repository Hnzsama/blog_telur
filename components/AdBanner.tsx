"use client"

import * as React from "react";

interface AdBannerProps {
  slot: string;
  format?: string;
  responsive?: string;
  className?: string;
  type?: "horizontal" | "vertical" | "square" | "card";
}

export function AdBanner({ 
  slot, 
  format = "auto", 
  responsive = "true", 
  className = "",
  type = "horizontal"
}: AdBannerProps) {
  
  React.useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      // Quietly ignore if blocked by adblockers
    }
  }, []);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-mock-9876543210";

  // Dimensions styling class based on type
  const dims = {
    horizontal: "min-h-[100px] w-full my-6",
    vertical: "min-h-[500px] w-full max-w-[300px] my-4",
    square: "min-h-[250px] w-full max-w-[336px] my-4",
    card: "h-full min-h-[380px] w-full"
  }[type];

  // Card container classes matching site cards
  const containerClasses = type === "card"
    ? "border border-zinc-200/85 dark:border-zinc-800/85 bg-white dark:bg-zinc-900 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 rounded-2xl text-left"
    : "border border-dashed border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl py-5 px-6 text-center";

  return (
    <div className={`adsbygoogle ad-banner ad-container relative flex flex-col items-center justify-center overflow-hidden mx-auto ${containerClasses} ${dims} ${className}`}>
      
      {/* Real Google AdSense Tag */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%", minHeight: "90px" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      
      {/* 
        Mockup ad container content.
        This renders as a fallback premium ad when Google AdSense script hasn't loaded real ads.
        Since the outermost wrapper has classes "adsbygoogle", "ad-banner", and "ad-container",
        an ad blocker will set "display: none !important" to the outer wrapper,
        completely removing this entire block (including the mock creative) from the layout!
      */}
      {type === "card" ? (
        <div className="absolute inset-0 flex flex-col z-0 pointer-events-none">
          {/* Mock Aspect-Video Header Image */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white border-b border-zinc-200 dark:border-zinc-850">
            <div className="text-center p-4">
              <span className="text-[9px] uppercase font-black bg-black/30 border border-white/20 px-2 py-0.5 rounded-full text-white/90 tracking-widest">
                Iklan Sponsor
              </span>
              <p className="text-sm font-extrabold mt-2 drop-shadow-sm">Mitra Peternak Terpercaya</p>
            </div>
          </div>
          {/* Card Body content */}
          <div className="p-5 flex flex-col flex-1 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  Sponsor
                </span>
                <span className="text-[10px] text-zinc-400">• Terverifikasi</span>
              </div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 leading-snug">
                Pakan Konsentrat Layer Premium
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                Formulasi jagung pipil pilihan dan kedelai impor berprotein tinggi untuk memicu kualitas telur cangkang keras dan produksi optimal setiap hari.
              </p>
            </div>
            <div className="pt-4 mt-auto">
              <span className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1">
                Kunjungi Sponsor &raquo;
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-0 bg-gradient-to-br from-amber-500/5 to-zinc-50 dark:from-amber-500/5 dark:to-zinc-950 pointer-events-none">
          <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-600 tracking-widest mb-1.5 block">
            Sponsor / Iklan Mitra
          </span>
          <div className="space-y-1">
            <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
              {type === "vertical" 
                ? "Kandang Baterai Galvanis" 
                : type === "square" 
                ? "Konsentrat Pakan Layer Super" 
                : "Suplemen Organik Peningkat Cangkang Telur"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal max-w-xs">
              {type === "vertical" 
                ? "Konstruksi besi anti-karat untuk efisiensi produksi maksimal."
                : type === "square"
                ? "Protein 18% untuk menunjang produksi harian telur petelur."
                : "Formula khusus untuk ketebalan cangkang telur dan menjaga kesehatan ayam harian."}
            </p>
          </div>
          <span className="mt-3.5 text-[10px] font-bold text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-full px-3.5 py-0.5 bg-white dark:bg-zinc-900 shadow-xs">
            Cek Brosur Iklan &raquo;
          </span>
        </div>
      )}
      
    </div>
  );
}
