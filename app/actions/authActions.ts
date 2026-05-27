"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, logout } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Action to authenticate and log in a user
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return { success: false, error: "Email atau password salah." };
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: "Email atau password salah." };
    }

    await createSession(user.id);
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Terjadi kesalahan server internal." };
  }

  // Redirect to dashboard on success
  redirect("/dashboard");
}

// Action to sign up a new user
export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Semua kolom input wajib diisi." };
  }

  if (password.length < 8) {
    return { success: false, error: "Kata sandi minimal harus 8 karakter." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return { success: false, error: "Email ini sudah terdaftar." };
    }

    // Hash password and save new user
    const hashedPassword = hashPassword(password);
    
    // Check if it's the very first user or a specific admin domain to assign ADMIN role
    const isFirstUser = (await prisma.user.count()) === 0;
    const isAdminEmail = email.toLowerCase().trim() === "admin@hargatelur.id";
    const assignedRole = (isFirstUser || isAdminEmail) ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: assignedRole,
      },
    });

    await createSession(user.id);
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Gagal mendaftarkan akun baru." };
  }

  redirect("/dashboard");
}

// Action to log out a user
export async function logoutAction() {
  await logout();
  revalidatePath("/");
  redirect("/");
}
