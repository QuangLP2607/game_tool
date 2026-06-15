import { useCallback } from "react";
import { useSheetSelectionStore } from "../../stores/selectionStore";
import classNames from "classnames/bind";
import styles from "./corner.module.scss";

const cx = classNames.bind(styles);

export default function Corner({ width, height, rows, cols }) {
  const handleSelectAll = useCallback(
    (e) => {
      e.preventDefault();

      const maxRow = Math.max(0, rows - 1);
      const maxCol = Math.max(0, cols - 1);
      const selectionStore = useSheetSelectionStore.getState();

      if (selectionStore.editingCell) {
        selectionStore.commitEditing();
      }

      selectionStore.startSelection(0, 0);
      selectionStore.updateSelection(maxRow, maxCol);
      selectionStore.stopSelection();
    },
    [rows, cols],
  );

  return (
    <button
      type="button"
      className={cx("corner")}
      style={{ width, height }}
      onMouseDown={handleSelectAll}
      title="Select all cells"
      aria-label="Select all cells"
    />
  );
}
