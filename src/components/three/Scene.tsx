"use client";

import type { MutableRefObject } from "react";
import { CameraRig } from "./CameraRig";
import { Chalkboard } from "./Stations/Chalkboard";
import { ArcLabVignette } from "./Stations/ArcLabVignette";
import { PixelProofVignette } from "./Stations/PixelProofVignette";
import { AgentVignette } from "./Stations/AgentVignette";
import { Desk } from "./Stations/Desk";
import { STATIONS } from "@/lib/stations";

const byId = Object.fromEntries(STATIONS.map((s) => [s.id, s]));

export function Scene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#060c0b"]} />
      <fog attach="fog" args={["#060c0b", 10, 34]} />

      <hemisphereLight intensity={0.35} color="#bfe9db" groundColor="#04100d" />
      <directionalLight position={[6, 10, 6]} intensity={1.1} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#4dd0c4" />

      {/* Floor strip running the length of the scene */}
      <mesh position={[0, -0.55, -STATIONS[STATIONS.length - 1].object.z / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, STATIONS[STATIONS.length - 1].object.z * -1 + 30]} />
        <meshStandardMaterial color="#081512" roughness={1} />
      </mesh>

      <Chalkboard position={byId.about.object} />
      <ArcLabVignette position={byId.arclab.object} />
      <PixelProofVignette position={byId.pixelproof.object} />
      <AgentVignette position={byId["service-report-agent"].object} variant="document" color="#e0785a" />
      <AgentVignette position={byId["trading-agent"].object} variant="market" color="#e8c14a" />
      <Desk position={byId.contact.object} />

      <CameraRig progressRef={progressRef} />
    </>
  );
}
