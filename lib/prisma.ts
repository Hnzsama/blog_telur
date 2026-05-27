import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";
import path from "path";
import fs from "fs";

let connectionString = process.env.DATABASE_URL || "file:./prisma/dev.db";

if (connectionString.startsWith("file:")) {
  const relativePath = connectionString.replace("file:", "");
  // Resolve path relative to project root
  const absolutePath = path.resolve(process.cwd(), relativePath);
  
  let finalPath = absolutePath;
  
  // If running on Vercel or serverless production environment, copy database to /tmp so it is writeable
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const writeableDbPath = "/tmp/dev.db";
    
    // Copy the bundled database file to /tmp if it doesn't exist yet
    if (!fs.existsSync(writeableDbPath)) {
      try {
        if (fs.existsSync(absolutePath)) {
          fs.copyFileSync(absolutePath, writeableDbPath);
          console.log(`Successfully copied database from ${absolutePath} to ${writeableDbPath}`);
        } else {
          console.error(`Bundled database not found at ${absolutePath}`);
        }
      } catch (err) {
        console.error("Failed to copy database to /tmp:", err);
      }
    }
    
    finalPath = writeableDbPath;
  }
  
  connectionString = `file:${finalPath}`;
}

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };