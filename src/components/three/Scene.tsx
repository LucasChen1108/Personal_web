"use client";

import type { MutableRefObject } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { CameraRig } from "./CameraRig";
import { ArcLabVignette } from "./Stations/ArcLabVignette";
import { PixelProofVignette } from "./Stations/PixelProofVignette";
import { AgentVignette } from "./Stations/AgentVignette";
import { Desk } from "./Stations/Desk";
import { DustField } from "./DustField";
import { STATIONS } from "@/lib/stations";

const byId = Object.fromEntries(STATIONS.map((s) => [s.id, s]));
const sceneLength = STATIONS[STATIONS.length - 1].object.z * -1 + 14;

export function Scene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <>
      {/* No flat background color — the CSS radial gradient behind the
          canvas shows through; fog still fades geometry into it with depth. */}
      <fog attach="fog" args={["#0a1a17", 9, 32]} />

      <hemisphereLight intensity={0.4} color="#bfe9db" groundColor="#04100d" />
      <directionalLight position={[6, 10, 6]} intensity={1.1} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.45} color="#4dd0c4" />
      <pointLight position={[-4, 2, -6]} intensity={0.3} color="#e0a05a" />

      <DustField length={sceneLength} />

      {/* Floor strip running the length of the scene */}
      <mesh position={[0, -0.55, -STATIONS[STATIONS.length - 1].object.z / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, STATIONS[STATIONS.length - 1].object.z * -1 + 30]} />
        <meshStandardMaterial color="#081512" roughness={1} />
      </mesh>

      {/* About station stays free of 3D props — the role screen is an HTML
          overlay instead (see Overlay.tsx), since any object placed close
          enough to the starting camera to read clearly either got clipped
          into a giant shard during the scroll-out transition or drifted
          across the text column as the camera panned. */}
      <ArcLabVignette position={byId.arclab.object} />
      <PixelProofVignette position={byId.pixelproof.object} />
      <AgentVignette position={byId["service-report-agent"].object} variant="document" color="#e0785a" />
      <AgentVignette position={byId["trading-agent"].object} variant="market" color="#e8c14a" />
      <Desk position={byId.contact.object} />

      <CameraRig progressRef={progressRef} />

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.3} intensity={0.45} mipmapBlur radius={0.6} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}
