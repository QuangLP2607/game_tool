import classNames from "classnames/bind";
import styles from "./tool-group.module.scss";

const cx = classNames.bind(styles);

export default function ToolGroup({ children, className }) {
  return <div className={cx("tool__group", className)}>{children}</div>;
}
