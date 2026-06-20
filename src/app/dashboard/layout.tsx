import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Topbar />
          {children}
        </div>
      </main>
    </div>
  );
}
