"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll progress of the document as a 0..1 value, smoothed with a
 * simple lerp so the camera doesn't jitter on trackpad/wheel events.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const target = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      target.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const tick = () => {
      const next = progressRef.current + (target.current - progressRef.current) * 0.12;
      progressRef.current = next;
      setProgress(next);
      raf.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return { progress, progressRef };
}
