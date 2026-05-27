"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, Edit, Trash2, Globe, Lock, User, Tag, 
  LogOut, Calendar, BookOpen, AlertCircle, LayoutDashboard
} from "lucide-react";
import { createPostAction, updatePostAction, deletePostAction, deletePostImageAction } from "@/app/actions/postActions";
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
  const [modalMode, setModalMode] = React.useState<"idle" | "create" | "edit">("idle");
  const [selectedPost, setSelectedPost] = React.useState<typeof posts[0] | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<number | null>(null);
  const [deleteImageConfirmId, setDeleteImageConfirmId] = React.useState<number | null>(null);
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

  // Handlers for dynamic actions
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await createPostAction(null, formData);
    setIsActionPending(false);
    
    if (res.success) {
      toast.success("Postingan berhasil diterbitkan!");
      setModalMode("idle");
    } else {
      toast.error(res.error || "Gagal menerbitkan postingan.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPost) return;
    setIsActionPending(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await updatePostAction(selectedPost.id, null, formData);
    setIsActionPending(false);
    
    if (res.success) {
      toast.success("Postingan berhasil disimpan!");
      setModalMode("idle");
      setSelectedPost(null);
    } else {
      toast.error(res.error || "Gagal memperbarui postingan.");
    }
  };



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
            onClick={() => setModalMode("create")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Tulis Postingan
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
        
        <div className="overflow-x-auto">
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
                          onClick={() => {
                            setSelectedPost(post);
                            setModalMode("edit");
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirmId(post.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
      </Card>

      {/* Editor Modal Overlay */}
      {modalMode !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                {modalMode === "create" ? "Tulis Artikel Baru" : "Edit Artikel"}
              </h3>
              <button 
                onClick={() => {
                  setModalMode("idle");
                  setSelectedPost(null);
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form 
              onSubmit={modalMode === "create" ? handleCreateSubmit : handleEditSubmit}
              encType="multipart/form-data"
              className="space-y-4 overflow-y-auto pr-1 flex-1"
            >
              <div className="space-y-1">
                <label htmlFor="title" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Judul Artikel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={modalMode === "edit" ? selectedPost?.title : ""}
                  className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="Contoh: Perkembangan Harga Telur Blitar Mengalami Penurunan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="priceRegion" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Wilayah Laporan (Opsional)
                  </label>
                  <input
                    type="text"
                    id="priceRegion"
                    name="priceRegion"
                    defaultValue={modalMode === "edit" ? (selectedPost?.priceRegion || "") : ""}
                    className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Contoh: Blitar"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="eggPrice" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Harga Telur / kg (Opsional)
                  </label>
                  <input
                    type="number"
                    id="eggPrice"
                    name="eggPrice"
                    defaultValue={modalMode === "edit" ? (selectedPost?.eggPrice || "") : ""}
                    className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Contoh: 24200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="content" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Isi Artikel <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={6}
                  defaultValue={modalMode === "edit" ? selectedPost?.content : ""}
                  className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  placeholder="Tuliskan ulasan, data lengkap, maupun analisis kondisi pasar..."
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="images" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Upload Gambar Pendukung (Bisa Pilih Lebih dari Satu)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
                />
              </div>

              {modalMode === "edit" && selectedPost?.images && selectedPost.images.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Gambar Terunggah ({selectedPost.images.length})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPost.images.map((img) => (
                      <div key={img.id} className="relative group rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-video relative">
                        <Image 
                          src={img.url} 
                          alt={img.altText || "Gambar postingan"} 
                          fill
                          sizes="(max-width: 640px) 33vw, 150px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setDeleteImageConfirmId(img.id)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalMode === "edit" && (
                <div className="space-y-1">
                  <label htmlFor="published" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Status Publikasi
                  </label>
                  <select
                    id="published"
                    name="published"
                    defaultValue={selectedPost?.published ? "true" : "false"}
                    className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="true">Publik (Tampilkan di halaman utama)</option>
                    <option value="false">Draf (Sembunyikan / Simpan sebagai draf)</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setModalMode("idle");
                    setSelectedPost(null);
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isActionPending}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  {isActionPending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : modalMode === "create" ? (
                    "Terbitkan Post"
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Delete Image Confirmation Modal */}
      {deleteImageConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Hapus Gambar?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteImageConfirmId(null)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={async () => {
                  const imageId = deleteImageConfirmId;
                  setDeleteImageConfirmId(null);
                  setIsActionPending(true);
                  const res = await deletePostImageAction(imageId);
                  setIsActionPending(false);
                  if (res.success) {
                    toast.success("Gambar berhasil dihapus.");
                    if (selectedPost) {
                      setSelectedPost({
                        ...selectedPost,
                        images: selectedPost.images?.filter(img => img.id !== imageId) || []
                      });
                    }
                  } else {
                    toast.error(res.error || "Gagal menghapus gambar.");
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
