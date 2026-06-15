import styles from "./tagbar.module.scss";
import { Dropdown } from "@/components/Dropdown";

export default function TagBar({
  sections,
  setSections,
  activeIdx,
  setActiveIdx,
  addSection,
  builderMode,
  setBuilderMode,
  setSelecting,
  selectedLabelCell,
  selectedValueCell,
  selectedRange,
  confirmSingle,
  confirmTable,
  deleteTag,
  exportJSON,
}) {
  const update = (idx, key, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    );
  };

  const cancel = () => {
    setBuilderMode(null);
    setSelecting(null);
  };

  return (
    <aside className={styles.tagbar}>
      {/* HEADER */}
      <div className={styles.tagbar__header}>
        <h3>Template Builder</h3>
        <button onClick={addSection}>+ Section</button>
      </div>

      {/* SECTIONS */}
      <div className={styles.tagbar__sections}>
        {sections.map((s, i) => {
          const isActive = i === activeIdx;

          return (
            <div
              key={i}
              className={`${styles.tagbar__section} ${
                isActive ? styles["tagbar__section--active"] : ""
              }`}
              onClick={() => setActiveIdx(i)}
            >
              {/* SECTION HEADER */}
              <div className={styles.tagbar__sectionHeader}>
                <input
                  value={s.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />

                <Dropdown
                  value={s.type}
                  options={[
                    { label: "Field", value: "single" },
                    { label: "Table", value: "table" },
                  ]}
                  onChange={(val) => update(i, "type", val)}
                />
              </div>

              {/* TAG LIST */}
              {s.tags?.length > 0 && (
                <div className={styles.tagbar__tags}>
                  {s.tags.map((t, idx) => (
                    <div
                      key={idx}
                      className={styles.tagbar__tag}
                      style={{
                        background: t.colorSoft,
                        border: `1px solid ${t.colorStrong}`,
                      }}
                    >
                      <div>
                        {t.code}
                        {t.type === "single" && (
                          <>
                            {" | "}
                            {t.labelValue || "---"} : {t.valueValue || "---"}
                          </>
                        )}
                      </div>

                      <button
                        className={styles["tagbar__tag-remove"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTag(i, idx);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <hr />

              {/* SINGLE BUILDER */}
              {s.type === "single" && isActive && (
                <div
                  className={styles.tagbar__builder}
                  onClick={(e) => e.stopPropagation()}
                >
                  {builderMode !== "single" && (
                    <button
                      onClick={() => {
                        setBuilderMode("single");
                        setSelecting("label");
                      }}
                    >
                      + Add Tag
                    </button>
                  )}

                  {builderMode === "single" && (
                    <>
                      <div className={styles.tagbar__field}>
                        Label: {selectedLabelCell?.value || "..."}
                      </div>

                      <div className={styles.tagbar__field}>
                        Value: {selectedValueCell?.value || "..."}
                      </div>

                      <button onClick={confirmSingle}>Confirm</button>
                      <button onClick={cancel}>Cancel</button>
                    </>
                  )}
                </div>
              )}

              {/* TABLE BUILDER */}
              {s.type === "table" && isActive && (
                <div
                  className={styles.tagbar__builder}
                  onClick={(e) => e.stopPropagation()}
                >
                  {builderMode !== "table" && (
                    <button onClick={() => setBuilderMode("table")}>
                      Select Range
                    </button>
                  )}

                  {builderMode === "table" && (
                    <>
                      <div className={styles.tagbar__field}>
                        {selectedRange
                          ? `${selectedRange.start.address} → ${selectedRange.end.address}`
                          : "Drag range on sheet"}
                      </div>

                      <button onClick={confirmTable}>Confirm</button>
                      <button onClick={cancel}>Cancel</button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* EXPORT */}
      <button className={styles.tagbar__export} onClick={exportJSON}>
        Export JSON
      </button>
    </aside>
  );
}
