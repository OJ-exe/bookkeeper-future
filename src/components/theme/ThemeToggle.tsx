"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="h-10 w-10 rounded-xl bg-surface border border-line text-fg-soft shadow-[var(--shadow-xs)] flex items-center justify-center hover:bg-bronze-soft hover:text-bronze transition"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
