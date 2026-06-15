import { create } from "zustand";

const DEFAULT_COL_WIDTH = 120;
const DEFAULT_ROW_HEIGHT = 22;

function buildPrefix(arr, getDefault) {
  const prefix = [0];
  for (let i = 0; i < arr.length; i++) {
    const size = arr[i] ?? getDefault();
    prefix[i + 1] = prefix[i] + size;
  }
  return prefix;
}

export const useSizeStore = create((set, get) => ({
  colSizes: [],
  rowSizes: [],

  colPrefix: [0],
  rowPrefix: [0],

  /* ================= resize ================= */

  resizeColumn: (index, width) =>
    set((state) => {
      const next = [...state.colSizes];
      next[index] = Math.max(40, width);

      return {
        colSizes: next,
        colPrefix: buildPrefix(next, () => DEFAULT_COL_WIDTH),
      };
    }),

  resizeRow: (index, height) =>
    set((state) => {
      const next = [...state.rowSizes];
      next[index] = Math.max(18, height);

      return {
        rowSizes: next,
        rowPrefix: buildPrefix(next, () => DEFAULT_ROW_HEIGHT),
      };
    }),

  /* ================= getters ================= */

  getColumnWidth: (i) => get().colSizes[i] ?? DEFAULT_COL_WIDTH,

  getRowHeight: (i) => get().rowSizes[i] ?? DEFAULT_ROW_HEIGHT,

  /* ================= OFFSET O(1) ================= */

  getColumnOffset: (col) => get().colPrefix[col],
  getRowOffset: (row) => get().rowPrefix[row],
}));
