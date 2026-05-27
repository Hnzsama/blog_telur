"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, FileTextIcon, EggIcon, Users, User } from "lucide-react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: "", // triggers initials fallback
  };

  const navItems = [
    {
      title: "Blog Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon />
      ),
    },
    ...(user.role === "ADMIN" ? [
      {
        title: "Kelola Pengguna",
        url: "/dashboard/users",
        icon: (
          <Users />
        ),
      }
    ] : []),
    {
      title: "Profil Saya",
      url: "/dashboard/profile",
      icon: (
        <User />
      ),
    },
    {
      title: "Lihat Website",
      url: "/",
      icon: (
        <FileTextIcon />
      ),
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <div className="flex size-6 items-center justify-center rounded bg-amber-500 text-white">
                  <EggIcon className="size-4" />
                </div>
                <span className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50">Harga Telur</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

