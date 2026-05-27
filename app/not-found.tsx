import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan (404)",
  description:
    "Maaf, halaman yang Anda cari tidak ditemukan. Kembali ke beranda atau jelajahi artikel terbaru kami tentang harga telur ayam ras di Indonesia.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto py-20">
        {/* Egg illustration */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-200 dark:shadow-amber-900/40">
            <span className="text-6xl select-none" role="img" aria-label="Telur retak">
              🥚
            </span>
          </div>
          {/* Crack decoration */}
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-amber-100 dark:bg-zinc-800 flex items-center justify-center text-2xl shadow-md">
            💥
          </div>
        </div>

        {/* Error code */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 leading-none tracking-tighter select-none">
            404
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
          Aduh, Telurnya Pecah!
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 mb-2 text-base leading-relaxed">
          Halaman yang Anda cari tidak ditemukan atau mungkin sudah dipindahkan.
        </p>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-10">
          Jangan khawatir, ada banyak informasi harga telur yang bisa Anda temukan di halaman lain.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 active:scale-[0.97] gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Ke Beranda
          </Link>

          <Link
            href="/posts"
            className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-amber-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 text-sm font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 active:scale-[0.97] gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Baca Artikel
          </Link>
        </div>

        {/* Quick links */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-600 uppercase tracking-wider font-semibold mb-4">
            Halaman Populer
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/#harga-regional", label: "🗺️ Harga Regional" },
              { href: "/kontak", label: "📬 Kontak Kami" },
              { href: "/privacy-policy", label: "🔒 Kebijakan Privasi" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
