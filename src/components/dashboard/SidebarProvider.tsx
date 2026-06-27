"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

// The <html data-sidebar> attribute is the single source of truth. A no-flash
// inline script sets it before first paint (see DashboardLayout); we read it
// via an external store so the rail/expanded width never flashes on reload and
// we avoid setState-in-effect (which the react-compiler lint rule disallows).
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-sidebar"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.getAttribute("data-sidebar") === "collapsed";
}

function getServerSnapshot(): boolean {
  return false;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCollapsed = useCallback((v: boolean) => {
    document.documentElement.setAttribute("data-sidebar", v ? "collapsed" : "expanded");
    try {
      localStorage.setItem("sidebar", v ? "collapsed" : "expanded");
    } catch {
      /* ignore storage errors (private mode) */
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(!getSnapshot());
  }, [setCollapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
