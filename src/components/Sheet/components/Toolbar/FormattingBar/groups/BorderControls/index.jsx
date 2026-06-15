import { memo, useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import ToolGroup from "../../base/ToolGroup";
import ToolButton from "../../base/ToolButton";
import { BORDER_PRESETS } from "./borderPresets";
import classNames from "classnames/bind";
import styles from "./border-controls.module.scss";

const cx = classNames.bind(styles);

/* ================= POPUP ================= */

function BorderPopup({ open, position, current, onSelect, onClose }) {
  const popupRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={popupRef}
      className={cx("popup")}
      style={{
        position: "fixed",
        top: position.top + 6,
        left: position.left,
      }}
    >
      <div className={cx("grid")}>
        {BORDER_PRESETS.map((item) => (
          <button
            key={item.key}
            className={cx("item", { active: current === item.key })}
            onClick={() => {
              onSelect(item.key);
              onClose();
            }}
          >
            <Icon icon={item.icon} width="20" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default memo(function BorderControls({
  selectedStyle,
  disabled,
  setBorderPreset,
}) {
  const preset = selectedStyle?.borderPreset || "none";

  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleOpen = () => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom,
      left: rect.left,
    });

    setOpen(true);
  };

  return (
    <ToolGroup style={{ position: "relative" }}>
      <ToolButton
        ref={btnRef}
        active={preset !== "none"}
        disabled={disabled}
        onClick={handleOpen}
      >
        <Icon icon="material-symbols:border-all" width="18" />
      </ToolButton>

      <BorderPopup
        open={open}
        position={pos}
        current={preset}
        onSelect={setBorderPreset}
        onClose={() => setOpen(false)}
      />
    </ToolGroup>
  );
});
