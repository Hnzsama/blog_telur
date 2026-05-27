"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-center">
        <p className="font-bold mb-1">Pesan Berhasil Dikirim!</p>
        <p className="text-sm">Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="Contoh: Budi Santoso"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Alamat Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="budi@example.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="subject" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Subjek Pesan
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="Kemitraan Peternak / Pasang Iklan / dll."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Pesan Anda
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
          placeholder="Tuliskan pesan detail Anda di sini..."
        ></textarea>
      </div>

      <Button type="submit" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold">
        Kirim Pesan Sekarang
      </Button>
    </form>
  );
}
