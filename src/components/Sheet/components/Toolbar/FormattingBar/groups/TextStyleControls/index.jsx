import { memo } from "react";
import { Icon } from "@iconify/react";
import ToolGroup from "../../base/ToolGroup";
import ToolButton from "../../base/ToolButton";

export default memo(function TextStyleControls({
  selectedStyle,
  disabled,
  toggleBold,
  toggleItalic,
  toggleUnderline,
}) {
  return (
    <ToolGroup>
      <ToolButton
        active={selectedStyle?.bold}
        onClick={toggleBold}
        disabled={disabled}
      >
        <Icon icon="material-symbols:format-bold" width="18" />
      </ToolButton>

      <ToolButton
        active={selectedStyle?.italic}
        onClick={toggleItalic}
        disabled={disabled}
      >
        <Icon icon="material-symbols:format-italic" width="18" />
      </ToolButton>

      <ToolButton
        active={selectedStyle?.underline}
        onClick={toggleUnderline}
        disabled={disabled}
      >
        <Icon icon="material-symbols:format-underlined" width="18" />
      </ToolButton>
    </ToolGroup>
  );
});
