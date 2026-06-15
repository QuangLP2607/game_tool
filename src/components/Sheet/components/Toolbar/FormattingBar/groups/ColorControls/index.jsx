import { memo } from "react";
import ToolGroup from "../../base/ToolGroup";
import ColorSelect from "../../base/ColorSelect";
import { Icon } from "@iconify/react";
import styles from "./color-controls.module.scss";
import cx from "classnames/bind";

const cn = cx.bind(styles);

export default memo(function ColorControls({
  selectedStyle,
  setTextColor,
  setBackground,
}) {
  const textColor = selectedStyle?.color || "#202124";
  const bgColor = selectedStyle?.bg || "#ffffff";

  return (
    <ToolGroup>
      {/* TEXT COLOR */}
      <div className={cn("item")}>
        <ColorSelect value={textColor} onChange={setTextColor}>
          <div className={cn("buttonRow")}>
            <Icon icon="mdi:format-color-text" className={cn("icon")} />
            <span
              className={cn("fillPreview")}
              style={{ background: textColor }}
            />
          </div>
        </ColorSelect>
      </div>

      {/* FILL COLOR */}
      <div className={cn("item")}>
        <ColorSelect value={bgColor} onChange={setBackground}>
          <div className={cn("buttonRow")}>
            <Icon icon="mdi:format-color-fill" className={cn("icon")} />
            <span
              className={cn("fillPreview")}
              style={{ background: bgColor }}
            />
          </div>
        </ColorSelect>
      </div>
    </ToolGroup>
  );
});
