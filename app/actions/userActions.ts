"use server"

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface ActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Update the logged-in user's profile info (name, email, and password).
 */
export async function updateProfileAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!name || !email) {
    return { success: false, error: "Nama dan Email wajib diisi." };
  }

  try {
    // 1. Verify email uniqueness
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: user.id },
      },
    });
    if (emailExists) {
      return { success: false, error: "Email sudah digunakan oleh pengguna lain." };
    }

    // Get current record including password for validation
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!fullUser) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    let updatedPasswordHash: string | undefined = undefined;

    // 2. Validate password change if requested
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        return { success: false, error: "Password saat ini wajib diisi untuk mengubah password." };
      }
      
      const isPasswordValid = verifyPassword(currentPassword, fullUser.password);
      if (!isPasswordValid) {
        return { success: false, error: "Password saat ini salah." };
      }

      if (!newPassword || newPassword.length < 8) {
        return { success: false, error: "Password baru minimal harus 8 karakter." };
      }

      if (newPassword !== confirmPassword) {
        return { success: false, error: "Konfirmasi password baru tidak cocok." };
      }

      updatedPasswordHash = hashPassword(newPassword);
    }

    // 3. Update database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        ...(updatedPasswordHash ? { password: updatedPasswordHash } : {}),
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("updateProfileAction error:", error);
    return { success: false, error: "Terjadi kesalahan server saat memperbarui profil." };
  }
}

/**
 * Create a new blogger account. (Admin Only)
 */
export async function createUserAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const caller = await getSessionUser();
  if (!caller || caller.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Hanya Administrator yang dapat membuat pengguna baru." };
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString() || "USER";

  if (!name || !email || !password) {
    return { success: false, error: "Nama, Email, dan Password wajib diisi." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password minimal harus 8 karakter." };
  }

  try {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExists) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    const hashedPassword = hashPassword(password);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("createUserAction error:", error);
    return { success: false, error: "Terjadi kesalahan server saat membuat pengguna." };
  }
}

/**
 * Update an existing blogger account. (Admin Only)
 */
export async function updateUserAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const caller = await getSessionUser();
  if (!caller || caller.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Hanya Administrator yang dapat memperbarui pengguna." };
  }

  const userIdStr = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const role = formData.get("role")?.toString();
  const password = formData.get("password")?.toString(); // optional password reset

  if (!userIdStr || !name || !email || !role) {
    return { success: false, error: "ID, Nama, Email, dan Peran wajib diisi." };
  }

  const userId = parseInt(userIdStr, 10);
  if (isNaN(userId)) {
    return { success: false, error: "ID pengguna tidak valid." };
  }

  try {
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });
    if (emailExists) {
      return { success: false, error: "Email sudah digunakan oleh pengguna lain." };
    }

    let updatedPasswordHash: string | undefined = undefined;
    if (password && password.trim() !== "") {
      if (password.length < 8) {
        return { success: false, error: "Password baru minimal harus 8 karakter." };
      }
      updatedPasswordHash = hashPassword(password);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
        ...(updatedPasswordHash ? { password: updatedPasswordHash } : {}),
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("updateUserAction error:", error);
    return { success: false, error: "Terjadi kesalahan server saat memperbarui pengguna." };
  }
}

/**
 * Delete a blogger account. (Admin Only)
 */
export async function deleteUserAction(targetUserId: number): Promise<ActionResponse> {
  const caller = await getSessionUser();
  if (!caller || caller.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Hanya Administrator yang dapat menghapus pengguna." };
  }

  if (targetUserId === caller.id) {
    return { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." };
  }

  try {
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("deleteUserAction error:", error);
    return { success: false, error: "Terjadi kesalahan server saat menghapus pengguna." };
  }
}
