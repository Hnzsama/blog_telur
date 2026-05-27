import { prisma } from "./prisma";
import crypto from "crypto";
import { cookies, headers } from "next/headers";

// Hash password with scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

// Create session in database and set HttpOnly cookie
export async function createSession(userId: number): Promise<void> {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto");
  const referer = headersList.get("referer");
  const isSecure = proto === "https" || (referer ? referer.startsWith("https://") : false);

  console.log("createSession - Session created successfully. isSecure Cookie:", isSecure);

  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// Get currently logged-in user from session
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  console.log("getSessionUser - Session Cookie Present:", !!sessionId);
  if (!sessionId) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    console.log("getSessionUser - Session Found in Database:", !!session);
    if (!session) return null;

    // Check expiration
    const isExpired = session.expiresAt < new Date();
    console.log("getSessionUser - Session Expired:", isExpired, "Expires at:", session.expiresAt);
    if (isExpired) {
      // Clean up expired session
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Failed to retrieve session user:", error);
    return null;
  }
}

// Logout by deleting session from database and clearing cookie
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  
  if (sessionId) {
    await prisma.session.delete({
      where: { id: sessionId },
    }).catch(() => {});
  }

  cookieStore.delete("session_id");
}
