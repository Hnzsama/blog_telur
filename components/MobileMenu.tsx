"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  isLoggedIn: boolean;
  logoutAction?: string | ((formData: FormData) => void | Promise<void>) | undefined;
}

export function MobileMenu({ isLoggedIn, logoutAction }: MobileMenuProps) {
  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Buka menu utama"
          >
            <Menu className="block h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0 bg-white dark:bg-zinc-950 flex flex-col h-full border-l border-zinc-200 dark:border-zinc-800">
          <SheetHeader className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-900 flex flex-row items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-amber-200/60 dark:ring-amber-700/40">
              <Image
                src="/icon.png"
                alt="Harga Telur Indonesia logo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <SheetTitle className="text-base font-black tracking-tight bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent leading-none">
              Harga Telur Indonesia
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            <SheetClose asChild>
              <Link
                href="/"
                className="block rounded-xl px-4 py-3 text-base font-bold text-zinc-700 hover:text-amber-500 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-zinc-900/60 transition-all"
              >
                Home
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/posts"
                className="block rounded-xl px-4 py-3 text-base font-bold text-zinc-700 hover:text-amber-500 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-zinc-900/60 transition-all"
              >
                Blog Artikel
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/#harga-regional"
                className="block rounded-xl px-4 py-3 text-base font-bold text-zinc-700 hover:text-amber-500 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-zinc-900/60 transition-all"
              >
                Harga Regional
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/kontak"
                className="block rounded-xl px-4 py-3 text-base font-bold text-zinc-700 hover:text-amber-500 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-zinc-900/60 transition-all"
              >
                Kontak Kami
              </Link>
            </SheetClose>

            {isLoggedIn ? (
              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-5 mt-4 space-y-4">
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-zinc-700 hover:text-amber-500 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-zinc-900/60 transition-all"
                  >
                    <span>CRM Dashboard</span>
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                  </Link>
                </SheetClose>
                {logoutAction && (
                  <div className="px-4 pt-2">
                    <form action={logoutAction} className="w-full">
                      <SheetClose asChild>
                        <button
                          type="submit"
                          className="w-full inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 shadow-xs hover:bg-rose-50/50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          Keluar
                        </button>
                      </SheetClose>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-5 mt-4 px-4">
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="flex w-full h-11 items-center justify-center rounded-xl bg-amber-500 text-sm font-bold text-white shadow-xs hover:bg-amber-600 transition-all active:scale-[0.98]"
                  >
                    Masuk / Daftar
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
