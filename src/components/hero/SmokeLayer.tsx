"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeSoftRadialTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const WISPS = [
  { x: -1.6, y: -0.4, z: -1.5, scale: 3.4, speed: 0.05, color: "#3a0f09" },
  { x: 1.8, y: 0.6, z: -1.8, scale: 3.8, speed: 0.04, color: "#d8481e" },
  { x: -0.6, y: 1.2, z: -1.2, scale: 2.8, speed: 0.06, color: "#7a1f10" },
  { x: 0.8, y: -1.0, z: -1.6, scale: 3.2, speed: 0.045, color: "#e8a227" },
];

/** Soft drifting warm-toned glow sprites standing in for smoke/volumetric light. */
export default function SmokeLayer() {
  const texture = useMemo(() => makeSoftRadialTexture(), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const wisp = WISPS[i];
      child.position.x = wisp.x + Math.sin(t * wisp.speed + i) * 0.4;
      child.position.y = wisp.y + Math.cos(t * wisp.speed * 0.8 + i) * 0.3;
      const s = wisp.scale * (1 + Math.sin(t * wisp.speed * 1.3 + i) * 0.08);
      child.scale.setScalar(s);
    });
  });

  return (
    <group ref={groupRef}>
      {WISPS.map((wisp, i) => (
        <sprite key={i} position={[wisp.x, wisp.y, wisp.z]} scale={wisp.scale}>
          <spriteMaterial
            map={texture}
            color={wisp.color}
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}
