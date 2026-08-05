"use client";

import { Canvas } from "@react-three/fiber";
import EmberParticles from "./EmberParticles";

/** In front of the logo: crisp, faster embers/ash. Purely atmospheric. */
export default function FrontAtmosphere() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: false, alpha: true }}
    >
      <EmberParticles
        count={70}
        size={0.035}
        opacity={0.85}
        speed={1.3}
        spread={2.6}
        riseHeight={4.5}
        color="#e8a227"
      />
    </Canvas>
  );
}
