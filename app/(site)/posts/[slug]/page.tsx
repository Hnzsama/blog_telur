import * as React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdBanner } from "@/components/AdBanner";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Tag,
  User,
  Clock,
  MapPin,
  TrendingUp,
  Share2,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata dynamically for the post (for proper SEO indexation)
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://discount-mpegs-live-attempted.trycloudflare.com";
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        images: true
      }
    });

    if (!post) {
      return { title: "Postingan Tidak Ditemukan | Harga Telur Indonesia" };
    }

    const firstImage = post.images && post.images.length > 0 ? post.images[0].url : "/icon.png";

    return {
      title: `${post.title} | Harga Telur Indonesia`,
      description: post.content.substring(0, 150),
      alternates: {
        canonical: `${siteUrl}/posts/${slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.content.substring(0, 150),
        url: `${siteUrl}/posts/${slug}`,
        siteName: "Harga Telur Indonesia",
        locale: "id_ID",
        type: "article",
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        images: [
          {
            url: firstImage,
            width: 800,
            height: 600,
            alt: post.title,
          }
        ]
      }
    };
  } catch (error) {
    return { title: "Detail Postingan | Harga Telur Indonesia" };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post = null;
  let recentPosts: any[] = [];

  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, email: true },
        },
        images: true,
      },
    });

    if (post) {
      recentPosts = await prisma.post.findMany({
        where: {
          slug: { not: slug },
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
        include: {
          images: {
            take: 1
          }
        },
      });
    }
  } catch (error) {
    console.error("Failed to query post details:", error);
  }

  if (!post) {
    notFound();
  }

  // Calculate estimated reading time
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Split content into clean paragraph blocks
  let paragraphs = post.content.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length <= 1) {
    paragraphs = post.content.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
  }

  // Author initial for fallback avatar
  const authorInitial = post.author.name ? post.author.name.charAt(0).toUpperCase() : "U";

  // SEO schemas
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://discount-mpegs-live-attempted.trycloudflare.com";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.content.substring(0, 150),
    "image": post.images && post.images.length > 0 ? `${siteUrl}${post.images[0].url}` : `${siteUrl}/icon.png`,
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Harga Telur Indonesia",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icon.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/posts/${post.slug}`
    }
  };

  const datasetSchema = post.eggPrice ? {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `Laporan Harga Telur ${post.priceRegion} - ${new Date(post.createdAt).toLocaleDateString("id-ID")}`,
    "description": `Data harga telur ayam ras per kilogram di wilayah ${post.priceRegion} pada tanggal ${new Date(post.createdAt).toLocaleDateString("id-ID")}`,
    "spatialCoverage": post.priceRegion,
    "variableMeasured": "Harga Telur Ayam Ras",
    "temporalCoverage": post.createdAt.toISOString().split('T')[0],
    "creator": {
      "@type": "Organization",
      "name": "Harga Telur Indonesia"
    }
  } : null;

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {datasetSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
        />
      )}

      <main className="flex-1 py-10 bg-zinc-50/40 dark:bg-zinc-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Elegant Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-8">
            <Link href="/" className="hover:text-amber-500 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            <Link href="/posts" className="hover:text-amber-500 transition-colors">Berita & Artikel</Link>
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </nav>

          {/* Immersive Header Banner Area */}
          <header className="mb-10 max-w-4xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{post.priceRegion ? "Laporan Harga & Analisis" : "Informasi Peternakan"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold text-sm shadow-sm">
                  {authorInitial}
                </div>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block leading-tight">{post.author.name}</span>
                  <span className="text-xs text-zinc-400">Penulis Komunitas</span>
                </div>
              </div>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Estimasi {readingTime} Menit Baca</span>
              </div>
            </div>
          </header>

          {/* Large Featured WebP Image */}
          {post.images && post.images.length > 0 && (
            <div className="mb-12 rounded-[2rem] overflow-hidden border border-zinc-200/60 dark:border-zinc-800/80 aspect-[21/9] min-h-[250px] bg-zinc-100 dark:bg-zinc-900 relative w-full shadow-lg shadow-zinc-200/30 dark:shadow-none group">
              <Image
                src={post.images[0].url}
                alt={post.images[0].altText || post.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* AdSense Banner Spot 1 (Horizontal Leaderboard below header image) */}
          <AdBanner slot="posts-detail-mid-leaderboard" format="horizontal" />

          {/* Desktop Dual-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left Column: Article Body (col-span-8) */}
            <article className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-zinc-100/30 dark:shadow-none">

              <section className="space-y-6 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                {/* Paragraphs with custom Drop-Cap for the very first letter */}
                {paragraphs.length > 0 && (
                  <p className="first-letter:text-6xl first-letter:font-black first-letter:text-amber-500 first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:leading-[0.8] first-letter:tracking-wider">
                    {paragraphs[0]}
                  </p>
                )}
                {paragraphs.slice(1).map((para, idx) => {
                  // Make simple formatting if it looks like a blockquote/highlight or standard list
                  if (para.startsWith(">")) {
                    return (
                      <blockquote key={idx} className="border-l-4 border-amber-500 pl-4 py-1 italic text-zinc-655 dark:text-zinc-400 bg-amber-500/5 rounded-r-lg my-6">
                        {para.replace(/^>\s*/, "")}
                      </blockquote>
                    );
                  }
                  return (
                    <p key={idx} className="text-zinc-700 dark:text-zinc-300">
                      {para}
                    </p>
                  );
                })}
              </section>

              {/* Internal & External SEO Linking Strategy Section */}
              <div className="mt-12 pt-8 border-t border-zinc-150 dark:border-zinc-800">
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 text-sm">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" /> Referensi Resmi & Hubungan Internal
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Website ini adalah wadah transparansi harga bagi komunitas peternak. Silakan bagikan laporan harga Anda via{" "}
                    <Link href="/kontak" className="text-amber-600 hover:text-amber-700 underline font-semibold transition-colors">
                      Hubungi Kontak Kami
                    </Link>{" "}
                    atau pelajari kebijakan data di situs otoritas terkait.
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3 leading-relaxed">
                    Pranala Luar Resmi (DoFollow): Pantau indeks harga pasar pangan nasional di situs resmi{" "}
                    <a
                      href="https://jdih.kemendag.go.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-600 underline font-semibold transition-colors"
                    >
                      Kementerian Perdagangan RI
                    </a>{" "}
                    dan data komoditas peternakan di{" "}
                    <a
                      href="https://www.bps.go.id/id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-600 underline font-semibold transition-colors"
                    >
                      Badan Pusat Statistik
                    </a>.
                  </p>
                </div>
              </div>

              {/* Image Gallery */}
              {post.images && post.images.length > 1 && (
                <section className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-6 bg-amber-500 rounded-full" />
                    Galeri Gambar Pendukung
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {post.images.slice(1).map((img) => (
                      <div key={img.id} className="rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 aspect-[16/10] bg-zinc-50 dark:bg-zinc-900 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] group relative">
                        <Link href={img.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                          <Image
                            src={img.url}
                            alt={img.altText || `Gambar pendukung ${post.title}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                              Buka Gambar <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Right Column: Sticky Sidebar Widgets (col-span-4) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">

              {/* Widget 1: Premium Price Report Callout */}
              {post.priceRegion && post.eggPrice ? (
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white p-6 shadow-xl shadow-amber-500/10 border border-amber-400/20 group">
                  {/* Decorative glowing sphere */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-100/90 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-xs">
                        Laporan Harga
                      </span>
                      <span className="flex items-center gap-1 text-xs text-amber-100/95">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-200 fill-amber-500/10" /> Terverifikasi
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-250 flex-shrink-0" />
                      <span className="text-xl font-bold tracking-tight text-white">{post.priceRegion}</span>
                    </div>

                    <div className="mt-4">
                      <span className="text-xs text-amber-105/90 uppercase tracking-wider block font-bold">Harga Saat Ini</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-black tracking-tight text-white">
                          Rp {post.eggPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="text-sm text-amber-100/80 font-bold">/ kg</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-2">
                      <Button asChild size="sm" className="bg-white hover:bg-zinc-50 text-amber-600 font-bold rounded-xl w-full border-none shadow-sm active:scale-[0.98]">
                        <Link href="/#harga-regional">Cek Wilayah Lain</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-xl w-full active:scale-[0.98]">
                        <Link href="/kontak" className="flex items-center justify-center gap-1.5">
                          Hubungi Admin <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-900/30 p-6 text-center">
                  <BookOpen className="w-10 h-10 mx-auto text-amber-500/85 mb-3" />
                  <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 mb-1">Informasi Umum Peternakan</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Artikel ini berisi panduan, ulasan industri, atau tips manajemen kandang dari blogger kami.
                  </p>
                </div>
              )}

              {/* Widget 2: Author Bio Card */}
              <Card className="rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" /> Mengenal Penulis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-lg">
                      {authorInitial}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{post.author.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{post.author.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Kontributor aktif di platform Harga Telur Indonesia. Membagikan ulasan pasar telur dan tips peternakan secara berkala.
                  </p>
                </CardContent>
              </Card>

              {/* Widget 3: Recent Articles (SEO Internal linking) */}
              {recentPosts.length > 0 && (
                <Card className="rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                  <CardHeader className="p-0 mb-5">
                    <CardTitle className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" /> Artikel Terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {recentPosts.map((rPost) => (
                        <div key={rPost.id} className="flex gap-3 items-start group">
                          {rPost.images && rPost.images.length > 0 ? (
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/65 dark:border-zinc-800/80">
                              <Image
                                src={rPost.images[0].url}
                                alt={rPost.images[0].altText || rPost.title}
                                fill
                                sizes="56px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-5 h-5 text-amber-500/70" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/posts/${rPost.slug}`}
                              className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug"
                            >
                              {rPost.title}
                            </Link>
                            <span className="text-[10px] text-zinc-400 mt-1 block">
                              {new Date(rPost.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AdSense Skyscraper Banner Spot 2 (Vertical Skyscraper in Sidebar) */}
              <AdBanner slot="posts-detail-sidebar-sky" type="vertical" />

              {/* Action Button: Kembali ke blog */}
              <Button asChild variant="outline" size="sm" className="rounded-xl w-full hover:bg-amber-500/5 hover:text-amber-600 transition-colors">
                <Link href="/posts" className="flex items-center justify-center gap-1.5">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Artikel
                </Link>
              </Button>

            </aside>

          </div>

        </div>
      </main>
    </>
  );
}
