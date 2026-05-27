"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto py-20">
        {/* Broken egg illustration */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-200 dark:shadow-red-900/40">
            <span
              className="text-6xl select-none"
              role="img"
              aria-label="Telur pecah"
            >
              🍳
            </span>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-100 dark:bg-zinc-800 flex items-center justify-center text-2xl shadow-md">
            ⚠️
          </div>
        </div>

        {/* Error code */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 leading-none tracking-tighter select-none">
            500
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
          Aduh, Telurnya Gosong!
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 mb-2 text-base leading-relaxed">
          Terjadi kesalahan pada server kami. Tim kami sudah diberitahu dan
          sedang memperbaikinya.
        </p>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-10">
          Coba muat ulang halaman, atau kembali ke beranda.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="text-xs text-zinc-300 dark:text-zinc-700 font-mono mb-8 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg px-4 py-2 inline-block">
            Error ID: {error.digest}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-red-200/50 dark:shadow-red-900/30 hover:from-red-600 hover:to-orange-600 transition-all duration-200 active:scale-[0.97] gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Coba Lagi
          </button>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-red-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 text-sm font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 active:scale-[0.97] gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Ke Beranda
          </Link>
        </div>

        {/* Quick links */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-600 uppercase tracking-wider font-semibold mb-4">
            Atau kunjungi halaman ini
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/posts", label: "📝 Blog Artikel" },
              { href: "/#harga-regional", label: "🗺️ Harga Regional" },
              { href: "/kontak", label: "📬 Kontak Kami" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-zinc-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
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
