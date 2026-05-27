import { LoginForm } from "@/components/login-form"
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun Baru",
  description: "Daftar sebagai blogger baru di Harga Telur Indonesia.",
  robots: "noindex, nofollow",
};

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm initialMode="register" />
      </div>
    </div>
  )
}
