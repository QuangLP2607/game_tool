import { forwardRef } from "react";
import classNames from "classnames/bind";
import styles from "./tool-button.module.scss";

const cx = classNames.bind(styles);

const ToolbarButton = forwardRef(function ToolbarButton(
  { active, onClick, disabled, children, wide },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx("tool__btn", {
        "tool__btn--active": active,
        "tool__btn--wide": wide,
      })}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
});

export default ToolbarButton;
