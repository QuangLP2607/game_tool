import { useCallback } from "react";
import { useSizeStore } from "../../stores/sizeStore";
import { useSheetSelectionStore } from "../../stores/selectionStore";
import { useDataStore } from "../../stores/dataStore";

import classNames from "classnames/bind";
import styles from "./row-header.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_HEIGHT = 22;
const OVERSCAN_ROWS = 4;

export default function RowHeader({
  rows,
  rowSizes,
  scrollTop,
  viewportHeight,
  labelFn,
  zoom,
  gridRef,
}) {
  /* ================= store ================= */

  const resizeRow = useSizeStore((s) => s.resizeRow);

  const activeCell = useSheetSelectionStore((s) => s.activeCell);
  const selectedRange = useSheetSelectionStore((s) => s.selectedRange);

  /* ================= resize ================= */

  const startResizeRow = useCallback(
    (e, index) => {
      e.preventDefault();
      e.stopPropagation(); // 🔥 tránh select row

      const startY = e.clientY;
      const startHeight = rowSizes[index] ?? DEFAULT_HEIGHT;

      let frame;

      const onMouseMove = (e) => {
        cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
          const delta = (e.clientY - startY) / zoom;
          const newHeight = Math.max(18, startHeight + delta);

          resizeRow(index, newHeight);
          gridRef.current?.resetAfterRowIndex(index);
        });
      };

      const onMouseUp = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [rowSizes, zoom, resizeRow, gridRef],
  );

  /* ================= virtual ================= */

  let acc = 0;
  let start = 0;

  while (
    start < rows &&
    acc + (rowSizes[start] || DEFAULT_HEIGHT) * zoom < scrollTop
  ) {
    acc += (rowSizes[start] || DEFAULT_HEIGHT) * zoom;
    start++;
  }

  const offsetY = acc - scrollTop;
  let visibleHeight = 0;
  let end = start;

  while (end < rows && visibleHeight < viewportHeight) {
    visibleHeight += (rowSizes[end] || DEFAULT_HEIGHT) * zoom;
    end++;
  }

  end = Math.min(rows, end + OVERSCAN_ROWS);

  /* ================= render ================= */

  return (
    <div
      className={cx("inner")}
      style={{
        transform: `translate3d(0, ${offsetY}px, 0)`,
      }}
    >
      {Array.from({ length: Math.max(0, end - start) }).map((_, idx) => {
        const i = start + idx;
        const baseHeight = rowSizes[i] || DEFAULT_HEIGHT;

        /* ================= selection logic ================= */

        const isActiveRow = activeCell && activeCell[0] === i;

        const isSelectedRow =
          selectedRange && i >= selectedRange[0] && i <= selectedRange[2];

        /* ================= select row ================= */

        const handleSelectRow = () => {
          const store = useSheetSelectionStore.getState();
          const cols = useDataStore.getState().cols;

          store.startSelection(i, 0);
          store.updateSelection(i, cols - 1);
          store.stopSelection();
        };

        return (
          <div
            key={i}
            className={cx("cell", {
              active: isActiveRow,
              selected: isSelectedRow,
            })}
            style={{
              height: baseHeight * zoom,
              fontSize: 12 * zoom,
            }}
            onMouseDown={handleSelectRow}
          >
            <span>{labelFn(i)}</span>

            {/* RESIZE HANDLE */}
            <div
              className={cx("resize")}
              onMouseDown={(e) => startResizeRow(e, i)}
            />
          </div>
        );
      })}
    </div>
  );
}
