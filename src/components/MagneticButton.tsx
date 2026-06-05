"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    setPosition({ x: distanceX * 0.25, y: distanceY * 0.25 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    "group relative inline-flex items-center justify-center overflow-hidden text-[13px] font-medium tracking-wide uppercase transition-all duration-300";

  const variantStyles = {
    primary:
      "px-7 py-3.5 bg-[#14c7c0] text-[#050505] hover:bg-[#1fdad3] hover:shadow-[0_0_28px_rgba(20,199,192,0.45)]",
    secondary:
      "px-7 py-3.5 border border-[#2a2a2a] text-[#f0f0f0] hover:border-[#14c7c0] hover:text-[#14c7c0] hover:shadow-[0_0_22px_rgba(20,199,192,0.25)]",
    ghost: "px-4 py-2 text-[#5a5a5a] hover:text-[#f0f0f0]",
  };

  // A light sheen that sweeps across the button on hover.
  const sheen =
    variant === "ghost" ? null : (
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
    );

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {href ? (
        <a
          href={href}
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
          {sheen}
          <span className="relative z-10">{children}</span>
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
          {sheen}
          <span className="relative z-10">{children}</span>
        </button>
      )}
    </motion.div>
  );
}
