"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./three/Scene";
import { Overlay } from "./Overlay";
import { StaticFallback } from "./StaticFallback";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { STATION_COUNT, progressToStationPosition } from "@/lib/stations";

const STORAGE_KEY = "prefers-static-site";

export function Experience() {
  const { progress, progressRef } = useScrollProgress();
  const [staticMode, setStaticMode] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setStaticMode(stored === "1");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStaticMode(reduced);
  }, []);

  const setMode = (value: boolean) => {
    setStaticMode(value);
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    window.scrollTo(0, 0);
  };

  // Avoid a flash of the wrong mode before the preference is read.
  if (staticMode === null) return null;

  if (staticMode) {
    return <StaticFallback onExit={() => setMode(false)} />;
  }

  const stationPosition = progressToStationPosition(progress);

  return (
    <>
      <div style={{ height: `${STATION_COUNT * 100}vh` }} />
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 38%, #123330 0%, #0a201d 32%, #051312 62%, #030a09 100%)",
        }}
      >
        <Canvas shadows camera={{ fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <Scene progressRef={progressRef} />
        </Canvas>
      </div>

      <Overlay position={stationPosition} />

      <div className="fixed left-4 top-4 z-20 text-xs tracking-[0.3em] text-teal-200/70 sm:left-8 sm:top-8">
        THE LAB
      </div>

      <button
        onClick={() => setMode(true)}
        className="fixed right-4 top-4 z-20 rounded-full border border-teal-800/60 bg-black/40 px-4 py-1.5 text-xs text-teal-200 backdrop-blur hover:border-teal-500 sm:right-8 sm:top-8"
      >
        Skip animation
      </button>

      <div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 text-[11px] tracking-widest text-slate-500 sm:bottom-8">
        {Math.round((stationPosition / (STATION_COUNT - 1)) * 100)}%
      </div>
    </>
  );
}
