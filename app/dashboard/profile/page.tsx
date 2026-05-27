import * as React from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProfileClient } from "@/components/ProfileClient";
import { getSessionUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya | CRM Harga Telur Indonesia",
  description: "Ubah data akun blogger, ganti email, dan kata sandi di platform CRM Harga Telur Indonesia.",
};

export default async function ProfilePage() {
  // 1. Authenticate user session
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
      {/* Pass the verified user session context to sidebar */}
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <ProfileClient user={user} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
