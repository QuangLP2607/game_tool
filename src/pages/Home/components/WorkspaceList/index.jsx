import { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./workspaceList.module.scss";

const cx = classNames.bind(styles);

export default function WorkspaceList({
  workspaces,
  onClick,
  onRename,
  onDelete,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!openMenuId) return;

      const currentMenu = menuRefs.current[openMenuId];
      if (currentMenu && !currentMenu.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className={cx("workspace-list")}>
      {workspaces.map((ws) => (
        <div
          key={ws._id}
          className={cx("card", { active: openMenuId === ws._id })}
          onClick={() => {
            if (openMenuId) return;
            onClick(ws._id);
          }}
        >
          {/* MORE */}
          <div className={cx("more")} onClick={(e) => toggleMenu(e, ws._id)}>
            ⋯
            {openMenuId === ws._id && (
              <div
                className={cx("menu")}
                ref={(el) => (menuRefs.current[ws._id] = el)}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  onClick={(e) => {
                    onRename(e, ws);
                    setOpenMenuId(null);
                  }}
                >
                  Rename
                </div>

                <div
                  onClick={(e) => {
                    onDelete(e, ws);
                    setOpenMenuId(null);
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>

          <h2>{ws.name}</h2>
          <p>Tags: {ws.tags?.length || 0}</p>
        </div>
      ))}
    </div>
  );
}
