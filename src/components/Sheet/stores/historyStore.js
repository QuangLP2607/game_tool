import { create } from "zustand";
import { useDataStore } from "./dataStore";
import { useCellStyleStore } from "./cellStyleStore";

const MAX_HISTORY = 100;

function buildSnapshot() {
  return {
    cells: { ...useDataStore.getState().cells },
    styles: { ...useCellStyleStore.getState().styles },
  };
}

export const useSheetHistoryStore = create((set, get) => ({
  past: [],
  future: [],

  pushSnapshot: () =>
    set((state) => {
      const snapshot = buildSnapshot();
      const hasPast = state.past[state.past.length - 1];

      if (
        hasPast &&
        hasPast.cells === snapshot.cells &&
        hasPast.styles === snapshot.styles
      ) {
        return state;
      }

      const nextPast = [...state.past, snapshot];
      if (nextPast.length > MAX_HISTORY) nextPast.shift();

      return {
        past: nextPast,
        future: [],
      };
    }),

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return;

    const current = buildSnapshot();
    const previous = past[past.length - 1];

    useDataStore.setState({ cells: previous.cells });
    useCellStyleStore.setState({ styles: previous.styles });

    set({
      past: past.slice(0, -1),
      future: [current, ...future],
    });
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return;

    const current = buildSnapshot();
    const next = future[0];

    useDataStore.setState({ cells: next.cells });
    useCellStyleStore.setState({ styles: next.styles });

    const nextPast = [...past, current];
    if (nextPast.length > MAX_HISTORY) nextPast.shift();

    set({
      past: nextPast,
      future: future.slice(1),
    });
  },
}));
