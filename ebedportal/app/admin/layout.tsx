"use server";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AdminTitle from "@/components/AdminTitle";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //const result = await db.select().from(users);

  return (
    <SidebarProvider className="flex root-container-admin">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mt-3">
          <SidebarTrigger />
          <AdminTitle />
        </div>

        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
