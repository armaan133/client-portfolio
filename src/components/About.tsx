"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrambleText from "./ScrambleText";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-6 md:px-12 lg:px-12">
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
            <ScrambleText text="[ STUDIO // ABOUT ]" />
          </motion.span>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left: Heading with hover highlight */}
            <div className="group/heading cursor-default">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[#f0f0f0]"
              >
                Small team.
                <br />
                <span className="text-[#3a3a3a] group-hover/heading:text-[#14c7c0] transition-colors duration-700">
                  Serious output.
                </span>
              </motion.h2>
            </div>

            {/* Right: Description & Interactive Stat Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col gap-8"
            >
              <p className="text-base md:text-lg text-[#5a5a5a] leading-relaxed">
                We are a compact team of builders, designers, and AI operators
                creating sharp digital systems for startups, agencies, and
                ambitious founders. No bloated overhead. No junior work. Just
                senior craft, delivered fast.
              </p>

              <div className="flex gap-4 md:gap-6">
                {/* Stat Card 1 */}
                <div className="group relative flex-1 bg-[#0a0a0a]/30 border border-[#141414] hover:border-[#14c7c0]/30 hover:bg-[#0c0c0c]/80 p-6 rounded-lg transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[120px]">
                  {/* Teal top edge radial glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 0%, rgba(20, 199, 192, 0.04) 0%, transparent 60%)"
                    }}
                  />
                  <span className="text-3xl md:text-4xl font-medium text-[#f0f0f0] group-hover:text-[#14c7c0] transition-colors duration-300 relative z-10">
                    5+
                  </span>
                  <p className="font-mono text-[10px] tracking-wider text-[#3a3a3a] group-hover:text-[#8a8a8a] transition-colors duration-300 uppercase mt-4 relative z-10">
                    // Years of craft
                  </p>
                </div>

                {/* Stat Card 2 */}
                <div className="group relative flex-1 bg-[#0a0a0a]/30 border border-[#141414] hover:border-[#14c7c0]/30 hover:bg-[#0c0c0c]/80 p-6 rounded-lg transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[120px]">
                  {/* Teal top edge radial glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 0%, rgba(20, 199, 192, 0.04) 0%, transparent 60%)"
                    }}
                  />
                  <span className="text-3xl md:text-4xl font-medium text-[#f0f0f0] group-hover:text-[#14c7c0] transition-colors duration-300 relative z-10">
                    30+
                  </span>
                  <p className="font-mono text-[10px] tracking-wider text-[#3a3a3a] group-hover:text-[#8a8a8a] transition-colors duration-300 uppercase mt-4 relative z-10">
                    // Projects shipped
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
