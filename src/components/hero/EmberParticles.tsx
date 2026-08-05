"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  count?: number;
  size?: number;
  opacity?: number;
  color?: string;
  speed?: number;
  spread?: number;
  riseHeight?: number;
};

const MAX_COUNT = 400;

// Computed once at module init (not during render) to satisfy the
// react-hooks/purity rule — Math.random() may not run in a component body.
function seedParticles() {
  const positions = new Float32Array(MAX_COUNT * 3);
  const seeds = new Float32Array(MAX_COUNT);
  for (let i = 0; i < MAX_COUNT; i++) {
    const radius = Math.random();
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random();
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    seeds[i] = Math.random() * 10;
  }
  return { positions, seeds };
}

const PARTICLE_SEED = seedParticles();

// Default PointsMaterial draws hard-edged squares with no map — this gives
// each ember a soft round falloff instead, so they read as glowing embers
// rather than visible little square cutouts.
function makeEmberTexture(): THREE.CanvasTexture {
  const size = 64;
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
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.7)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function EmberParticles({
  count = 220,
  size = 0.045,
  opacity = 0.75,
  color = "#e8a227",
  speed = 1,
  spread = 2.4,
  riseHeight = 4.5,
}: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const n = Math.min(count, MAX_COUNT);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(n * 3);
    const seeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = PARTICLE_SEED.positions[i * 3] * spread;
      positions[i * 3 + 1] = PARTICLE_SEED.positions[i * 3 + 1] * riseHeight - riseHeight * 0.6;
      positions[i * 3 + 2] = PARTICLE_SEED.positions[i * 3 + 2] * spread;
      seeds[i] = PARTICLE_SEED.seeds[i];
    }
    return { positions, seeds };
    // spread/riseHeight/n only ever come from stable props at mount time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const colorObj = useMemo(() => new THREE.Color(color), [color]);
  const texture = useMemo(() => makeEmberTexture(), []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const top = riseHeight * 0.4;
    const bottom = -riseHeight * 0.6;

    for (let i = 0; i < n; i++) {
      const idx = i * 3;
      arr[idx + 1] += delta * speed * (0.4 + (seeds[i] % 3) * 0.15);
      arr[idx] += Math.sin(state.clock.elapsedTime * 0.6 + seeds[i]) * delta * 0.12;

      if (arr[idx + 1] > top) {
        arr[idx + 1] = bottom;
        arr[idx] = (Math.random() - 0.5) * spread * 2;
        arr[idx + 2] = (Math.random() - 0.5) * spread;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={size}
        color={colorObj}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
