"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const GRID = 8;
const GAP = 0.42;

export function PixelProofVignette({ position }: { position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const flags = useMemo(
    () => Array.from({ length: GRID * GRID }, () => Math.random() > 0.82),
    []
  );
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    let i = 0;
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const flagged = flags[i];
        const pulse = flagged ? 0.55 + Math.sin(t * 2 + i) * 0.15 : 0.12;
        dummy.position.set((x - GRID / 2) * GAP, pulse, (y - GRID / 2) * GAP);
        dummy.scale.set(0.18, 0.05 + pulse * 0.3, 0.18);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        color.set(flagged ? "#e0785a" : "#2c3b45");
        meshRef.current.setColorAt(i, color);
        i++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group position={position}>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#0d1b18" roughness={1} />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, GRID * GRID]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>
    </group>
  );
}
