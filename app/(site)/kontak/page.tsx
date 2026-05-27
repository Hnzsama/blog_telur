import * as React from "react";
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Hubungi redaksi Harga Telur Indonesia untuk kontribusi data, kerja sama publikasi, maupun kemitraan strategis lainnya.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 py-16 sm:py-24 bg-gradient-to-b from-amber-500/5 to-transparent">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hubungi Kami
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Kami terbuka untuk kolaborasi data harga telur harian, publikasi iklan kemitraan peternakan, dan masukan dari Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
                <Mail className="w-5 h-5" />
              </div>
              <CardTitle className="text-md font-bold">Email</CardTitle>
              <CardDescription>Hubungi redaksi kami via email</CardDescription>
            </CardHeader>
            <CardContent className="text-center font-medium text-amber-600 dark:text-amber-400 text-sm">
              info@hargatelur.id
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
                <Phone className="w-5 h-5" />
              </div>
              <CardTitle className="text-md font-bold">WhatsApp</CardTitle>
              <CardDescription>Layanan cepat via WA Chat</CardDescription>
            </CardHeader>
            <CardContent className="text-center font-medium text-amber-600 dark:text-amber-400 text-sm">
              +62 812-3456-7890
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <CardTitle className="text-md font-bold">Kantor Redaksi</CardTitle>
              <CardDescription>Pusat Koordinator Wilayah</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-zinc-500 dark:text-zinc-400 text-xs">
              Blitar, Jawa Timur, Indonesia
            </CardContent>
          </Card>
        </div>

        {/* Contact Form card */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Kirim Pesan</CardTitle>
            <CardDescription>
              Silakan isi formulir di bawah ini. Tim kami akan segera menanggapi dalam waktu 1x24 jam kerja.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
