import { create } from "zustand";
import { useDataStore } from "./dataStore";

function mergeStyle(prev, patch) {
  if (!prev) return patch;
  return { ...prev, ...patch };
}

function isStyleEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i];
    if (a[key] !== b[key]) return false;
  }

  return true;
}

export const useCellStyleStore = create((set, get) => ({
  styles: {},

  /* ================= SINGLE CELL ================= */

  setCellStyle: (row, col, style) =>
    set((state) => {
      const key = row + ":" + col;
      const prev = state.styles[key];
      const nextStyle = mergeStyle(prev, style);

      // tránh update nếu không đổi gì
      if (isStyleEqual(prev, nextStyle)) return state;

      return {
        styles: {
          ...state.styles,
          [key]: nextStyle,
        },
      };
    }),

  /* ================= RANGE ================= */

  setRangeStyle: (range, style) =>
    set((state) => {
      if (!range) return state;

      const [r1, c1, r2, c2] = range;
      const { rows, cols } = useDataStore.getState();
      const maxRow = rows - 1;
      const maxCol = cols - 1;
      const startRow = Math.max(0, Math.min(r1, r2));
      const endRow = Math.min(maxRow, Math.max(r1, r2));
      const startCol = Math.max(0, Math.min(c1, c2));
      const endCol = Math.min(maxCol, Math.max(c1, c2));

      if (endRow < startRow || endCol < startCol) return state;

      const next = { ...state.styles };
      let changed = false;

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const key = r + ":" + c;
          const prev = next[key];
          const nextStyle = mergeStyle(prev, style);
          if (isStyleEqual(prev, nextStyle)) continue;
          next[key] = nextStyle;
          changed = true;
        }
      }

      if (!changed) return state;
      return { styles: next };
    }),

  clearRangeStyle: (range) =>
    set((state) => {
      if (!range) return state;

      const [r1, c1, r2, c2] = range;
      const { rows, cols } = useDataStore.getState();
      const maxRow = rows - 1;
      const maxCol = cols - 1;
      const startRow = Math.max(0, Math.min(r1, r2));
      const endRow = Math.min(maxRow, Math.max(r1, r2));
      const startCol = Math.max(0, Math.min(c1, c2));
      const endCol = Math.min(maxCol, Math.max(c1, c2));

      if (endRow < startRow || endCol < startCol) return state;

      const next = { ...state.styles };
      let changed = false;

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const key = r + ":" + c;
          if (!(key in next)) continue;
          delete next[key];
          changed = true;
        }
      }

      if (!changed) return state;
      return { styles: next };
    }),

  /* ================= GETTER (no hook) ================= */

  getCellStyle: (row, col) => {
    return get().styles[row + ":" + col];
  },
}));
