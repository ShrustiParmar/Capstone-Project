
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-app dark:bg-app-dark">
        <AppSidebar />
        <main className="flex-1 p-6 animate-fadeIn">
          <SidebarTrigger className="mb-4" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
