import { useEffect } from "react";
import { useDataStore } from "../stores/dataStore";
import { useCellStyleStore } from "../stores/cellStyleStore";
import { useSheetHistoryStore } from "../stores/historyStore";
import { useSheetSelectionStore } from "../stores/selectionStore";

export default function useKeyboardShortcuts({ rows, cols }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;

      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (isTyping) return;

      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      const history = useSheetHistoryStore.getState();

      const getRange = () => {
        const sel = useSheetSelectionStore.getState();

        if (sel.selectedRange) return sel.selectedRange;

        if (sel.activeCell) {
          const [r, c] = sel.activeCell;
          return [r, c, r, c];
        }

        return null;
      };

      /* ================= UNDO / REDO ================= */
      if (ctrl && key === "z" && !e.shiftKey) {
        e.preventDefault();
        history.undo();
        return;
      }

      if (ctrl && (key === "y" || (key === "z" && e.shiftKey))) {
        e.preventDefault();
        history.redo();
        return;
      }

      /* ================= COPY / CUT ================= */
      if (ctrl && (key === "c" || key === "x")) {
        const range = getRange();
        if (!range) return;

        e.preventDefault();

        const dataStore = useDataStore.getState();
        const styleStore = useCellStyleStore.getState();

        const [r1, c1, r2, c2] = range;

        const sr = Math.min(r1, r2);
        const er = Math.max(r1, r2);
        const sc = Math.min(c1, c2);
        const ec = Math.max(c1, c2);

        const values = [];
        const styles = [];

        for (let r = sr; r <= er; r++) {
          const vRow = [];
          const sRow = [];

          for (let c = sc; c <= ec; c++) {
            const k = `${r}:${c}`;
            vRow.push(dataStore.cells[k] || "");
            sRow.push(styleStore.styles[k] || null);
          }

          values.push(vRow);
          styles.push(sRow);
        }

        const text = values.map((r) => r.join("\t")).join("\n");

        navigator.clipboard?.writeText(text).catch(() => {});

        // 🔥 IMPORTANT: snapshot clipboard ngay lúc này
        useSheetSelectionStore.getState().setClipboard({
          range: [sr, sc, er, ec],
          mode: key === "x" ? "cut" : "copy",
          data: { text, values, styles },
        });

        return;
      }

      /* ================= PASTE ================= */
      if (ctrl && key === "v") {
        const selStore = useSheetSelectionStore.getState();
        const clipboard = selStore.clipboard; // 🔥 ALWAYS FRESH

        const start = selStore.activeCell || selStore.selectionStart;
        if (!start) return;

        e.preventDefault();

        const historyStore = useSheetHistoryStore.getState();
        const [sr, sc] = start;

        historyStore.pushSnapshot();

        navigator.clipboard.readText().then((text) => {
          const rowsText = text?.split("\n").filter(Boolean) || [];
          const matrix = rowsText.map((r) => r.split("\t"));

          useDataStore.setState((state) => {
            const next = { ...state.cells };

            // ================= PASTE =================
            for (let r = 0; r < matrix.length; r++) {
              for (let c = 0; c < matrix[r].length; c++) {
                next[`${sr + r}:${sc + c}`] = matrix[r][c];
              }
            }

            // ================= CUT DELETE (FIXED) =================
            if (clipboard?.mode === "cut" && clipboard.range) {
              const [r1, c1, r2, c2] = clipboard.range;

              for (let r = r1; r <= r2; r++) {
                for (let c = c1; c <= c2; c++) {
                  const key = `${r}:${c}`;
                  if (next[key] !== undefined) {
                    delete next[key];
                  }
                }
              }
            }

            return { cells: { ...next } }; // 🔥 FORCE NEW REF
          });

          // ================= STYLE DELETE =================
          if (clipboard?.mode === "cut" && clipboard.range) {
            const [r1, c1, r2, c2] = clipboard.range;

            useCellStyleStore.setState((state) => {
              const next = { ...state.styles };

              for (let r = r1; r <= r2; r++) {
                for (let c = c1; c <= c2; c++) {
                  delete next[`${r}:${c}`];
                }
              }

              return { styles: { ...next } };
            });
          }

          // ================= CLEAR CLIPBOARD =================
          useSheetSelectionStore.getState().clearClipboard();
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rows, cols]);
}
