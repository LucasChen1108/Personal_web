"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Desk({ position }: { position: THREE.Vector3 }) {
  const glow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glow.current) {
      const mat = glow.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[3, 0.15, 1.4]} />
        <meshStandardMaterial color="#1b2a26" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, -0.3]} castShadow>
        <boxGeometry args={[1.4, 0.9, 0.06]} />
        <meshStandardMaterial color="#0e1a17" />
      </mesh>
      <mesh ref={glow} position={[0, 0.05, -0.27]}>
        <planeGeometry args={[1.2, 0.7]} />
        <meshStandardMaterial color="#4dd0c4" emissive="#4dd0c4" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}
