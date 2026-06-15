import { create } from "zustand";

export const useViewportStore = create((set) => ({
  scrollLeft: 0,
  scrollTop: 0,
  zoom: 1,

  setScroll: (scrollLeft, scrollTop) => set({ scrollLeft, scrollTop }),

  setZoom: (zoom) =>
    set({
      zoom: Math.min(Math.max(zoom, 0.5), 2),
    }),
}));
