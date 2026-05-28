"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, Edit, Trash2, Globe, Lock, User, Tag, 
  LogOut, Calendar, BookOpen, AlertCircle, LayoutDashboard
} from "lucide-react";
import { deletePostAction } from "@/app/actions/postActions";
import { logoutAction } from "@/app/actions/authActions";
import { toast } from "sonner";

interface DashboardClientProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  posts: Array<{
    id: number;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    createdAt: any;
    priceRegion: string | null;
    eggPrice: number | null;
    author: {
      name: string;
      email: string;
    };
    images?: Array<{
      id: number;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      width: number;
      height: number;
      altText: string | null;
    }>;
  }>;
}

export function DashboardClient({ user, posts }: DashboardClientProps) {
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<number | null>(null);
  const [isActionPending, setIsActionPending] = React.useState(false);

  // Stats computation
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published).length;
  const draftPosts = totalPosts - publishedPosts;
  
  // Calculate average price reported in data
  const postsWithPrice = posts.filter(p => p.eggPrice !== null);
  const averagePrice = postsWithPrice.length > 0 
    ? Math.round(postsWithPrice.reduce((sum, p) => sum + (p.eggPrice || 0), 0) / postsWithPrice.length)
    : 0;

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-amber-500" />
            CRM Blog Workspace
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Selamat datang, <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.name}</span>. Anda masuk sebagai <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">{user.role}</span>.
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Link href="/dashboard/posts/new">
              <Plus className="w-4 h-4" /> Tulis Postingan
            </Link>
          </Button>
          
          <form action={logoutAction} className="sm:hidden">
            <Button variant="outline" type="submit" size="icon">
              <LogOut className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Postingan Anda</CardDescription>
            <CardTitle className="text-3xl font-black">{totalPosts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Semua postingan tercatat di database.</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Postingan Publik</CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{publishedPosts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Dapat dibaca oleh semua pengunjung.</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Draf / Diarsipkan</CardDescription>
            <CardTitle className="text-3xl font-black text-amber-600 dark:text-amber-400">{draftPosts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Belum dipublikasikan ke halaman utama.</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Rata-Rata Harga Terlaporkan</CardDescription>
            <CardTitle className="text-2xl font-black">
              {averagePrice > 0 ? `Rp ${averagePrice.toLocaleString("id-ID")}` : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Dihitung dari {postsWithPrice.length} postingan harga.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Content */}
      <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle>Kelola Postingan Artikel</CardTitle>
          <CardDescription>
            {user.role === "ADMIN" 
              ? "Menampilkan seluruh postingan blog dari semua kontributor (Hak Akses Admin)."
              : "Menampilkan daftar postingan blog yang telah Anda tulis."
            }
          </CardDescription>
        </CardHeader>
        
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400 border-collapse">
            <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Judul Postingan</th>
                <th className="px-6 py-4 font-semibold">Penulis</th>
                <th className="px-6 py-4 font-semibold">Tanggal Dibuat</th>
                <th className="px-6 py-4 font-semibold">Laporan Harga</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                    <BookOpen className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                    Belum ada postingan artikel.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-50">{post.title}</div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-1 max-w-sm">
                        {post.content}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        {post.author.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      {post.priceRegion && post.eggPrice ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
                          <Tag className="w-3 h-3" />
                          {post.priceRegion}: Rp {post.eggPrice.toLocaleString("id-ID")}
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 font-normal">Tidak ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400">
                          <Globe className="w-3 h-3" /> Publik
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          <Lock className="w-3 h-3" /> Draf
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <Link href={`/dashboard/posts/${post.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirmId(post.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
              <BookOpen className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
              Belum ada postingan artikel.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="p-4 space-y-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <div className="space-y-1">
                  <div className="font-bold text-zinc-900 dark:text-zinc-50 leading-snug">{post.title}</div>
                  <div className="text-xs text-zinc-450 dark:text-zinc-500 line-clamp-2">
                    {post.content}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    {post.author.name}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {post.priceRegion && post.eggPrice && (
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                    <Tag className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800 dark:text-amber-400">Harga Telur:</span>{" "}
                      <span className="text-zinc-700 dark:text-zinc-300">{post.priceRegion}</span>
                      <div className="font-black text-sm text-amber-600 dark:text-amber-400 mt-0.5">
                        Rp {post.eggPrice.toLocaleString("id-ID")} / kg
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div>
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400">
                        <Globe className="w-2.5 h-2.5" /> Publik
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        <Lock className="w-2.5 h-2.5" /> Draf
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Edit className="w-3.5 h-3.5 text-zinc-500" /> Edit
                      </Link>
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirmId(post.id)}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs flex items-center gap-1 text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 border-rose-200/50 dark:border-rose-900/30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Delete Post Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Hapus Postingan?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Apakah Anda yakin ingin menghapus postingan ini secara permanen? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={async () => {
                  const id = deleteConfirmId;
                  if (id === null) return;
                  setDeleteConfirmId(null);
                  setIsActionPending(true);
                  const res = await deletePostAction(id);
                  setIsActionPending(false);
                  if (res.success) {
                    toast.success("Postingan berhasil dihapus.");
                  } else {
                    toast.error(res.error || "Gagal menghapus postingan.");
                  }
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
