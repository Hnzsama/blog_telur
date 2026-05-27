import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/AdBanner";
import { ArrowLeft, ArrowRight, Calendar, User, Tag, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Artikel & Analisis Pasar",
  description: "Arsip lengkap artikel berita, ulasan teknis peternakan ayam petelur, dan analisis fluktuasi harga telur hari ini dari komunitas Harga Telur Indonesia.",
};

interface BlogListPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10) || 1;
  const postsPerPage = 6;
  const skip = (currentPage - 1) * postsPerPage;

  let posts: any[] = [];
  let totalPosts = 0;

  try {
    const [fetchedPosts, count] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: postsPerPage,
        include: {
          author: {
            select: { name: true },
          },
          images: {
            take: 1,
          },
        },
      }),
      prisma.post.count({
        where: { published: true },
      }),
    ]);
    posts = fetchedPosts;
    totalPosts = count;
  } catch (error) {
    console.error("Failed to query posts for blog list page:", error);
  }

  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1;

  return (
    <main className="flex-1 py-16 bg-zinc-50/50 dark:bg-zinc-950/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Komunitas Penulis & Peternak</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Artikel & Laporan Komunitas
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
              Temukan analisis mendalam tentang harga pasar telur ayam, berita industri peternakan, panduan manajemen kandang, dan cerita inspiratif langsung dari pelaku industri di seluruh Indonesia.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href="/" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
          </Button>
        </header>

        {/* AdSense Banner Spot 1 (Leaderboard) */}
        <div className="mb-12">
          <AdBanner slot="posts-list-top-leaderboard" format="horizontal" />
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-850 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">Belum Ada Artikel</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 px-6">
              Tidak ada artikel yang dipublikasikan saat ini. Silakan log in untuk memposting tulisan pertama Anda!
            </p>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <Card className={`flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden rounded-2xl ${post.images && post.images.length > 0 ? "pt-0" : ""}`}>
                    {post.images && post.images.length > 0 && (
                      <div className="relative w-full aspect-video border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850">
                        <Image 
                          src={post.images[0].url} 
                          alt={post.images[0].altText || post.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                          className="object-cover"
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
                        <span className="flex items-center gap-1 font-medium text-zinc-755 dark:text-zinc-300">
                          <User className="w-3.5 h-3.5 text-amber-500" />
                          {post.author.name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold line-clamp-2 text-zinc-900 dark:text-zinc-50 hover:text-amber-500 transition-colors">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      {post.priceRegion && post.eggPrice && (
                        <CardDescription className="text-xs mt-2 inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold w-fit">
                          <Tag className="w-3 h-3 mr-1" />
                          {post.priceRegion}: Rp {post.eggPrice.toLocaleString("id-ID")}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pt-0">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 flex-1 mb-4 leading-relaxed">
                        {post.content}
                      </p>
                      <Button asChild variant="link" className="p-0 text-amber-500 hover:text-amber-600 w-fit font-bold mt-auto group">
                        <Link href={`/posts/${post.slug}`} className="flex items-center gap-1">
                          Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  {/* Insert In-Feed Card Ad after the 2nd post (index === 1) */}
                  {index === 1 && (
                    <AdBanner slot="posts-list-infeed-card" type="card" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* AdSense Banner Spot 2 (Horizontal mid-feed) */}
            <div className="mb-12">
              <AdBanner slot="posts-list-mid-horizontal" format="horizontal" />
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                {currentPage > 1 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/posts?page=${currentPage - 1}`}>
                      Sebelumnya
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Sebelumnya
                  </Button>
                )}

                {/* Page numbers list */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <Button 
                      key={pNum} 
                      asChild 
                      variant={pNum === currentPage ? "default" : "outline"} 
                      size="sm"
                      className={pNum === currentPage ? "bg-amber-500 hover:bg-amber-600 text-white font-bold" : ""}
                    >
                      <Link href={`/posts?page=${pNum}`}>
                        {pNum}
                      </Link>
                    </Button>
                  ))}
                </div>

                {currentPage < totalPages ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/posts?page=${currentPage + 1}`}>
                      Selanjutnya
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Selanjutnya
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
