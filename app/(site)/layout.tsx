import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/authActions";
import Script from "next/script";
import { MobileMenu } from "@/components/MobileMenu";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-mock-9876543210";

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm ring-1 ring-amber-200/60 dark:ring-amber-700/40 group-hover:ring-amber-400/80 transition-all">
                <Image
                  src="/icon.png"
                  alt="Harga Telur Indonesia logo"
                  fill
                  sizes="32px"
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                Harga Telur Indonesia
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
              <Link href="/posts" className="hover:text-amber-500 transition-colors">Blog Artikel</Link>
              <Link href="/#harga-regional" className="hover:text-amber-500 transition-colors">Harga Regional</Link>
              <Link href="/kontak" className="hover:text-amber-500 transition-colors">Kontak Kami</Link>
            </nav>
          </div>

          {/* Desktop Auth actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-block text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-colors mr-2"
                >
                  CRM Dashboard
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all active:scale-[0.98]"
                  >
                    Keluar
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-all active:scale-[0.98]"
              >
                Masuk / Daftar
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <MobileMenu isLoggedIn={!!user} logoutAction={logoutAction} />
        </div>
      </header>

      <div className="flex-1 flex flex-col">{children}</div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-10 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

            {/* Brand + tagline */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow ring-1 ring-amber-200/60 dark:ring-amber-700/40 group-hover:ring-amber-400/80 transition-all">
                  <Image
                    src="/icon.png"
                    alt="Harga Telur Indonesia logo"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <span className="text-base font-black tracking-tight bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                  Harga Telur Indonesia
                </span>
              </Link>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs text-center md:text-left leading-relaxed">
                Penyedia update harga telur ayam ras, ayam broiler, dan info peternakan nasional terpercaya.
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Link href="/" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Beranda</Link>
              <Link href="/posts" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Blog Artikel</Link>
              <Link href="/#harga-regional" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Cek Harga</Link>
              <Link href="/kontak" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Kontak</Link>
              <Link href="/privacy-policy" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Kebijakan Privasi</Link>
              <span className="w-full md:w-auto text-center text-zinc-300 dark:text-zinc-700 mt-1">
                © {new Date().getFullYear()} Harga Telur Indonesia. Semua Hak Dilindungi.
              </span>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}
