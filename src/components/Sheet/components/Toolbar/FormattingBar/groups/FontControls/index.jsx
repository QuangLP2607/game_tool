import { memo, useCallback } from "react";
import ToolGroup from "../../base/ToolGroup";
import ToolCombobox from "../../base/ToolCombobox";
import { useCellStyleStore } from "../../../../../stores/cellStyleStore";
import { useSheetSelectionStore } from "../../../../../stores/selectionStore";

import { Icon } from "@iconify/react";

import styles from "./font-controls.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const FONT_OPTIONS = [
  { label: "Inter", value: "Inter, Arial, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Roboto", value: "Roboto, Arial, sans-serif" },
  { label: "Times", value: '"Times New Roman", serif' },
  { label: "Mono", value: '"JetBrains Mono", Consolas, monospace' },
];

const FONT_SIZE_OPTIONS = [12, 14, 16, 18, 20, 24, 28].map((s) => ({
  label: String(s),
  value: s,
}));

function parseFontSize(input) {
  const cleaned = input.trim();
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Math.min(200, Math.max(6, n));
}

function clampFontSize(n) {
  return Math.min(200, Math.max(6, n));
}

export default memo(function FontControls({
  disabled,
  setFontFamily,
  setFontSize,
}) {
  const range = useSheetSelectionStore((s) => s.selectedRange);
  const activeCell = useSheetSelectionStore((s) => s.activeCell);

  const style = useCellStyleStore((state) => {
    let row, col;

    if (range) {
      [row, col] = range;
    } else if (activeCell) {
      [row, col] = activeCell;
    } else {
      return null;
    }

    return state.styles[`${row}:${col}`] || null;
  });

  const fontFamily = style?.fontFamily ?? FONT_OPTIONS[0].value;
  const fontSize = style?.fontSize ?? 16;

  // ===== handlers =====
  const handleDecrease = useCallback(() => {
    setFontSize(clampFontSize(fontSize - 1));
  }, [fontSize, setFontSize]);

  const handleIncrease = useCallback(() => {
    setFontSize(clampFontSize(fontSize + 1));
  }, [fontSize, setFontSize]);

  const handleChangeSize = useCallback(
    (v) => {
      if (v == null) return;
      setFontSize(clampFontSize(v));
    },
    [setFontSize],
  );

  return (
    <ToolGroup>
      {/* FONT FAMILY */}
      <ToolCombobox
        value={fontFamily}
        options={FONT_OPTIONS}
        onChange={setFontFamily}
        disabled={disabled}
        width={100}
        allowCustom={false}
        clearOnFocus
      />

      {/* FONT SIZE + - */}
      <div className={cx("font-size-group")}>
        <button
          className={cx("font-size-button")}
          onMouseDown={(e) => e.preventDefault()} // giữ focus cell
          onClick={handleDecrease}
          disabled={disabled}
        >
          <Icon icon="ph:minus" width="16" height="16" />
        </button>

        <ToolCombobox
          value={fontSize}
          options={FONT_SIZE_OPTIONS}
          onChange={handleChangeSize}
          disabled={disabled}
          width={40}
          textAlign="center"
          allowCustom
          parseInput={parseFontSize}
          disableFilter
        />

        <button
          className={cx("font-size-button")}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleIncrease}
          disabled={disabled}
        >
          <Icon icon="ph:plus" width="16" height="16" />
        </button>
      </div>
    </ToolGroup>
  );
});
