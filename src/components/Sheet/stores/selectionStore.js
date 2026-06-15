import { create } from "zustand";
import { useDataStore } from "./dataStore";

function normalizeRange(start, end, mode) {
  if (!start || !end) return null;

  const [sr, sc] = start;
  const [er, ec] = end;

  const minRow = Math.min(sr, er);
  const maxRow = Math.max(sr, er);
  const minCol = Math.min(sc, ec);
  const maxCol = Math.max(sc, ec);

  if (mode === "cell") return [sr, sc, sr, sc];

  if (mode === "linear") {
    const width = maxCol - minCol;
    const height = maxRow - minRow;

    return width >= height
      ? [sr, minCol, sr, maxCol]
      : [minRow, sc, maxRow, sc];
  }

  return [minRow, minCol, maxRow, maxCol];
}

export const useSheetSelectionStore = create((set, get) => ({
  activeCell: null,
  selectedRange: null,
  selectionStart: null,
  isSelecting: false,
  selectMode: "range",

  editingCell: null,
  editingValue: "",

  /* ================= FIXED CLIPBOARD ================= */
  clipboard: {
    range: null,
    mode: null, // "copy" | "cut"
    data: null,
  },

  /* ================= EDITING ================= */
  startEditing: (row, col) => {
    const value = useDataStore.getState().cells?.[`${row}:${col}`] || "";

    set({
      editingCell: [row, col],
      activeCell: [row, col],
      editingValue: value,
    });
  },

  setEditingValue: (value) => set({ editingValue: value }),

  commitEditing: () => {
    const { editingCell, editingValue } = get();
    if (!editingCell) return;

    const [row, col] = editingCell;

    useDataStore.getState().setCellValue(row, col, editingValue);

    set({
      editingCell: null,
      editingValue: "",
    });
  },

  cancelEditing: () =>
    set({
      editingCell: null,
      editingValue: "",
    }),

  /* ================= CLIPBOARD ================= */
  setClipboard: (payload) =>
    set({
      clipboard: {
        range: payload?.range || null,
        mode: payload?.mode || null,
        data: payload?.data || null,
      },
    }),

  clearClipboard: () =>
    set({
      clipboard: {
        range: null,
        mode: null,
        data: null,
      },
    }),

  /* ================= SELECTION ================= */
  startSelection: (row, col) =>
    set({
      activeCell: [row, col],
      selectionStart: [row, col],
      selectedRange: [row, col, row, col],
      isSelecting: true,
    }),

  updateSelection: (row, col) => {
    const { selectionStart, isSelecting, selectMode } = get();
    if (!selectionStart || !isSelecting) return;

    set({
      selectedRange: normalizeRange(selectionStart, [row, col], selectMode),
    });
  },

  stopSelection: () => set({ isSelecting: false }),
}));
