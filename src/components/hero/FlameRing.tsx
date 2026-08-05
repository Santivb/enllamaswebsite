"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Classic procedural fire: scrolling fbm noise, tapered to a flame silhouette,
// colored through a black -> red -> orange -> yellow -> white ramp.
const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSeed;
  uniform float uIntensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p *= 2.05;
      amp *= 0.55;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    vec2 p = uv * vec2(2.4, 3.4);
    p.y -= uTime * 2.1;
    p.x += sin(uTime * 0.6 + uv.y * 4.0) * 0.15;

    float n = fbm(p + fbm(p + uTime * 0.15));

    float taper = smoothstep(0.0, 0.42, uv.x) * smoothstep(1.0, 0.58, uv.x);
    float rise = smoothstep(1.0, 0.0, uv.y);
    float base = smoothstep(0.0, 0.22, uv.y);

    float flame = n * taper * rise * base * uIntensity;
    flame = smoothstep(0.1, 0.68, flame);

    vec3 color = mix(vec3(0.08, 0.0, 0.0), vec3(0.95, 0.22, 0.02), flame);
    color = mix(color, vec3(1.0, 0.6, 0.1), pow(flame, 1.6));
    color = mix(color, vec3(1.0, 0.95, 0.65), pow(flame, 4.0));

    gl_FragColor = vec4(color, flame);
  }
`;

type Tongue = {
  x: number;
  scaleX: number;
  scaleY: number;
  seed: number;
  intensity: number;
  speed: number;
};

const TONGUES: Tongue[] = [
  { x: -1.9, scaleX: 2.1, scaleY: 5.5, seed: 4.2, intensity: 1.5, speed: 0.8 },
  { x: -1.1, scaleX: 2.5, scaleY: 6.7, seed: 17.9, intensity: 1.7, speed: 1.0 },
  { x: -0.35, scaleX: 2.7, scaleY: 7.4, seed: 31.4, intensity: 1.85, speed: 0.9 },
  { x: 0.35, scaleX: 2.7, scaleY: 7.6, seed: 12.6, intensity: 1.9, speed: 0.95 },
  { x: 1.1, scaleX: 2.5, scaleY: 6.9, seed: 8.8, intensity: 1.7, speed: 1.05 },
  { x: 1.9, scaleX: 2.1, scaleY: 5.8, seed: 22.1, intensity: 1.5, speed: 0.85 },
];

function FlameTongue({ tongue }: { tongue: Tongue }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeed: { value: tongue.seed },
      uIntensity: { value: tongue.intensity },
    }),
    [tongue.seed, tongue.intensity]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime * tongue.speed;
    }
  });

  return (
    <mesh position={[tongue.x, -1.9, 0.5]} scale={[tongue.scaleX, tongue.scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** Real, animated grill-flame silhouettes rising up behind the logo emblem. */
export default function FlameRing() {
  return (
    <>
      {TONGUES.map((tongue, i) => (
        <FlameTongue key={i} tongue={tongue} />
      ))}
    </>
  );
}
