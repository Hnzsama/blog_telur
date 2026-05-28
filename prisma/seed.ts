import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { seedUsers } from "./userSeed";
import { seedPosts } from "./postSeed";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting DB seeding...");

  // 1. Seed Users (Admin and regional bloggers)
  const users = await seedUsers(prisma);

  // 2. Seed Posts (Detailed regional blog pricing reports)
  // === COMMENT OUT THE LINE BELOW IF YOU DO NOT WANT TO SEED BLOG POSTS ===
  await seedPosts(prisma, users);
  
  console.log("DB seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
