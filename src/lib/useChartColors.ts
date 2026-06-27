"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export type ChartColors = ReturnType<typeof useChartColors>;

export function useChartColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    bronze: dark ? "#C8A06A" : "#B08D57",
    sand: dark ? "#8A7C5F" : "#DCC9A6",
    success: dark ? "#4ADE80" : "#16A34A",
    warning: dark ? "#FBBF24" : "#D97706",
    danger: dark ? "#F87171" : "#DC2626",
    // Reserved for additional chart series introduced in later page phases.
    slate: dark ? "#94A3B8" : "#64748B",
    info: dark ? "#60A5FA" : "#2563EB",
    grid: dark ? "#2E3540" : "#E4DED1",
    axis: dark ? "#9C9284" : "#6B6B6B",
    tooltipBg: dark ? "#161C26" : "#FFFFFF",
    tooltipBorder: dark ? "#2E3540" : "#E4DED1",
    tooltipText: dark ? "#F8F3EA" : "#101418",
  };
}
