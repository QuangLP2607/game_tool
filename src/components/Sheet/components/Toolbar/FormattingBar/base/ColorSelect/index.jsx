import { useMemo, useState, useRef, useEffect } from "react";
import cx from "classnames/bind";
import styles from "./color-select.module.scss";
import { DEFAULT_COLORS } from "./colors";
import ColorBox from "./ColorBox";

const cn = cx.bind(styles);

export default function ColorSelect({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);

  // custom color flow
  const [tempColor, setTempColor] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const wrapperRef = useRef(null);
  const allColors = useMemo(() => colors, [colors]);

  const selectColor = (color) => {
    if (!color) return;

    onChange?.(color);

    setRecent((prev) => {
      const next = [color, ...prev.filter((c) => c !== color)];
      return next.slice(0, 6);
    });

    setTempColor(null);
    setShowConfirm(false);
    setOpen(false);
  };

  // click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setShowConfirm(false);
        setTempColor(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("wrapper")} ref={wrapperRef}>
      {/* TRIGGER */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{ display: "inline-flex", cursor: "pointer" }}
      >
        {children}
      </div>

      {/* POPUP */}
      {open && (
        <div className={cn("popup")}>
          {/* RECENT */}
          {recent.length > 0 && (
            <div className={cn("section")}>
              <div className={cn("label")}>Recent</div>

              <div className={cn("grid")}>
                {recent.map((c) => (
                  <ColorBox
                    key={c}
                    color={c}
                    active={c === value}
                    onClick={() => selectColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* COLORS */}
          <div className={cn("section")}>
            <div className={cn("label")}>Colors</div>

            <div className={cn("grid")}>
              {allColors.map((c) => (
                <ColorBox
                  key={c}
                  color={c}
                  active={c === value}
                  onClick={() => selectColor(c)}
                />
              ))}

              {/* CUSTOM */}
              <label className={cn("custom")}>
                +
                <input
                  className={cn("colorInput")}
                  type="color"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setTempColor(e.target.value);
                    setShowConfirm(true);
                  }}
                />
              </label>
            </div>
          </div>

          {/* CUSTOM CONFIRM (Google Sheets style) */}
          {showConfirm && tempColor && (
            <div className={cn("section", "customPanel")}>
              <div className={cn("label")}>Custom color</div>

              <div className={cn("customRow")}>
                {/* preview */}
                <div
                  className={cn("preview")}
                  style={{ background: tempColor }}
                />

                <div className={cn("actions")}>
                  <button
                    className={cn("btn", "confirm")}
                    onClick={() => selectColor(tempColor)}
                  >
                    Apply
                  </button>

                  <button
                    className={cn("btn")}
                    onClick={() => {
                      setTempColor(null);
                      setShowConfirm(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
