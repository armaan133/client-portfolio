"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useMotionTemplate } from "framer-motion";
import ScrambleText from "./ScrambleText";

const capabilities = [
  {
    domain: "Frontend",
    tools: "Next.js, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, Three.js / R3F",
  },
  {
    domain: "Backend & Data",
    tools: "Node.js, PostgreSQL, Supabase, Python, tRPC, GraphQL, Redis",
  },
  {
    domain: "AI & Automation",
    tools: "LangChain, OpenAI API, Claude, Kimi, n8n, Custom Agent Orchestration",
  },
  {
    domain: "Infrastructure",
    tools: "Vercel, AWS, Docker, CI/CD, Edge Functions, CDN Optimization",
  },
];

function CapabilityRow({
  cap,
  index,
}: {
  cap: (typeof capabilities)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const toolsArray = cap.tools.split(", ");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-10 items-start border-b border-[#141414] pl-6 -ml-6 pr-6 -mr-6 rounded-xl hover:bg-[#ffffff]/[0.015] hover:border-b-transparent transition-all duration-500 cursor-pointer overflow-hidden"
    >
      {/* Background Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(20, 199, 192, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      {/* Interactive left accent line indicator with glow */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-transparent group-hover:bg-[#14c7c0] scale-y-0 group-hover:scale-y-100 transition-all duration-500 origin-center rounded-r shadow-[0_0_12px_#14c7c0]" />

      {/* Index & Domain Column */}
      <div className="md:col-span-4 flex gap-4 items-baseline group-hover:translate-x-2 transition-transform duration-500 ease-out z-10">
        <span className="font-mono text-[10px] tracking-wider text-[#2a2a2a] group-hover:text-[#14c7c0]/50 transition-colors duration-300">
          0{index + 1} //
        </span>
        <h3 className="font-mono text-sm tracking-[0.15em] uppercase text-[#4a4a4a] group-hover:text-[#14c7c0] transition-colors duration-500 font-semibold">
          {cap.domain}
        </h3>
      </div>

      {/* Tools Tag Collection Column */}
      <div className="md:col-span-8 group-hover:translate-x-1 transition-transform duration-500 ease-out z-10">
        <div className="flex flex-wrap gap-2">
          {toolsArray.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1.5 text-[11px] font-mono bg-[#0a0a0a]/30 border border-[#141414] rounded-md text-[#5a5a5a] group-hover:text-[#8a8a8a] hover:!text-[#14c7c0] hover:!border-[#14c7c0]/40 hover:!bg-[#14c7c0]/5 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default shadow-sm hover:shadow-[0_0_10px_rgba(20,199,192,0.1)] inline-block transform"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TechMap() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="tech" className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-6 md:px-12 lg:px-12">
      <div className="max-w-7xl w-full mx-auto">
        <div ref={headerRef} className="mb-14 md:mb-18">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3a3a3a] block mb-6"
          >
            <ScrambleText text="[ STACK // TECHNOLOGY ]" />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#f0f0f0] max-w-2xl"
          >
            Tools we deploy in production.
          </motion.h2>
        </div>

        <div className="border-t border-[#1a1a1a]">
          {capabilities.map((cap, index) => (
            <CapabilityRow key={cap.domain} cap={cap} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
