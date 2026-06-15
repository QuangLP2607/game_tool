export const colLabel = (index) => {
  let label = "";
  let n = index + 1;

  while (n > 0) {
    const r = (n - 1) % 26;
    label = String.fromCharCode(65 + r) + label;
    n = Math.floor((n - 1) / 26);
  }

  return label;
};

export const rangeToAddress = (range) => {
  if (!range) return "";

  const start = `${colLabel(range.minCol)}${range.minRow + 1}`;
  const end = `${colLabel(range.maxCol)}${range.maxRow + 1}`;

  return start === end ? start : `${start}:${end}`;
};

export const darkenColor = (hex, percent = 15) => {
  const num = parseInt(hex.replace("#", ""), 16);

  let r = (num >> 16) - (255 * percent) / 100;
  let g = ((num >> 8) & 0xff) - (255 * percent) / 100;
  let b = (num & 0xff) - (255 * percent) / 100;

  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));

  return `rgb(${r}, ${g}, ${b})`;
};
