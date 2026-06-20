"use client";

import { useSidebar } from "@/components/dashboard/SidebarProvider";

export default function DashboardMain({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();
  return (
    <main
      className={`min-h-screen px-4 lg:px-8 py-6 transition-[margin] duration-300 ease-out ${
        collapsed ? "lg:ml-16" : "lg:ml-72"
      }`}
    >
      <div className="max-w-[1600px] mx-auto">{children}</div>
    </main>
  );
}
