import { memo } from "react";
import { Icon } from "@iconify/react";
import ToolGroup from "../../base/ToolGroup";
import ToolButton from "../../base/ToolButton";

export default memo(function HistoryControls({ undo, redo, canUndo, canRedo }) {
  return (
    <ToolGroup>
      <ToolButton onClick={undo} disabled={!canUndo} title="Undo">
        <Icon icon="material-symbols:undo" width="18" />
      </ToolButton>

      <ToolButton onClick={redo} disabled={!canRedo} title="Redo">
        <Icon icon="material-symbols:redo" width="18" />
      </ToolButton>
    </ToolGroup>
  );
});
