import * as THREE from "three";
import { projects } from "@/data/projects";

export type StationId =
  | "about"
  | "arclab"
  | "pixelproof"
  | "service-report-agent"
  | "trading-agent"
  | "contact";

export interface Station {
  id: StationId;
  index: number;
  title: string;
  /** Where the 3D vignette for this station sits in world space. */
  object: THREE.Vector3;
  /** Where the camera sits while viewing this station. */
  camera: THREE.Vector3;
}

const SPACING = 14;

function layout(index: number) {
  const z = -index * SPACING;
  const x = Math.sin(index * 0.8) * 3;
  return { x, z };
}

const raw: { id: StationId; title: string }[] = [
  { id: "about", title: "About" },
  { id: "arclab", title: "ArcLab" },
  { id: "pixelproof", title: "PixelProof" },
  { id: "service-report-agent", title: "Service Report Agent" },
  { id: "trading-agent", title: "bStock Trading Agent" },
  { id: "contact", title: "Contact" },
];

export const STATIONS: Station[] = raw.map((s, index) => {
  const { x, z } = layout(index);
  return {
    id: s.id,
    index,
    title: s.title,
    object: new THREE.Vector3(x, 0, z),
    camera: new THREE.Vector3(x, 1.4, z + 7),
  };
});

export const STATION_COUNT = STATIONS.length;

/** Map a project id to its station, for cross-referencing content + scene. */
export function projectForStation(id: StationId) {
  return projects.find((p) => p.id === id);
}

/**
 * Given scroll progress in [0,1], return the fractional station position,
 * e.g. 2.35 means 35% of the way from station 2 to station 3.
 */
export function progressToStationPosition(progress: number) {
  return Math.min(STATION_COUNT - 1, Math.max(0, progress * (STATION_COUNT - 1)));
}

export function lerpVector(a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) {
  out.set(
    THREE.MathUtils.lerp(a.x, b.x, t),
    THREE.MathUtils.lerp(a.y, b.y, t),
    THREE.MathUtils.lerp(a.z, b.z, t)
  );
  return out;
}
