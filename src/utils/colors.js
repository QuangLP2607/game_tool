export const COLOR_PALETTE = [
  { strong: "#16a34a", soft: "#22c55e" }, // green
  { strong: "#ca8a04", soft: "#eab308" }, // yellow
  { strong: "#dc2626", soft: "#ef4444" }, // red
  { strong: "#7c3aed", soft: "#8b5cf6" }, // purple
  { strong: "#ea580c", soft: "#f97316" }, // orange
  { strong: "#0891b2", soft: "#06b6d4" }, // cyan
  { strong: "#db2777", soft: "#ec4899" }, // pink
  { strong: "#0f766e", soft: "#14b8a6" }, // teal
  { strong: "#65a30d", soft: "#84cc16" }, // lime
  { strong: "#d97706", soft: "#f59e0b" }, // amber
  { strong: "#4f46e5", soft: "#6366f1" }, // indigo
  { strong: "#0284c7", soft: "#0ea5e9" }, // sky
  { strong: "#9333ea", soft: "#a855f7" }, // violet
  { strong: "#059669", soft: "#10b981" }, // emerald
  { strong: "#c026d3", soft: "#d946ef" }, // fuchsia
  { strong: "#e11d48", soft: "#f43f5e" }, // rose
  { strong: "#0369a1", soft: "#0284c7" }, // deep sky
  { strong: "#15803d", soft: "#16a34a" }, // deep green
  { strong: "#b45309", soft: "#d97706" }, // brown-orange
  { strong: "#2563eb", soft: "#3b82f6" }, // blue
];

export function getItemColor(index = 0) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}
