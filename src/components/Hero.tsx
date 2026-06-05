"use client";

import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import MagneticButton from "./MagneticButton";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scrollSpeed;
uniform vec2 u_mouse;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 uv = vUv;
  float t = u_time * 0.12;

  // Slow, layered noise for atmospheric depth
  float n1 = snoise(vec3(uv * 1.4, t));
  float n2 = snoise(vec3(uv * 2.8 + 50.0, t * 1.2));
  float n3 = snoise(vec3(uv * 0.6 + 200.0, t * 0.5));
  float n = (n1 * 0.6 + n2 * 0.3 + n3 * 0.1);

  // Deep void black base, teal/cyan glow accent — matches #14c7c0 cursor
  vec3 base   = vec3(0.020, 0.020, 0.020);  // #050505 void
  vec3 teal   = vec3(0.078, 0.420, 0.408);  // teal ambient #14c7c0 desaturated dark
  vec3 teal2  = vec3(0.035, 0.200, 0.195);  // deeper teal for second layer

  // Primary radial glow — tracks the cursor for a fluid, reactive light source
  float dist1 = 1.0 - length((uv - u_mouse) * 1.5);
  float dist2 = 1.0 - length((uv - vec2(0.15, 0.35)) * 2.0);
  float glow1 = smoothstep(0.0, 1.0, dist1) * 0.7;
  float glow2 = smoothstep(0.0, 1.0, dist2) * 0.35;

  // Noise-driven color mix — teal breathes with the noise field
  float noiseVal = n * 0.5 + 0.5;
  vec3 col = base;
  col = mix(col, teal2, noiseVal * glow1);
  col = mix(col, teal,  noiseVal * glow1 * 0.5);
  col = mix(col, teal2, noiseVal * glow2);

  // Chromatic separation on scroll
  float chromaticOffset = u_scrollSpeed * 0.02;
  float rNoise = snoise(vec3(uv * 1.4 + vec2(chromaticOffset, 0.0), t)) * 0.5 + 0.5;
  float bNoise = snoise(vec3(uv * 1.4 - vec2(chromaticOffset, 0.0), t)) * 0.5 + 0.5;
  col.r = mix(col.r, col.r * 0.6, rNoise * glow1 * 0.3);
  col.b = mix(col.b, col.b * 1.4, bNoise * glow1 * 0.3);

  // Soft vignette — kills color at outer circle, keeps center alive
  float vignette = 1.0 - length((uv - 0.5) * 1.4);
  float vigFade = smoothstep(0.0, 0.8, vignette);

  // Hard edge fade — alpha goes to 0 at mesh borders
  float edgeX = min(uv.x, 1.0 - uv.x);
  float edgeY = min(uv.y, 1.0 - uv.y);
  float borderFade = smoothstep(0.0, 0.08, edgeX) * smoothstep(0.0, 0.08, edgeY);

  float alpha = vigFade * borderFade;
  gl_FragColor = vec4(col, alpha);
}
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  // Target cursor position in UV space (0..1, y up). Seeded at the original glow spot.
  const targetMouse = useRef<[number, number]>([0.75, 0.65]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      targetMouse.current = [
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      ];
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.scale.set(state.viewport.width, state.viewport.height, 1);
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.u_time.value = state.clock.elapsedTime;
    // Read Lenis-smoothed velocity from CSS custom property set by ScrollProvider
    const rawVel = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--lenis-velocity") || "0"
    );
    // Lerp toward Lenis velocity * small scale factor for the chromatic offset
    material.uniforms.u_scrollSpeed.value +=
      (rawVel * 0.6 - material.uniforms.u_scrollSpeed.value) * 0.08;
    // Ease the glow toward the cursor — low factor gives a weighty, premium follow
    const m = material.uniforms.u_mouse.value as THREE.Vector2;
    m.x += (targetMouse.current[0] - m.x) * 0.04;
    m.y += (targetMouse.current[1] - m.y) * 0.04;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_time: { value: 0 },
          u_resolution: { value: [window.innerWidth, window.innerHeight] },
          u_scrollSpeed: { value: 0 },
          u_mouse: { value: new THREE.Vector2(0.75, 0.65) },
        }}
        transparent
      />
    </mesh>
  );
}

function HeroBackground() {
  return (
    <>
      {/* Mobile: static gradient fallback */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 70% 60%, rgba(20, 199, 192, 0.12) 0%, #050505 65%)",
        }}
      />
      {/* Desktop: Three.js shader */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Canvas
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          dpr={1}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <ShaderPlane />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });


    tl.set([subRef.current, ctaRef.current], {
      opacity: 0,
      y: 20,
    });



    // Tag


    // Headline word reveal
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll(".word");
      tl.fromTo(
        words,
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.05, ease: "expo.out" },
        0.4
      );
    }

    tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.8);
    tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.0);

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // Subtle pointer parallax — the headline block drifts gently against the cursor
  useEffect(() => {
    const el = contentRef.current;
    if (reducedMotion || !el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      xTo(relX * -22);
      yTo(relY * -14);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion]);

  const headlineWords = "We build software for teams who care about the details.".split(" ");

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-end pb-12 md:pb-20 px-6 md:px-12 lg:px-12 overflow-hidden"
    >
      <HeroBackground />



      <div ref={contentRef} className="relative z-10 max-w-7xl w-full mx-auto">


        <h1
          ref={headlineRef}
          className="text-[clamp(2.5rem,10vw,8rem)] font-medium leading-[0.95] tracking-[-0.04em] text-[#f0f0f0] mb-8 max-w-5xl overflow-hidden"
        >
          <span className="flex flex-wrap gap-x-[0.25em] gap-y-0">
            {headlineWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <span className="word inline-block">{word}</span>
              </span>
            ))}
          </span>
        </h1>

        <p
          ref={subRef}
          className={`text-base md:text-lg text-[#5a5a5a] max-w-lg leading-relaxed mb-12 ${reducedMotion ? "" : "opacity-0"}`}
        >
          An independent engineering studio constructing high-fidelity web
          frontends, interactive design systems, and stable database
          architectures. No compromise on performance, typography, or code
          quality.
        </p>

        <div ref={ctaRef} className={`flex items-center gap-6 ${reducedMotion ? "" : "opacity-0"}`}>
          <MagneticButton variant="secondary" href="#contact">
            Start building // →
          </MagneticButton>
        </div>
      </div>

      {/* Vertical grid lines */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute left-[20%] top-0 bottom-0 w-px bg-[#f0f0f0] opacity-[0.02]" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-[#f0f0f0] opacity-[0.02]" />
        <div className="absolute left-[80%] top-0 bottom-0 w-px bg-[#f0f0f0] opacity-[0.02]" />
      </div>
    </section>
  );
}
