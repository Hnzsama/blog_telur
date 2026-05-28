import * as React from "react";
import { redirect, notFound } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PostFormClient } from "@/components/PostFormClient";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  // Fetch post details with images
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      images: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Authorize edit access: must be ADMIN or the post author
  if (user.role !== "ADMIN" && post.authorId !== user.id) {
    redirect("/dashboard");
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
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <PostFormClient user={user} mode="edit" post={post} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
