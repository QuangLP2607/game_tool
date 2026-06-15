import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./formula-bar.module.scss";

import { useSheetSelectionStore } from "../../../stores/selectionStore";
import { useDataStore } from "../../../stores/dataStore";
import { useShallow } from "zustand/react/shallow";

const cx = classNames.bind(styles);

export default function FormulaBar() {
  const navigate = useNavigate();

  const {
    selection,
    activeCell,
    editingCell,
    editingValue,
    setEditingValue,
    startEditing,
    commitEditing,
  } = useSheetSelectionStore(
    useShallow((s) => ({
      selection: s.selectedRange,
      activeCell: s.activeCell,
      editingCell: s.editingCell,
      editingValue: s.editingValue,
      setEditingValue: s.setEditingValue,
      startEditing: s.startEditing,
      commitEditing: s.commitEditing,
    })),
  );

  const cells = useDataStore((s) => s.cells);

  // ===== VALUE HIỂN THỊ =====
  let displayValue = "";

  if (editingCell) {
    displayValue = editingValue;
  } else if (activeCell) {
    const key = activeCell[0] + ":" + activeCell[1];
    displayValue = cells[key] || "";
  }

  return (
    <div className={cx("toolbar")}>
      {/* <button className={cx("toolbar__backBtn")} onClick={() => navigate(-1)}>
        ← Back
      </button> */}

      <div className={cx("toolbar__info")}>
        {/* ===== ADDRESS ===== */}
        <span className={cx("toolbar__info-address")}>
          {selection &&
            `${String.fromCharCode(65 + selection[1])}${selection[0] + 1}`}
        </span>

        {/* ===== FORMULA BAR ===== */}
        <textarea
          className={cx("toolbar__info-value")}
          value={displayValue}
          placeholder="Enter value..."
          onChange={(e) => {
            // nếu chưa editing → bắt đầu edit cell hiện tại
            if (!editingCell && activeCell) {
              startEditing(activeCell[0], activeCell[1]);
            }
            setEditingValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitEditing();
            }
          }}
        />
      </div>
    </div>
  );
}
