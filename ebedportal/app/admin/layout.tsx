import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AdminTitle from "@/components/AdminTitle";

export default function Layout({ children }: { children: React.ReactNode }) {
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
