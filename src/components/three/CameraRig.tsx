"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STATIONS, lerpVector, progressToStationPosition } from "@/lib/stations";

const tmpCam = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

export function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const lookTarget = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    const pos = progressToStationPosition(progressRef.current);
    const i0 = Math.floor(pos);
    const i1 = Math.min(STATIONS.length - 1, i0 + 1);
    const t = pos - i0;

    lerpVector(STATIONS[i0].camera, STATIONS[i1].camera, t, tmpCam);
    lerpVector(STATIONS[i0].object, STATIONS[i1].object, t, tmpLook);

    camera.position.lerp(tmpCam, 0.15);
    lookTarget.current.lerp(tmpLook, 0.15);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
