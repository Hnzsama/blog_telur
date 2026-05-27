"use client"

import * as React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, UserPlus, Edit, Trash2, Shield, Mail, 
  Search, BookOpen, AlertCircle, CheckCircle2 
} from "lucide-react";
import { createUserAction, updateUserAction, deleteUserAction } from "@/app/actions/userActions";
import { toast } from "sonner";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  _count: {
    posts: number;
  };
}

interface UserManagementClientProps {
  currentUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  users: UserItem[];
}

export function UserManagementClient({ currentUser, users }: UserManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMode, setModalMode] = useState<"idle" | "create" | "edit">("idle");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Statistics computation
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "ADMIN").length;
  const totalBloggers = totalUsers - totalAdmins;
  const totalPosts = users.reduce((sum, u) => sum + u._count.posts, 0);

  // Filter users based on search query
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createUserAction(null, formData);
      if (res.success) {
        toast.success("Pengguna baru berhasil ditambahkan!");
        setModalMode("idle");
      } else {
        toast.error(res.error || "Gagal menambahkan pengguna.");
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    const formData = new FormData(e.currentTarget);
    formData.append("id", selectedUser.id.toString());
    
    startTransition(async () => {
      const res = await updateUserAction(null, formData);
      if (res.success) {
        toast.success("Informasi pengguna berhasil diperbarui!");
        setModalMode("idle");
        setSelectedUser(null);
      } else {
        toast.error(res.error || "Gagal memperbarui pengguna.");
      }
    });
  };

  const handleDeleteConfirm = async (userId: number) => {
    if (userId === currentUser.id) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    
    startTransition(async () => {
      const res = await deleteUserAction(userId);
      if (res.success) {
        toast.success("Pengguna berhasil dihapus!");
        setDeleteConfirmId(null);
      } else {
        toast.error(res.error || "Gagal menghapus pengguna.");
      }
    });
  };

  return (
    <div className="flex-1 space-y-8 p-6 sm:p-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Kelola Pengguna
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Daftar, buat baru, edit, dan hapus akun kontributor/blogger Harga Telur Indonesia.
          </p>
        </div>
        <Button 
          onClick={() => setModalMode("create")} 
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-1.5 self-start sm:self-auto rounded-xl active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" /> Tambah Pengguna
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Pengguna</CardDescription>
            <Users className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{totalUsers}</span>
            <span className="text-xs text-zinc-400 block mt-0.5">Blogger terdaftar</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-zinc-500">Administrator</CardDescription>
            <Shield className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{totalAdmins}</span>
            <span className="text-xs text-zinc-400 block mt-0.5">Akses pengelola</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-zinc-500">Blogger / User</CardDescription>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{totalBloggers}</span>
            <span className="text-xs text-zinc-400 block mt-0.5">Penulis artikel</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Artikel</CardDescription>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{totalPosts}</span>
            <span className="text-xs text-zinc-400 block mt-0.5">Diterbitkan oleh semua user</span>
          </CardContent>
        </Card>
      </div>

      {/* Main List Card Container */}
      <Card className="rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        
        {/* Filter controls */}
        <CardHeader className="border-b border-zinc-150 dark:border-zinc-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Semua Akun Pengguna
              </CardTitle>
              <CardDescription>
                Terdapat {filteredUsers.length} pengguna yang sesuai pencarian Anda.
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Cari nama, email, peran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-zinc-50 dark:bg-zinc-950 focus-visible:ring-amber-500"
              />
            </div>
          </div>
        </CardHeader>

        {/* Content list block */}
        <CardContent className="p-0 overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-20 text-center text-zinc-500">
              <Users className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
              <p className="font-bold">Pengguna Tidak Ditemukan</p>
              <p className="text-xs text-zinc-400 mt-0.5">Coba gunakan kata kunci pencarian lainnya.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="bg-zinc-50/50 dark:bg-zinc-950/20 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-150 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Nama Pengguna</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Hak Akses (Role)</th>
                  <th className="px-6 py-4 text-center">Jumlah Artikel</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60">
                {filteredUsers.map((item) => {
                  const initial = item.name ? item.name.charAt(0).toUpperCase() : "U";
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                            {initial}
                          </div>
                          <span>{item.name} {item.id === currentUser.id && <span className="text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full ml-1">Saya</span>}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{item.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.role === "ADMIN" ? (
                          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-none font-bold rounded-lg px-2.5 py-0.5">
                            Administrator
                          </Badge>
                        ) : (
                          <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-none font-semibold rounded-lg px-2.5 py-0.5">
                            Blogger / User
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-zinc-800 dark:text-zinc-200">
                        {item._count.posts}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(item);
                              setModalMode("edit");
                            }}
                            className="hover:bg-amber-500/10 hover:text-amber-600 text-zinc-500 rounded-xl"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(item.id)}
                            disabled={item.id === currentUser.id}
                            className="hover:bg-rose-500/10 hover:text-rose-600 text-zinc-500 rounded-xl disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Editor Modal Overlay (Create / Edit Blogger Accounts) */}
      {modalMode !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                {modalMode === "create" ? "Tambah Pengguna Baru" : "Edit Pengguna"}
              </h3>
              <button 
                onClick={() => {
                  setModalMode("idle");
                  setSelectedUser(null);
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form 
              onSubmit={modalMode === "create" ? handleCreateSubmit : handleEditSubmit}
              className="space-y-4 overflow-y-auto pr-1 flex-1"
            >
              <div className="space-y-1">
                <label htmlFor="modal-name" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  id="modal-name"
                  name="name"
                  required
                  defaultValue={modalMode === "edit" ? selectedUser?.name : ""}
                  placeholder="Contoh: Andi Wijaya"
                  className="w-full focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-email" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  id="modal-email"
                  name="email"
                  required
                  defaultValue={modalMode === "edit" ? selectedUser?.email : ""}
                  placeholder="andi@example.com"
                  className="w-full focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-role" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Peran Akses <span className="text-rose-500">*</span>
                </label>
                <select
                  id="modal-role"
                  name="role"
                  required
                  defaultValue={modalMode === "edit" ? selectedUser?.role : "USER"}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="USER">Blogger / User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-pass" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Kata Sandi {modalMode === "create" ? <span className="text-rose-500">*</span> : <span className="text-zinc-400">(Biarkan kosong jika tidak diubah)</span>}
                </label>
                <Input
                  type="password"
                  id="modal-pass"
                  name="password"
                  required={modalMode === "create"}
                  placeholder="••••••••"
                  minLength={8}
                  className="w-full focus-visible:ring-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setModalMode("idle");
                    setSelectedUser(null);
                  }}
                  className="rounded-xl active:scale-[0.98]"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl active:scale-[0.98]"
                >
                  {isPending ? "Memproses..." : modalMode === "create" ? "Tambah Pengguna" : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Account Confirmation Dialog */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">Hapus Pengguna</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus akun pengguna ini? Semua artikel yang ditulis oleh blogger ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl active:scale-[0.98]"
              >
                Batal
              </Button>
              <Button 
                disabled={isPending}
                onClick={() => handleDeleteConfirm(deleteConfirmId)}
                className="bg-rose-650 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white font-bold rounded-xl active:scale-[0.98]"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus Akun"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
