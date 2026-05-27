"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Helper to generate a unique, clean slug for blog posts
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomSuffix}`;
}

// Action to create a new blog post
export async function createPostAction(prevState: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Anda harus login untuk memposting." };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const priceRegion = (formData.get("priceRegion") as string) || null;
  const eggPriceVal = formData.get("eggPrice") as string;

  if (!title || !content) {
    return { success: false, error: "Judul dan konten wajib diisi." };
  }

  const eggPrice = eggPriceVal ? parseInt(eggPriceVal, 10) : null;

  try {
    const slug = generateSlug(title);
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        priceRegion: priceRegion ? priceRegion.trim() : null,
        eggPrice,
        authorId: user.id,
        published: true, // Default to true (published)
      },
    });

    const files = formData.getAll("images") as File[];
    if (files && files.length > 0) {
      const { saveUploadedImages } = await import("@/lib/upload");
      await saveUploadedImages(files, post.id);
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, error: "Gagal membuat postingan baru." };
  }
}

// Action to update an existing blog post
export async function updatePostAction(id: number, prevState: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Sesi Anda telah berakhir. Silakan login kembali." };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const priceRegion = (formData.get("priceRegion") as string) || null;
  const eggPriceVal = formData.get("eggPrice") as string;
  const publishedVal = formData.get("published") as string;

  if (!title || !content) {
    return { success: false, error: "Judul dan konten wajib diisi." };
  }

  const eggPrice = eggPriceVal ? parseInt(eggPriceVal, 10) : null;
  const published = publishedVal === "true";

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return { success: false, error: "Post tidak ditemukan." };
    }

    // Verify authorization: Only the author or an ADMIN can edit
    if (post.authorId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Anda tidak memiliki hak untuk mengedit postingan ini." };
    }

    await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        priceRegion: priceRegion ? priceRegion.trim() : null,
        eggPrice,
        published,
      },
    });

    const files = formData.getAll("images") as File[];
    if (files && files.length > 0) {
      const { saveUploadedImages } = await import("@/lib/upload");
      await saveUploadedImages(files, id);
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update post error:", error);
    return { success: false, error: "Gagal menyimpan perubahan postingan." };
  }
}

// Action to delete a blog post
export async function deletePostAction(id: number) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Sesi Anda telah berakhir. Silakan login kembali." };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!post) {
      return { success: false, error: "Post tidak ditemukan." };
    }

    // Verify authorization: Only the author or an ADMIN can delete
    if (post.authorId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Anda tidak memiliki hak untuk menghapus postingan ini." };
    }

    // Delete associated files from filesystem
    const fs = await import("fs/promises");
    const path = await import("path");
    for (const img of post.images) {
      const filepath = path.join(process.cwd(), "public", img.url);
      try {
        await fs.unlink(filepath);
      } catch (err) {
        console.error(`Failed to delete orphaned image: ${filepath}`, err);
      }
    }

    await prisma.post.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, error: "Gagal menghapus postingan." };
  }
}

// Action to delete an individual post image
export async function deletePostImageAction(imageId: number) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Sesi Anda telah berakhir. Silakan login kembali." };
  }

  try {
    const image = await prisma.postImage.findUnique({
      where: { id: imageId },
      include: { post: true }
    });

    if (!image) {
      return { success: false, error: "Gambar tidak ditemukan." };
    }

    // Verify authorization: Only the author of the post or an ADMIN can delete the image
    if (image.post.authorId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Anda tidak memiliki hak untuk menghapus gambar ini." };
    }

    // Delete the file from the filesystem
    const fs = await import("fs/promises");
    const path = await import("path");
    const filepath = path.join(process.cwd(), "public", image.url);
    try {
      await fs.unlink(filepath);
    } catch (err) {
      console.error(`Failed to delete image file: ${filepath}`, err);
    }

    // Delete from DB
    await prisma.postImage.delete({ where: { id: imageId } });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete image error:", error);
    return { success: false, error: "Gagal menghapus gambar." };
  }
}
