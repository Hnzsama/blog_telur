import * as React from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardClient } from "@/components/DashboardClient";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // 1. Authenticate user session
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Query posts from database based on user's role
  let posts: any[] = [];
  try {
    if (user.role === "ADMIN") {
      // Admins see all posts from all users
      posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          images: true,
        },
      });
    } else {
      // Regular users only see their own posts
      posts = await prisma.post.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          images: true,
        },
      });
    }
  } catch (error) {
    console.error("Failed to query posts for dashboard:", error);
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* Pass the verified user session context to sidebar */}
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <DashboardClient user={user} posts={posts} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
