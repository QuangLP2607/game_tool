import { memo } from "react";
import { Icon } from "@iconify/react";
import ToolGroup from "../../base/ToolGroup";
import ToolButton from "../../base/ToolButton";

export default memo(function VerticalAlignControls({
  selectedStyle,
  disabled,
  setVerticalAlign,
}) {
  const v = selectedStyle?.verticalAlign || "top";

  return (
    <ToolGroup>
      <ToolButton
        active={v === "top"}
        onClick={() => setVerticalAlign("top")}
        disabled={disabled}
      >
        <Icon icon="material-symbols:vertical-align-top" width="18" />
      </ToolButton>

      <ToolButton
        active={v === "middle"}
        onClick={() => setVerticalAlign("middle")}
        disabled={disabled}
      >
        <Icon icon="material-symbols:vertical-align-center" width="18" />
      </ToolButton>

      <ToolButton
        active={v === "bottom"}
        onClick={() => setVerticalAlign("bottom")}
        disabled={disabled}
      >
        <Icon icon="material-symbols:vertical-align-bottom" width="18" />
      </ToolButton>
    </ToolGroup>
  );
});
