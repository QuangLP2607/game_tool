export const normalizeGrid = (rows = []) => {
  if (!rows.length) return [];

  const maxCols = Math.max(...rows.map((r) => r?.length || 0));

  return rows.map((r = []) =>
    Array.from({ length: maxCols }, (_, i) => r[i] ?? ""),
  );
};
