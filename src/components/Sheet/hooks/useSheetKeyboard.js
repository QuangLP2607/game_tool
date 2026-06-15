import { useEffect, useCallback } from "react";
import { useSheetSelectionStore } from "../stores/selectionStore";
import { useDataStore } from "../stores/dataStore";

export default function useSheetKeyboard({ rows, cols }) {
  const {
    activeCell,
    startSelection,
    updateSelection,
    startEditing,
    commitEditing,
    cancelEditing,
    editingCell,
  } = useSheetSelectionStore();

  const [row = 0, col = 0] = activeCell || [];

  const clamp = useCallback(
    (r, c) => [
      Math.max(0, Math.min(rows - 1, r)),
      Math.max(0, Math.min(cols - 1, c)),
    ],
    [rows, cols],
  );

  const move = useCallback(
    (dr, dc, extend = false) => {
      const [nr, nc] = clamp(row + dr, col + dc);

      if (extend) {
        updateSelection(nr, nc);
      } else {
        startSelection(nr, nc);
      }
    },
    [row, col, clamp, startSelection, updateSelection],
  );

  const handleKeyDown = useCallback(
    (e) => {
      const key = e.key;

      /* ================= EDIT MODE ================= */
      if (editingCell) {
        if (key === "Enter") {
          commitEditing();
          move(1, 0);
        } else if (key === "Escape") {
          cancelEditing();
        }
        return;
      }

      /* ================= DELETE ================= */
      if (key === "Backspace" || key === "Delete") {
        const { selectedRange, activeCell } = useSheetSelectionStore.getState();

        const range =
          selectedRange || (activeCell ? [...activeCell, ...activeCell] : null);

        if (!range) return;

        let [r1, c1, r2, c2] = range;

        // normalize range
        if (r1 > r2) [r1, r2] = [r2, r1];
        if (c1 > c2) [c1, c2] = [c2, c1];

        useDataStore.getState().clearRange(r1, c1, r2, c2);

        e.preventDefault();
        return;
      }

      /* ================= ENTER EDIT ================= */
      if (key === "Enter") {
        startEditing(row, col);
        e.preventDefault();
        return;
      }

      /* ================= ARROWS ================= */
      if (key === "ArrowUp") {
        move(-1, 0, e.shiftKey);
        e.preventDefault();
      }
      if (key === "ArrowDown") {
        move(1, 0, e.shiftKey);
        e.preventDefault();
      }
      if (key === "ArrowLeft") {
        move(0, -1, e.shiftKey);
        e.preventDefault();
      }
      if (key === "ArrowRight") {
        move(0, 1, e.shiftKey);
        e.preventDefault();
      }

      /* ================= TYPING → AUTO EDIT ================= */
      if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
        startEditing(row, col);
      }
    },
    [editingCell, row, col, move, startEditing, commitEditing, cancelEditing],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
