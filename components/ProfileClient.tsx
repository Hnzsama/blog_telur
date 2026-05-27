"use client"

import * as React from "react";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Field, 
  FieldGroup, 
  FieldLabel 
} from "@/components/ui/field";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/userActions";
import { User, Mail, ShieldAlert, Key } from "lucide-react";

interface ProfileClientProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  // Use React 19 useActionState for form action integration
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  
  const passwordFormRef = useRef<HTMLFormElement>(null);

  // Trigger toasts on success or failure of action state changes
  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success("Profil Anda berhasil diperbarui!");
        // Clear password form fields if update was successful
        if (passwordFormRef.current) {
          passwordFormRef.current.reset();
        }
      } else if (state.error) {
        toast.error(state.error);
      }
    }
  }, [state]);

  return (
    <div className="flex-1 space-y-8 p-6 sm:p-10 max-w-5xl">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          Pengaturan Profil
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Perbarui informasi kontak pribadi Anda dan ubah kata sandi blogger di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Account Information */}
        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" />
              Detail Akun
            </CardTitle>
            <CardDescription>
              Detail informasi login dasar Anda. Email baru akan digunakan untuk proses masuk selanjutnya.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <form action={formAction} className="space-y-5">
              <Field className="space-y-1">
                <FieldLabel htmlFor="name" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Nama Lengkap
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user.name}
                    required
                    className="w-full bg-transparent focus:ring-amber-500"
                  />
                </div>
              </Field>

              <Field className="space-y-1">
                <FieldLabel htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Alamat Email
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                    className="w-full bg-transparent focus:ring-amber-500"
                  />
                </div>
              </Field>

              <Field className="space-y-1">
                <FieldLabel className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Peran / Akses
                </FieldLabel>
                <Input
                  disabled
                  value={user.role === "ADMIN" ? "Administrator" : "Penulis / Blogger"}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-400 border-dashed cursor-not-allowed"
                />
                <span className="text-[10px] text-zinc-400 block mt-1">Peran akun Anda dikelola oleh Administrator Utama.</span>
              </Field>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] w-full"
                >
                  {isPending ? "Memproses..." : "Simpan Perubahan Akun"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Card 2: Security & Password Change */}
        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              Keamanan Sandi
            </CardTitle>
            <CardDescription>
              Ubah kata sandi akun blogger Anda secara mandiri demi keamanan. Minimal 8 karakter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 
              This form also submits to the same updateProfileAction.
              We use a separate form ref to reset inputs easily.
            */}
            <form ref={passwordFormRef} action={formAction} className="space-y-5">
              {/* Carry over current details in hidden inputs for safety */}
              <input type="hidden" name="name" value={user.name} />
              <input type="hidden" name="email" value={user.email} />

              <Field className="space-y-1">
                <FieldLabel htmlFor="currentPassword" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Password Saat Ini
                </FieldLabel>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent focus:ring-amber-500"
                />
              </Field>

              <Field className="space-y-1">
                <FieldLabel htmlFor="newPassword" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Password Baru
                </FieldLabel>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent focus:ring-amber-500"
                />
              </Field>

              <Field className="space-y-1">
                <FieldLabel htmlFor="confirmPassword" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Konfirmasi Password Baru
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent focus:ring-amber-500"
                />
              </Field>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] w-full"
                >
                  {isPending ? "Memproses..." : "Perbarui Kata Sandi"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
