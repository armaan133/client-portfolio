"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ScrambleText from "./ScrambleText";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    value: "95",
    suffix: "%+",
    label: "Lighthouse Score",
    note: "Every frontend we deliver is audited for maximum loading speeds and search engine readability before release.",
  },
  {
    value: "38",
    prefix: "-",
    suffix: "%",
    label: "Latency Reduction",
    note: "Replaced legacy software stacks with high-density, real-time dashboards that keep dispatch pipelines responsive under heavy user loads.",
  },
  {
    value: "0.00",
    suffix: "",
    label: "Layout Shift",
    note: "We write vanilla code, target hardware-level rendering limits, and avoid heavy frameworks to keep codebases simple and clean.",
  },
];

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isActive,
}: {
  value: string;
  prefix?: string;
  suffix?: string;
  isActive: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isActive || !ref.current || reducedMotion) return;

    const numericValue = parseFloat(value);
    const isFloat = value.includes(".");
    const obj = { val: 0 };

    gsap.to(obj, {
      val: numericValue,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          const formatted = isFloat
            ? obj.val.toFixed(2)
            : Math.round(obj.val).toString();
          ref.current.textContent = prefix + formatted + suffix;
        }
      },
    });
  }, [isActive, value, prefix, suffix, reducedMotion]);

  return (
    <span ref={ref}>
      {reducedMotion ? prefix + value + suffix : prefix + (value === "0.00" ? "0.00" : "0") + suffix}
    </span>
  );
}

function MetricCard({
  metric,
  index,
  isActive,
}: {
  metric: (typeof metrics)[0];
  index: number;
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border-t border-[#1a1a1a] pt-8 cursor-default overflow-hidden rounded-xl px-6 py-8 -mx-6 transition-all duration-500"
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Mouse-tracking radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-xl transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 199, 192, 0.07), transparent 70%)`,
        }}
      />

      {/* Top border glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14c7c0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Subtle corner glow */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
        style={{ background: "rgba(20, 199, 192, 0.06)" }}
      />

      <div className="relative z-10 mb-6">
        <span className="text-[clamp(3rem,6vw,6rem)] font-mono font-light text-[#f0f0f0] group-hover:text-[#14c7c0] tracking-tight leading-none transition-colors duration-700">
          <AnimatedCounter
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            isActive={isActive}
          />
        </span>
      </div>

      {/* Label with animated underline */}
      <div className="relative z-10 mb-4">
        <h3 className="text-sm font-medium text-[#f0f0f0] group-hover:text-[#14c7c0] tracking-wide transition-colors duration-500 inline-block">
          {metric.label}
        </h3>
        <div className="h-[1px] w-0 group-hover:w-full bg-[#14c7c0]/30 transition-all duration-700 ease-out mt-1" />
      </div>

      <p className="relative z-10 font-serif italic text-lg md:text-xl text-[#5a5a5a] group-hover:text-[#8a8a8a] leading-relaxed transition-colors duration-500">
        {metric.note}
      </p>
    </div>
  );
}

export default function PeerValidation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const effectivelyActive = isActive || reducedMotion;

  useEffect(() => {
    if (reducedMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      onEnter: () => setIsActive(true),
      once: true,
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      id="metrics"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-6 md:px-12 lg:px-12 overflow-hidden"
    >

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3a3a3a] block mb-16">
          <ScrambleText text="[ DATA 01 // CORE METRICS ]" />
        </span>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {metrics.map((metric, i) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={i}
              isActive={effectivelyActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

