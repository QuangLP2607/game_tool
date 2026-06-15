import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./workspaceModal.module.scss";

const cx = classNames.bind(styles);

export default function WorkspaceModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create", // "create" | "edit"
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // set lại data khi mở modal
  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async () => {
    const trimmed = name.trim();

    if (!trimmed || loading) return;

    // tránh submit khi không thay đổi (edit)
    if (mode === "edit" && trimmed === initialData?.name) return;

    setLoading(true);
    try {
      await onSubmit({ name: trimmed });
      onClose();
      setName("");
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "create" ? "Create workspace" : "Rename workspace"}</h2>

        <hr />

        <input
          className={cx("input")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          disabled={loading}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />

        <hr />

        <div className={cx("actions")}>
          <button
            className={cx("actions__button", "cancel")}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className={cx("actions__button", "create")}
            onClick={handleSubmit}
            disabled={
              loading ||
              !name.trim() ||
              (mode === "edit" && name.trim() === initialData?.name)
            }
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create"
                : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
