import styles from "./collection.module.scss";

export default function Collection() {
  const handleImport = () => {};

  return (
    <div className={styles.collection}>
      <div className={styles.header}>
        <h2>Collection name</h2>

        <label className={styles.uploadBtn}>
          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={handleImport}
          />
        </label>
      </div>
    </div>
  );
}
