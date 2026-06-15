import * as XLSX from "xlsx";

const MAX_ROWS = 10000;
const MAX_COLS = 200;
const MAX_CELLS = 200000;
const MAX_PARSE_TIME = 10000; // ms

export const readExcelFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const start = performance.now();

        const wb = XLSX.read(evt.target.result, { type: "binary" });

        const sheet = wb.Sheets[wb.SheetNames[0]];

        if (!sheet["!ref"]) {
          resolve({ cells: {}, rows: 0, cols: 0 });
          return;
        }

        const range = XLSX.utils.decode_range(sheet["!ref"]);

        const rows = Math.min(range.e.r + 1, MAX_ROWS);
        const cols = Math.min(range.e.c + 1, MAX_COLS);

        const cells = {};

        let count = 0;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (count > MAX_CELLS) {
              resolve({
                cells,
                rows,
                cols,
                limited: true,
              });
              return;
            }

            if (performance.now() - start > MAX_PARSE_TIME) {
              resolve({
                cells,
                rows,
                cols,
                timeout: true,
              });
              return;
            }

            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = sheet[addr];

            if (cell && cell.v !== undefined && cell.v !== "") {
              cells[`${r}:${c}`] = cell.v;
            }

            count++;
          }
        }

        resolve({
          cells,
          rows,
          cols,
          limited: rows < range.e.r + 1 || cols < range.e.c + 1,
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;

    reader.readAsBinaryString(file);
  });
