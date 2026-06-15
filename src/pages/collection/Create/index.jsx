import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import * as XLSX from "xlsx";
import styles from "./collection.module.scss";

export default function Collection() {
  const navigate = useNavigate();
  const { setSheetData } = useOutletContext();
  const [loading, setLoading] = useState(false);

  const MAX_ROWS = 1000000; // 👈 chỉ đọc 1000 dòng đầu

  const normalizeGrid = (rows) => {
    const maxCols = Math.max(...rows.map((r) => r.length));
    return rows.map((r) =>
      Array.from({ length: maxCols }, (_, i) => r[i] ?? ""),
    );
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];

        const originalRange = XLSX.utils.decode_range(sheet["!ref"]);

        // 👇 Giới hạn range chỉ 1000 dòng đầu
        const limitedRange = {
          s: { r: 0, c: 0 },
          e: {
            r: Math.min(originalRange.e.r, MAX_ROWS - 1),
            c: originalRange.e.c,
          },
        };

        const raw = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
          range: limitedRange,
        });

        const data = normalizeGrid(raw);

        if (originalRange.e.r + 1 > MAX_ROWS) {
          alert(
            `File có ${originalRange.e.r + 1} dòng.\nChỉ tải ${MAX_ROWS} dòng đầu để đảm bảo hiệu năng.`,
          );
        }

        setSheetData(data);
        navigate("add");
      } catch (err) {
        console.error(err);
        alert("Không thể đọc file Excel.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className={styles.collection}>
      <div className={styles.header}>
        <h2>Collection name</h2>

        <label className={styles.uploadBtn}>
          {loading ? "Loading..." : "Import Excel"}
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
