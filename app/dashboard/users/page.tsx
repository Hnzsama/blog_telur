import * as React from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserManagementClient } from "@/components/UserManagementClient";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Pengguna | CRM Harga Telur Indonesia",
  description: "Manajemen blogger dan kontributor Harga Telur Indonesia.",
};

export default async function UsersPage() {
  // 1. Authenticate user session
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Authorize ADMIN role only
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 3. Query all users and their post count
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to query users list for management page:", error);
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
          <UserManagementClient currentUser={user} users={users} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
