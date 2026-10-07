"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

interface Cloud {
  positions: Float32Array;
  colors: Float32Array;
  seeds: Float32Array;
  count: number;
}

function buildCloud(count: number, length: number, palette: THREE.Color[]): Cloud {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  // Clusters are pushed out to either side of the camera's travel corridor
  // (camera x oscillates roughly within ±3.5) so points never spawn right on
  // the flight path — otherwise a close pass turns a single sprite into a
  // huge blown-out glow once bloom picks it up.
  const clusterCount = Math.max(6, Math.round(length / 9));
  const clusters = Array.from({ length: clusterCount }, () => {
    const side = Math.random() < 0.5 ? -1 : 1;
    return {
      x: side * (4.5 + Math.random() * 4),
      y: Math.random() * 4.5 - 0.5,
      z: -Math.random() * length,
      spread: 1.2 + Math.random() * 1.8,
    };
  });

  const MIN_CORRIDOR_X = 3.2;

  for (let i = 0; i < count; i++) {
    const c = clusters[i % clusters.length];
    let x = c.x + (Math.random() - 0.5) * c.spread * 1.6;
    // Hard safety clamp: never let a jittered point land inside the
    // camera's travel corridor, whatever its cluster's spread rolled.
    if (Math.abs(x) < MIN_CORRIDOR_X) {
      x = x < 0 ? -MIN_CORRIDOR_X : MIN_CORRIDOR_X;
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = c.y + (Math.random() - 0.5) * c.spread;
    positions[i * 3 + 2] = c.z + (Math.random() - 0.5) * c.spread * 2.4;

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    seeds[i] = Math.random() * Math.PI * 2;
  }

  return { positions, colors, seeds, count };
}

function DustLayer({ cloud, size, opacity, texture }: { cloud: Cloud; size: number; opacity: number; texture: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < cloud.count; i++) {
      posAttr.setY(i, posAttr.getY(i) + Math.sin(t * 0.15 + cloud.seeds[i]) * 0.0006);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[cloud.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[cloud.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** A soft, glowing dust field spanning the whole scene length — clustered
 * rather than a uniform grid, mostly small cool specks with rare larger
 * warm accents, rendered as blurred circular sprites (not hard dots) with
 * additive blending so bloom picks them up as soft glows. */
export function DustField({ length }: { length: number }) {
  const texture = useGlowTexture();
  const cool = useMemo(
    () => buildCloud(220, length, [new THREE.Color("#4dd0c4"), new THREE.Color("#8fe3c7"), new THREE.Color("#6fb8d9")]),
    [length]
  );
  const warm = useMemo(() => buildCloud(18, length, [new THREE.Color("#e8c14a"), new THREE.Color("#e0a05a")]), [length]);

  return (
    <>
      <DustLayer cloud={cool} size={0.22} opacity={0.5} texture={texture} />
      <DustLayer cloud={warm} size={0.4} opacity={0.55} texture={texture} />
    </>
  );
}
