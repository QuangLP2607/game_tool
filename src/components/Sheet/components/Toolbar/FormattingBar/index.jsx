import classNames from "classnames/bind";
import styles from "./formatting-bar.module.scss";

import { useSheetSelectionStore } from "../../../stores/selectionStore";
import useCellFormatting from "../../../hooks/useCellFormatting";

import HistoryControls from "./groups/HistoryControls";
import FontControls from "./groups/FontControls";
import TextStyleControls from "./groups/TextStyleControls";
import AlignControls from "./groups/AlignControls";
import VerticalAlignControls from "./groups/VerticalAlignControls";
import ColorControls from "./groups/ColorControls";
import BorderControls from "./groups/BorderControls";

const cx = classNames.bind(styles);

export default function FormattingBar() {
  const range = useSheetSelectionStore((s) => s.selectedRange);
  const formatting = useCellFormatting();

  const disabled = !range;

  return (
    <div className={cx("formatting-bar")}>
      <HistoryControls {...formatting} />
      <FontControls {...formatting} disabled={disabled} />
      <TextStyleControls {...formatting} disabled={disabled} />
      <AlignControls {...formatting} disabled={disabled} />
      <VerticalAlignControls {...formatting} disabled={disabled} />
      <ColorControls {...formatting} disabled={disabled} />
      <BorderControls {...formatting} disabled={disabled} />

      <button
        className={cx("clear-btn")}
        onClick={formatting.clearFormatting}
        disabled={disabled}
      >
        Clear
      </button>
    </div>
  );
}
