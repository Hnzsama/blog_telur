import * as React from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PostFormClient } from "@/components/PostFormClient";
import { getSessionUser } from "@/lib/auth";

export default async function NewPostPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
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
          <PostFormClient user={user} mode="create" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
