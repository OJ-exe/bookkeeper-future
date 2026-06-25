import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/SidebarProvider";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { ToastProvider } from "@/components/ui/Toast";

// Runs before paint so the sidebar opens at its saved width with no flash/jump.
const sidebarScript = `(function(){try{var s=localStorage.getItem('sidebar');document.documentElement.setAttribute('data-sidebar',s==='collapsed'?'collapsed':'expanded');}catch(e){document.documentElement.setAttribute('data-sidebar','expanded');}})();`;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <SidebarProvider>
        <script dangerouslySetInnerHTML={{ __html: sidebarScript }} />
        <div className="min-h-screen bg-canvas">
          <Sidebar />
          <DashboardMain>{children}</DashboardMain>
        </div>
      </SidebarProvider>
    </ToastProvider>
  );
}
