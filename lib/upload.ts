import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { prisma } from "./prisma";

interface SaveImagesResult {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  altText: string | null;
  postId: number;
  createdAt: Date;
}

// Service to save, process, and convert uploaded images to WebP format with metadata
// TODO(security): The upload directory is currently inside the web root (public/uploads) because these
// are public blog images that need to be served directly via Next.js. For non-public assets, store them
// outside the web root and serve through an authenticated stream.
export async function saveUploadedImages(files: File[], postId: number): Promise<SaveImagesResult[]> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  
  // Ensure the uploads directory exists
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create uploads directory:", err);
  }

  const savedImages: SaveImagesResult[] = [];

  for (const file of files) {
    // Basic validation: skip empty entries or non-images
    // Basic validation: skip empty entries, non-images, or files exceeding 5MB
    // TODO(security): Integrate anti-virus scan or CDR tools if implementing production-grade uploads
    if (!file || file.size === 0 || !file.name || !file.type.startsWith("image/")) {
      continue;
    }
    if (file.size > 5 * 1024 * 1024) {
      console.warn(`File ${file.name} ignored because it exceeds the 5MB limit`);
      continue;
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // 1. Initialize Sharp on original buffer
      const sharpInstance = sharp(buffer);
      
      // 2. Extract dimensions and file metadata from original image
      const metadata = await sharpInstance.metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      // 3. Convert image to WebP format
      const webpBuffer = await sharpInstance
        .webp({ quality: 80 })
        .toBuffer();

      // 4. Generate a clean unique filename
      const cleanName = path.parse(file.name).name
        .replace(/[^a-z0-9_-]/gi, "")
        .toLowerCase()
        .substring(0, 30);
      const filename = `${cleanName}-${Date.now()}.webp`;
      const filepath = path.join(uploadDir, filename);

      // 5. Write converted buffer to the local disk
      await fs.writeFile(filepath, webpBuffer);

      // 6. Record WebP metadata in database
      const dbImage = await prisma.postImage.create({
        data: {
          url: `/uploads/${filename}`,
          filename,
          mimeType: "image/webp",
          size: webpBuffer.length,
          width,
          height,
          altText: file.name,
          postId,
        },
      });

      savedImages.push(dbImage);
    } catch (err) {
      console.error(`Error processing image ${file.name}:`, err);
    }
  }

  return savedImages;
}
