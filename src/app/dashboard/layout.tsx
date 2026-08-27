import {Sidebar} from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/SidebarProvider";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { ToastProvider } from "@/components/ui/Toast";

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
        <div className="min-h-screen bg-canvas text-fg">
          <Sidebar />
          <DashboardMain>{children}</DashboardMain>
        </div>
      </SidebarProvider>
    </ToastProvider>
  );
}