import { useEffect, useRef } from "react";
import { useViewportStore } from "../stores/viewportStore";

export default function useSheetZoom(wrapperRef, gridRef) {
  const setZoom = useViewportStore((s) => s.setZoom);
  const zoom = useViewportStore((s) => s.zoom);

  const zoomRef = useRef(zoom);
  const scrollRef = useRef({ left: 0, top: 0 });

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const syncScroll = useViewportStore.subscribe((state) => {
      scrollRef.current = {
        left: state.scrollLeft,
        top: state.scrollTop,
      };
    });

    scrollRef.current = {
      left: useViewportStore.getState().scrollLeft,
      top: useViewportStore.getState().scrollTop,
    };

    return syncScroll;
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (!e.ctrlKey) return;

      e.preventDefault();

      const prevZoom = zoomRef.current;

      const nextZoom = Math.min(Math.max(prevZoom - e.deltaY * 0.001, 0.5), 2);

      const ratio = nextZoom / prevZoom;
      const { left, top } = scrollRef.current;

      const nextScrollLeft = left * ratio;
      const nextScrollTop = top * ratio;

      setZoom(nextZoom);
      useViewportStore.getState().setScroll(nextScrollLeft, nextScrollTop);

      gridRef.current?.scrollTo({
        scrollLeft: nextScrollLeft,
        scrollTop: nextScrollTop,
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => el.removeEventListener("wheel", handleWheel);
  }, [wrapperRef, gridRef, setZoom]);
}
