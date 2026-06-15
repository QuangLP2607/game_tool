import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function CollectionLayout() {
  const [sheetData, setSheetData] = useState(null);

  return <Outlet context={{ sheetData, setSheetData }} />;
}
