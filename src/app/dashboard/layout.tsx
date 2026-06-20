import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { SidebarProvider } from "@/components/dashboard/SidebarProvider";
import DashboardMain from "@/components/dashboard/DashboardMain";

// Runs before paint so the sidebar opens at its saved width with no flash/jump.
const sidebarScript = `(function(){try{var s=localStorage.getItem('sidebar');document.documentElement.setAttribute('data-sidebar',s==='collapsed'?'collapsed':'expanded');}catch(e){document.documentElement.setAttribute('data-sidebar','expanded');}})();`;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <script dangerouslySetInnerHTML={{ __html: sidebarScript }} />
      <div className="min-h-screen bg-canvas">
        <Sidebar />
        <DashboardMain>
          <Topbar />
          {children}
        </DashboardMain>
      </div>
    </SidebarProvider>
  );
}
