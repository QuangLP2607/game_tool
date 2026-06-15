import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./tool-combobox.module.scss";

const cx = classNames.bind(styles);

export default function ToolCombobox({
  value,
  options,
  onChange,
  disabled,
  width = 120,
  textAlign = "left",
  allowCustom = false,
  parseInput,
  disableFilter = false,
  clearOnFocus = false,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const ref = useRef(null);

  // ===== display =====
  const display = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found ? found.label : String(value ?? "");
  }, [value, options]);

  // ===== filter =====
  const filtered = useMemo(() => {
    if (disableFilter) return options;

    if (!input) return options;

    return options.filter((o) =>
      o.label.toLowerCase().includes(input.toLowerCase()),
    );
  }, [input, options, disableFilter]);

  // ===== commit =====
  const commit = useCallback(() => {
    if (allowCustom && input) {
      const parsed = parseInput ? parseInput(input) : input;

      if (parsed !== null && parsed !== undefined) {
        onChange(parsed);
      }
    }

    setOpen(false);
    setInput("");
  }, [allowCustom, input, parseInput, onChange]);

  // ===== click outside =====
  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) {
        commit();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [commit]);

  return (
    <div
      ref={ref}
      className={cx("tool__combobox", { disabled })}
      style={{ width }}
    >
      {/* INPUT */}
      <input
        className={cx("tool__combobox-input")}
        style={{ textAlign }}
        value={open ? input : display}
        disabled={disabled}
        onFocus={(e) => {
          e.target.select();
          setOpen(true);
          if (clearOnFocus) {
            setInput("");
          } else {
            setInput(display);
          }
        }}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();

          if (e.key === "Escape") {
            setOpen(false);
            setInput("");
          }
        }}
      />

      {/* MENU */}
      {open && (
        <div className={cx("tool__combobox-menu")}>
          {filtered.map((opt) => (
            <div
              key={opt.value}
              className={cx("tool__combobox-item", {
                active: opt.value === value,
              })}
              onMouseDown={() => {
                onChange(opt.value);
                setOpen(false);
                setInput("");
              }}
              style={{ fontFamily: opt.value, textAlign }}
            >
              {opt.label}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className={cx("tool__combobox-empty")}>No result</div>
          )}
        </div>
      )}
    </div>
  );
}
