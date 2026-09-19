"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

/** Shared vignette for the two in-progress agent projects — swap for a
 * bespoke scene once each project has something real to visualize. */
export function AgentVignette({
  position,
  variant,
  color,
}: {
  position: THREE.Vector3;
  variant: "document" | "market";
  color: string;
}) {
  const group = useRef<THREE.Group>(null);
  const barsRef = useRef<THREE.Group>(null);
  const heights = useMemo(() => Array.from({ length: 10 }, () => 0.3 + Math.random() * 1.4), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) group.current.rotation.y = Math.sin(t * 0.2) * 0.2;

    if (variant === "market" && barsRef.current) {
      barsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const h = heights[i] + Math.sin(t * 1.3 + i) * 0.25;
        mesh.scale.y = Math.max(0.15, h);
        mesh.position.y = mesh.scale.y / 2;
      });
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#0d1b18" roughness={1} />
      </mesh>

      {variant === "document" && (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.4 + i * 0.18, -i * 0.15]} castShadow>
              <boxGeometry args={[2.2, 0.05, 2.8]} />
              <meshStandardMaterial color="#1c2b30" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[1.4, 0.03, 0.06]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
          </mesh>
        </group>
      )}

      {variant === "market" && (
        <group ref={barsRef} position={[-2, 0, 0]}>
          {heights.map((h, i) => (
            <mesh key={i} position={[i * 0.45, h / 2, 0]} castShadow>
              <boxGeometry args={[0.22, h, 0.22]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      )}

      <mesh position={[0, 1.6, -1.6]}>
        <torusKnotGeometry args={[0.3, 0.08, 64, 8]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
