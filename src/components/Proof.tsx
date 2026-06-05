"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrambleText from "./ScrambleText";

const metrics = [
  { value: "2-6", unit: "weeks", label: "Typical delivery" },
  { value: "100", unit: "%", label: "Custom code" },
  { value: "0", unit: "", label: "Templates used" },
];

export default function Proof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="proof" className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-6 md:px-12 lg:px-12">
      <div className="max-w-7xl w-full mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3a3a3a] block mb-10"
          >
            <ScrambleText text="[ EVIDENCE // OPERATIONAL METRICS ]" />
          </motion.span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="group relative bg-[#0a0a0a]/30 border border-[#141414] hover:border-[#14c7c0]/30 hover:bg-[#0c0c0c]/80 p-8 rounded-lg transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[160px]"
              >
                {/* Teal top edge radial glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(20, 199, 192, 0.04) 0%, transparent 60%)"
                  }}
                />

                <div className="relative z-10 flex items-baseline gap-1 mb-3">
                  <span className="text-4xl md:text-5xl font-medium text-[#f0f0f0] group-hover:text-[#14c7c0] transition-colors duration-300 tracking-tight">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-lg font-mono text-[#5a5a5a] group-hover:text-[#14c7c0] transition-colors duration-300">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <p className="relative z-10 text-[13px] text-[#5a5a5a] group-hover:text-[#8a8a8a] transition-colors duration-300 tracking-wide uppercase font-mono">
                  // {metric.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center justify-between border-t border-[#141414] pt-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-sm text-[#5a5a5a] max-w-xl leading-relaxed"
            >
              AI-native workflows. Production-grade architecture. Performance
              optimized for Core Web Vitals. We build systems that handle real
              traffic and real data.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#14c7c0] animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-[#3a3a3a] uppercase">SYSTEM OPERATIONAL STATUS // ACTIVE</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
