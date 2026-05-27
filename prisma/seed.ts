import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import crypto from "crypto";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin User
  const adminEmail = "admin@hargatelur.id";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = hashPassword("adminpassword");
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Administrator Utama",
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    console.log("Admin user seeded: admin@hargatelur.id / adminpassword");
  } else {
    console.log("Admin user already exists.");
  }

  // 2. Create a default Blogger User
  const bloggerEmail = "peternak@hargatelur.id";
  const existingBlogger = await prisma.user.findUnique({
    where: { email: bloggerEmail }
  });

  let bloggerId: number;
  if (!existingBlogger) {
    const hashedPassword = hashPassword("bloggerpassword");
    const blogger = await prisma.user.create({
      data: {
        email: bloggerEmail,
        name: "Slamet Peternak Blitar",
        password: hashedPassword,
        role: "USER"
      }
    });
    bloggerId = blogger.id;
    console.log("Blogger user seeded: peternak@hargatelur.id / bloggerpassword");
  } else {
    bloggerId = existingBlogger.id;
    console.log("Blogger user already exists.");
  }

  // 3. Create Sample Posts
  const postsCount = await prisma.post.count();
  if (postsCount === 0) {
    const post1 = await prisma.post.create({
      data: {
        title: "Update Harga Telur Blitar Mulai Merangkak Naik Minggu Ini",
        slug: "harga-telur-blitar-mulai-merangkak-naik-3f92",
        content: "Laporan harian dari wilayah Blitar menunjukkan tren kenaikan harga telur ayam ras sebesar Rp 500 per kilogram. Hal ini dipicu oleh kenaikan harga bahan pakan jagung pipil kuning di tingkat lokal yang membebani biaya produksi peternak mandiri. Untuk saat ini, pasokan dari kandang terpantau cukup stabil dan permintaan pasar dari Jabodetabek masih bergairah.",
        priceRegion: "Blitar",
        eggPrice: 24200,
        authorId: bloggerId,
        published: true
      }
    });

    await prisma.postImage.create({
      data: {
        url: "/uploads/chicken-farm.webp",
        filename: "chicken-farm.webp",
        mimeType: "image/webp",
        size: 250000,
        width: 1024,
        height: 1024,
        altText: "Kondisi Kandang Ayam Peternakan Blitar",
        postId: post1.id
      }
    });

    const post2 = await prisma.post.create({
      data: {
        title: "Pasokan Melimpah, Harga Telur di DKI Jakarta Berangsur Stabil",
        slug: "pasokan-melimpah-harga-telur-dki-jakarta-berangsur-stabil-2b5a",
        content: "Setelah mengalami fluktuasi tajam selama seminggu terakhir, harga eceran telur ayam ras di sejumlah pasar tradisional DKI Jakarta akhirnya mulai stabil di kisaran Rp 27.500 per kilogram. Menurut para pedagang, stabilitas ini didukung oleh lancarnya arus distribusi pengiriman logistik dari daerah sentra produksi di Jawa Timur.",
        priceRegion: "Jakarta",
        eggPrice: 27500,
        authorId: bloggerId,
        published: true
      }
    });

    await prisma.postImage.create({
      data: {
        url: "/uploads/eggs-basket.webp",
        filename: "eggs-basket.webp",
        mimeType: "image/webp",
        size: 310000,
        width: 1024,
        height: 1024,
        altText: "Keranjang Telur Ayam Ras Segar",
        postId: post2.id
      }
    });

    console.log("Sample blog posts and images seeded successfully.");
  } else {
    console.log("Blog posts table is not empty. Skipping post seeding.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
