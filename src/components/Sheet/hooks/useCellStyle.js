import { useCellStyleStore } from "../stores/cellStyleStore";

/**
 * chỉ subscribe 1 cell → không re-render toàn grid
 */
export default function useCellStyle(row, col) {
  return useCellStyleStore((s) => s.styles[row + ":" + col]);
}
