import { memo } from "react";
import { Icon } from "@iconify/react";
import ToolGroup from "../../base/ToolGroup";
import ToolButton from "../../base/ToolButton";

export default memo(function AlignControls({
  selectedStyle,
  disabled,
  setTextAlign,
}) {
  const align = selectedStyle?.align || "left";

  return (
    <ToolGroup>
      <ToolButton
        active={align === "left"}
        onClick={() => setTextAlign("left")}
        disabled={disabled}
      >
        <Icon icon="material-symbols:format-align-left" width="18" />
      </ToolButton>

      <ToolButton
        active={align === "center"}
        onClick={() => setTextAlign("center")}
        disabled={disabled}
      >
        <Icon icon="material-symbols:format-align-center" width="18" />
      </ToolButton>

      <ToolButton
        active={align === "right"}
        onClick={() => setTextAlign("right")}
        disabled={disabled}
      >
        <Icon icon="material-symbols:format-align-right" width="18" />
      </ToolButton>
    </ToolGroup>
  );
});
