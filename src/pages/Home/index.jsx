import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Sheet from "@/components/Sheet";
import { getSheets } from "@/services/sheetService";
import { useDataStore } from "@/components/Sheet/stores/dataStore";
import styles from "./home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  const load = useDataStore((s) => s.load);

  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSheets() {
      try {
        const data = await getSheets();

        if (!mounted) return;

        setSheets(data);

        if (data.length > 0) {
          setActiveSheet(data[0].name);

          await load(data[0].name);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchSheets();

    return () => {
      mounted = false;
    };
  }, [load]);

  const handleSelectSheet = async (sheetName) => {
    setActiveSheet(sheetName);
    await load(sheetName);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("tabs")}>
        {sheets.map((sheet) => (
          <button
            key={sheet.id}
            className={cx("tab", {
              active: activeSheet === sheet.name,
            })}
            onClick={() => handleSelectSheet(sheet.name)}
          >
            <span className={cx("tabName")}>{sheet.name}</span>
          </button>
        ))}
      </div>

      <div className={cx("sheetContainer")}>
        <Sheet />
      </div>
    </div>
  );
}
