"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Egg, Key, Mail, User, Eye, EyeOff } from "lucide-react";
import { loginAction, registerAction } from "@/app/actions/authActions";

export function LoginForm({
  className,
  initialMode = "login",
  ...props
}: React.ComponentProps<"div"> & { initialMode?: "login" | "register" }) {
  const [mode, setMode] = React.useState<"login" | "register">(initialMode);
  const [loginState, loginFormAction, isLoginPending] = React.useActionState(loginAction, null);
  const [registerState, registerFormAction, isRegisterPending] = React.useActionState(registerAction, null);

  const activeState = mode === "login" ? loginState : registerState;
  const activeAction = mode === "login" ? loginFormAction : registerFormAction;
  const isPending = mode === "login" ? isLoginPending : isRegisterPending;

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={activeAction}>
        <FieldGroup className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Egg className="size-6 animate-pulse" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
              Harga Telur Indonesia
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {mode === "login" ? "Selamat Datang" : "Daftar Akun Baru"}
            </h1>
            <FieldDescription className="text-center">
              {mode === "login" ? (
                <>
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-amber-600 hover:text-amber-500 underline"
                  >
                    Daftar Sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-amber-600 hover:text-amber-500 underline"
                  >
                    Masuk di Sini
                  </button>
                </>
              )}
            </FieldDescription>
          </div>

          {/* Form Error Banner */}
          {activeState?.error && (
            <div className="p-3 text-sm font-semibold rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 text-rose-800 dark:text-rose-400">
              {activeState.error}
            </div>
          )}

          {mode === "register" && (
            <Field className="space-y-1">
              <FieldLabel htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400" />
                Nama Lengkap
              </FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Contoh: Budi Santoso"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="w-full bg-transparent focus:ring-amber-500"
              />
            </Field>
          )}

          <Field className="space-y-1">
            <FieldLabel htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" />
              Alamat Email
            </FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="budi@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="w-full bg-transparent focus:ring-amber-500"
            />
          </Field>

          <Field className="space-y-1">
            <FieldLabel htmlFor="password" className="flex items-center gap-2">
              <Key className="w-4 h-4 text-zinc-400" />
              Kata Sandi
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="w-full bg-transparent focus:ring-amber-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center justify-center p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                disabled={isPending}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </Field>

          <Field className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : mode === "login" ? (
                "Masuk Akun"
              ) : (
                "Daftar Sekarang"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center text-xs">
        Dengan melanjutkan, Anda menyetujui{" "}
        <a href="/privacy-policy" className="hover:underline">
          Kebijakan Privasi
        </a>{" "}
        dan Ketentuan Layanan kami.
      </FieldDescription>
    </div>
  );
}
