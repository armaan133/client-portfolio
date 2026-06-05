"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ScrambleText from "./ScrambleText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    num: "I",
    title: "Architectural Diagnostics & Scope",
    description:
      "We start by auditing your existing codebases, performance bottlenecks, and systems architecture. We deliver a clear, highly technical blueprint outlining exactly how the software will be structured, avoiding surprises down the line.",
  },
  {
    num: "II",
    title: "High-Fidelity Schematics & Token Design",
    description:
      "We translate conceptual directions into high-fidelity layout schematics and interactive design tokens. We build a comprehensive visual design system before writing production code.",
  },
  {
    num: "III",
    title: "Core Engineering & Database Assembly",
    description:
      "We write type-safe APIs, structure clean database schemas, and assemble frontend components with absolute precision. We avoid heavy external dependencies, opting to write clean, vanilla code.",
  },
  {
    num: "IV",
    title: "Performance Calibration & Launch",
    description:
      "Before shipping, we put the software through extensive stress testing. We profile database queries, optimize Webpack configurations, and tune visual interactions to guarantee a stable sixty frames per second.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "bottom 70%",
        scrub: 1,
      },
    });

    tl.to(path, {
      strokeDashoffset: 0,
      ease: "none",
    });

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          delay: i * 0.1,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reducedMotion]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-6 md:px-12 lg:px-12"
    >
      <div className="max-w-7xl w-full mx-auto">
        <div className="mb-10">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3a3a3a] block mb-6">
            <ScrambleText text="[ PROCESS 03 // ARCHITECTURAL ROUTE ]" />
          </span>
          <h2 className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#f0f0f0] max-w-2xl">
            How we build.
          </h2>
        </div>

        <div className="relative space-y-4 md:space-y-5">
          {/* SVG connecting line aligned with dots */}
          <div className="absolute left-[11px] md:left-[11px] top-6 bottom-0 w-px hidden lg:block">
            <svg
              width="2"
              height="100%"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                ref={pathRef}
                d="M1 0 L1 100"
                stroke="#1a1a1a"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="flex gap-6 md:gap-10 items-start group relative"
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Left: Timeline dot channel */}
              <div className="flex flex-col items-center justify-start w-6 relative">
                <div className="w-3 h-3 rounded-full bg-[#2a2a2a] group-hover:bg-[#14c7c0] group-hover:scale-125 group-hover:shadow-[0_0_8px_#14c7c0] transition-all duration-500 mt-6 z-10 relative" />
              </div>

              {/* Right: Glassmorphic Card */}
              <div className="flex-1 bg-[#0a0a0a]/30 border border-[#1a1a1a] group-hover:border-[#14c7c0]/50 group-hover:bg-[#0c1212]/90 group-hover:shadow-[0_0_32px_rgba(20,199,192,0.08)] p-5 rounded-lg transition-all duration-400 relative overflow-hidden flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-start">
                {/* Teal shimmer bar at top edge — slides in on hover */}
                <span className="absolute top-0 left-0 h-[1.5px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-[#14c7c0]/80 to-transparent transition-all duration-500 ease-out" />

                {/* Roman Numeral Watermark in background */}
                <span className="absolute right-6 bottom-[-10px] font-mono font-bold text-[80px] leading-none text-[#121212]/30 group-hover:text-[#14c7c0]/6 transition-colors duration-500 pointer-events-none select-none">
                  {stage.num}
                </span>

                {/* Title Details */}
                <div className="max-w-xs relative z-10">
                  <span className="font-mono text-[10px] tracking-widest text-[#2a2a2a] group-hover:text-[#14c7c0]/60 transition-colors duration-300 block mb-2">
                    STAGE // 0{i + 1}
                  </span>
                  <h3 className="text-lg font-medium text-[#f0f0f0] group-hover:text-[#14c7c0] transition-colors duration-300">
                    {stage.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex-1 max-w-xl relative z-10 md:pt-4">
                  <p className="text-sm md:text-base text-[#5a5a5a] group-hover:text-[#a0a0a0] transition-colors duration-300 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
