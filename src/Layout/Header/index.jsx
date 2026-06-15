import { Link } from "react-router-dom";
import { useState } from "react";
import { readExcelFile } from "@/utils/excel/readExcel";
import { useDataStore } from "@/components/Sheet/stores/dataStore";

import classNames from "classnames/bind";
import styles from "./header.module.scss";
import logo from "@/assets/logo.png";

const cx = classNames.bind(styles);

export default function Header() {
  //== import file =============================
  const [loading, setLoading] = useState(false);
  const setData = useDataStore((s) => s.setData);
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const result = await readExcelFile(file);
      setData(result);
    } catch {
      alert("Không thể đọc file Excel.");
    } finally {
      setLoading(false);
    }
  };

  {
    loading ? "Loading..." : "Import Excel";
  }

  return (
    <header className={cx("header")}>
      <div className={cx("left")}>
        <Link to="/" className={cx("logo-wrapper")}>
          <img src={logo} alt="Logo" className={cx("logo")} />
        </Link>
        <h3 className={cx("title")}>Shit</h3>
      </div>

      <div className={cx("right")}>
        <label className={cx("upload-btn")}>
          {loading ? "Loading..." : "Import Excel"}
          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={handleImport}
          />
        </label>
      </div>
    </header>
  );
}
