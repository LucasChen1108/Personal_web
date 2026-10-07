"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

function parabola(steps: number, height: number, spread: number, drag = 0) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = THREE.MathUtils.lerp(-spread, spread, t);
    const dragFalloff = 1 - drag * t * t;
    const y = height * (1 - Math.pow(2 * t - 1, 2)) * dragFalloff;
    points.push(new THREE.Vector3(x, y, 0));
  }
  return points;
}

export function ArcLabVignette({ position }: { position: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null);
  const ghost = useMemo(() => parabola(40, 2.4, 2.6, 0), []);
  const actual = useMemo(() => parabola(40, 2.1, 2.6, 0.35), []);
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.15;
    }
    if (markerRef.current) {
      const t = (Math.sin(clock.elapsedTime * 0.8) + 1) / 2;
      const idx = Math.floor(t * (actual.length - 1));
      markerRef.current.position.copy(actual[idx]);
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#0d1b18" roughness={1} />
      </mesh>
      <Line points={ghost} color="#7d8a9a" lineWidth={1.5} dashed dashSize={0.15} gapSize={0.1} transparent opacity={0.6} />
      <Line points={actual} color="#4dd0c4" lineWidth={2.5} />
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#4dd0c4" emissive="#4dd0c4" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}
