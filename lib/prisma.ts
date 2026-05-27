import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";
import path from "path";

let connectionString = process.env.DATABASE_URL || "file:./prisma/dev.db";

if (connectionString.startsWith("file:")) {
  const relativePath = connectionString.replace("file:", "");
  // Resolve path relative to process.cwd() (project root)
  const absolutePath = path.resolve(process.cwd(), relativePath);
  connectionString = `file:${absolutePath}`;
}

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };