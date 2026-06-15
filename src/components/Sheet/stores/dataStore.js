import { create } from "zustand";
import { useSheetHistoryStore } from "./historyStore";
import { loadSheet, updateCell } from "@/services/sheetService";

export const useDataStore = create((set, get) => ({
  rows: 50,
  cols: 20,

  sheetId: null,

  cells: {},

  /* ================= load ================= */

  load: async (sheetName = "Sheet1") => {
    try {
      const result = await loadSheet(sheetName);

      console.log("response =", result);

      const cells = {};

      let maxRow = 50;
      let maxCol = 20;

      result.cells.forEach((cell) => {
        cells[`${cell.row_num}:${cell.col_num}`] = cell.value;

        maxRow = Math.max(maxRow, cell.row_num + 1);

        maxCol = Math.max(maxCol, cell.col_num + 1);
      });

      set({
        sheetId: result.sheetId,
        rows: maxRow,
        cols: maxCol,
        cells,
      });
    } catch (err) {
      console.error("load error:", err);
    }
  },

  /* ================= data ================= */

  setData: (data) => {
    useSheetHistoryStore.getState().pushSnapshot();

    set({
      rows: data.rows || 50,
      cols: data.cols || 20,
      cells: data.cells || {},
    });
  },

  setCellValue: async (row, col, value) => {
    const key = `${row}:${col}`;
    const current = get().cells[key] || "";

    if (current === value) return;

    useSheetHistoryStore.getState().pushSnapshot();

    // update UI trước
    set((state) => ({
      cells: {
        ...state.cells,
        [key]: value,
      },
    }));

    try {
      const sheetId = get().sheetId;

      if (!sheetId) {
        console.warn("sheetId not found");
        return;
      }

      await updateCell(sheetId, row, col, value);
    } catch (err) {
      console.error("update error:", err);
    }
  },

  getCellValue: (row, col) => {
    return get().cells[`${row}:${col}`];
  },

  getCellByAddress: (address) => {
    if (!address) return null;

    const match = address.match(/^([A-Z]+)(\d+)$/);

    if (!match) return null;

    const colLabel = match[1];
    const row = parseInt(match[2], 10) - 1;

    let col = 0;

    for (let i = 0; i < colLabel.length; i++) {
      col = col * 26 + (colLabel.charCodeAt(i) - 64);
    }

    col--;

    return get().cells[`${row}:${col}`];
  },

  clear: () => {
    if (Object.keys(get().cells).length === 0) return;

    useSheetHistoryStore.getState().pushSnapshot();

    set({
      cells: {},
    });
  },

  clearRange: (r1, c1, r2, c2) => {
    useSheetHistoryStore.getState().pushSnapshot();

    set((state) => {
      const next = {
        ...state.cells,
      };

      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          delete next[`${r}:${c}`];
        }
      }

      return {
        cells: next,
      };
    });
  },
}));
