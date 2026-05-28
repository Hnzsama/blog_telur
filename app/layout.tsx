import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Update Harga Telur & Ayam Ras Hari Ini",
    template: "%s | Harga Telur Indonesia",
  },
  description:
    "Update harga telur ayam ras terbaru hari ini langsung dari peternak di berbagai daerah Indonesia seperti Blitar, Jakarta, Surabaya. Cek tren harga pasar.",
  alternates: {
    canonical: "/",
  },
  // ── Mobile / PWA ────────────────────────────────────────────────────────
  applicationName: "Harga Telur Indonesia",
  keywords: ["harga telur", "harga ayam ras", "telur ayam", "peternak", "harga pasar", "Blitar", "Jakarta", "Indonesia"],
  authors: [{ name: "Harga Telur Indonesia" }],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "Update Harga Telur & Ayam Ras Hari Ini",
    description:
      "Update harga telur ayam ras terbaru hari ini langsung dari peternak di berbagai daerah Indonesia seperti Blitar, Jakarta, Surabaya. Cek tren harga pasar.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Harga Telur Indonesia",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Harga Telur Indonesia — Update Harga Telur Ayam Ras Hari Ini",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Update Harga Telur & Ayam Ras Hari Ini",
    description:
      "Update harga telur ayam ras terbaru hari ini langsung dari peternak di berbagai daerah Indonesia seperti Blitar, Jakarta, Surabaya.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-image.png`],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />
        {GA_ID && (
          <link rel="preconnect" href="https://www.google-analytics.com" />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-amber-100 dark:selection:bg-amber-900/30">
        <TooltipProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <Toaster position="top-right" />
        </TooltipProvider>

        {/* Google Analytics — loads after page is interactive */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
