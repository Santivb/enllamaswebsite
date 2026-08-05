"use client";

import { Canvas } from "@react-three/fiber";
import SmokeLayer from "./SmokeLayer";
import EmberParticles from "./EmberParticles";
import FlameRing from "./FlameRing";

/** Behind the logo: real animated flame tongues, soft smoke, slow embers. */
export default function BackAtmosphere() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: false, alpha: true }}
    >
      <FlameRing />
      <SmokeLayer />
      <EmberParticles
        count={90}
        size={0.05}
        opacity={0.35}
        speed={0.5}
        spread={3.2}
        riseHeight={5}
        color="#7a1f10"
      />
    </Canvas>
  );
}
