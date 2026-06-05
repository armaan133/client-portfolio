"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrambleText from "./ScrambleText";

const services = [
  {
    num: "01",
    title: "High-fidelity frontend engineering",
    description:
      "Custom websites and apps with obsessive attention to typography, motion, and performance. Built on Next.js, TypeScript, and modern rendering primitives.",
  },
  {
    num: "02",
    title: "Interactive design systems",
    description:
      "Component libraries that scale. We establish tokens, patterns, and motion grammar before production code, so every screen feels consistent.",
  },
  {
    num: "03",
    title: "AI-native feature architecture",
    description:
      "Agent architectures, automation pipelines, and AI-native features that interface cleanly with your existing data layer. No demos. Production systems.",
  },
  {
    num: "04",
    title: "Data visualization & dashboards",
    description:
      "Complex data, made simple. Operational tools that speed up decision-making. WebGL charts, real-time feeds, and high-density interfaces.",
  },
  {
    num: "05",
    title: "Database & API design",
    description:
      "Clean schemas, type-safe APIs, and query optimization. We build data layers that survive real traffic and real concurrency.",
  },
  {
    num: "06",
    title: "Performance calibration",
    description:
      "Audit, profile, and tune. We optimize for Core Web Vitals, GPU limits, and perceptual speed. Every millisecond counts.",
  },
];

function ServiceItem({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative bg-[#0a0a0a]/30 border border-[#141414] hover:border-[#14c7c0]/30 hover:bg-[#0c0c0c]/80 p-8 flex flex-col justify-between min-h-[260px] transition-all duration-500 overflow-hidden"
    >
      {/* Teal top edge radial glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(20, 199, 192, 0.04) 0%, transparent 60%)"
        }}
      />

      <div>
        {/* Floating index */}
        <span className="font-mono text-[10px] tracking-widest text-[#2a2a2a] group-hover:text-[#14c7c0]/50 transition-colors duration-300 block mb-6">
          // {service.num}
        </span>

        {/* Title */}
        <h3 className="text-lg font-medium text-[#f0f0f0] group-hover:text-[#14c7c0] transition-colors duration-300 mb-4">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#5a5a5a] group-hover:text-[#8a8a8a] transition-colors duration-300 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Dynamic bottom indicator line */}
      <div className="w-6 h-[1px] bg-[#1a1a1a] group-hover:w-12 group-hover:bg-[#14c7c0] transition-all duration-500 mt-8" />
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-6 md:px-12 lg:px-12">
      <div className="max-w-7xl w-full mx-auto">
        <div ref={headerRef} className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3a3a3a] block mb-6"
          >
            <ScrambleText text="[ CAPABILITIES // WHAT WE BUILD ]" />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#f0f0f0] max-w-2xl"
          >
            Engineering disciplines we practice.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceItem key={service.num} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
