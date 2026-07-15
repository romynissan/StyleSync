/** Understated chart palette — neutrals with blush highlight */
export const CHART_COLORS = {
  accent: "#E8B7C8",
  ink: "#2F2F2F",
  muted: "#6B6B6B",
  faint: "#9A9590",
  border: "#DDD5CE",
  grid: "#E8E0D8",
  series: ["#E8B7C8", "#2F2F2F", "#A8988C"] as const,
} as const;

export const chartAxisTick = {
  fontSize: 11,
  fill: "#6B6B6B",
} as const;
