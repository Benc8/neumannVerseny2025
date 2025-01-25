"use client";

import { usePathname } from "next/navigation";
import { Home, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Létrehozás",
    url: "/admin/create",
    icon: Plus,
  },
];

export function AppSidebar() {
  const pathname = usePathname(); // Use usePathname instead of useRouter for Next.js App Router

  return (
    <Sidebar className="bg-white dark:bg-gray-900 shadow-lg w-64 h-screen flex flex-col justify-center">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col items-center space-y-4 mt-3">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className={"w-max"}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-3 p-5 w-full text-xl font-semibold rounded-lg   
                          ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md hover:bg-blue-600 dark:hover:bg-blue-600"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                          }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
