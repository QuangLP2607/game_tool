import { useCellStyleStore } from "../stores/cellStyleStore";
import { useSheetSelectionStore } from "../stores/selectionStore";
import { useSheetHistoryStore } from "../stores/historyStore";
import { useCallback, useMemo } from "react";

export default function useCellFormatting() {
  const setRangeStyle = useCellStyleStore((s) => s.setRangeStyle);
  const clearRangeStyle = useCellStyleStore((s) => s.clearRangeStyle);
  const styles = useCellStyleStore((s) => s.styles);
  const pushSnapshot = useSheetHistoryStore((s) => s.pushSnapshot);
  const undo = useSheetHistoryStore((s) => s.undo);
  const redo = useSheetHistoryStore((s) => s.redo);
  const canUndo = useSheetHistoryStore((s) => s.past.length > 0);
  const canRedo = useSheetHistoryStore((s) => s.future.length > 0);
  const range = useSheetSelectionStore((s) => s.selectedRange);

  const selectedStyle = useMemo(() => {
    if (!range) return null;
    const [row, col] = range;
    return styles[`${row}:${col}`] || null;
  }, [range, styles]);

  const applyStyle = useCallback(
    (style) => {
      if (!range) return;
      pushSnapshot();
      setRangeStyle(range, style);
    },
    [range, setRangeStyle, pushSnapshot],
  );

  const setBackground = useCallback(
    (color) => {
      applyStyle({ bg: color });
    },
    [applyStyle],
  );

  const toggleBold = useCallback(() => {
    applyStyle({ bold: !selectedStyle?.bold });
  }, [applyStyle, selectedStyle]);

  const toggleItalic = useCallback(() => {
    applyStyle({ italic: !selectedStyle?.italic });
  }, [applyStyle, selectedStyle]);

  const toggleUnderline = useCallback(() => {
    applyStyle({ underline: !selectedStyle?.underline });
  }, [applyStyle, selectedStyle]);

  const setTextAlign = useCallback(
    (align) => {
      applyStyle({ align });
    },
    [applyStyle],
  );

  const setTextColor = useCallback(
    (color) => {
      applyStyle({ color });
    },
    [applyStyle],
  );

  const setFontSize = useCallback(
    (fontSize) => {
      applyStyle({ fontSize });
    },
    [applyStyle],
  );

  const setFontFamily = useCallback(
    (fontFamily) => {
      applyStyle({ fontFamily });
    },
    [applyStyle],
  );

  const setVerticalAlign = useCallback(
    (verticalAlign) => {
      applyStyle({ verticalAlign });
    },
    [applyStyle],
  );

  const setBorderPreset = useCallback(
    (borderPreset) => {
      applyStyle({ borderPreset });
    },
    [applyStyle],
  );

  const clearFormatting = useCallback(() => {
    if (!range) return;
    pushSnapshot();
    clearRangeStyle(range);
  }, [range, clearRangeStyle, pushSnapshot]);

  return {
    selectedStyle,
    setBackground,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    setTextAlign,
    setVerticalAlign,
    setBorderPreset,
    setFontSize,
    setFontFamily,
    setTextColor,
    clearFormatting,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
