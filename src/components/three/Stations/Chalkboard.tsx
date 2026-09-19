"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

export function Chalkboard({ position }: { position: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = position.y + Math.sin(clock.elapsedTime * 0.6) * 0.08;
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[5, 3, 0.15]} />
        <meshStandardMaterial color="#12221f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[4.6, 2.6]} />
        <meshStandardMaterial color="#16302a" roughness={1} />
      </mesh>
      <mesh position={[0, -1.7, 0.1]}>
        <boxGeometry args={[5.2, 0.15, 0.3]} />
        <meshStandardMaterial color="#0b1a17" />
      </mesh>
      <Sparkles count={40} scale={[6, 4, 2]} size={2} speed={0.2} color="#8fe3c7" opacity={0.4} />
    </group>
  );
}
