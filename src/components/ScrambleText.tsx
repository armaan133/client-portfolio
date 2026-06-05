"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]{}#*+=-_%";

/**
 * Decodes its text character-by-character when scrolled into view, scrambling
 * the not-yet-revealed glyphs — an on-brand "terminal decrypt" reveal. The
 * monospace tags it wraps keep a stable width, so there is no layout jitter.
 * Falls back to plain text when reduced motion is requested.
 */
export default function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    // Static text until it scrolls in; reduced-motion users never see scramble.
    if (!inView || reducedMotion) return;

    const total = text.length;
    let revealed = 0;
    let raf = 0;

    const tick = () => {
      let out = "";
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === " ") {
          out += " ";
        } else if (i < revealed) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      revealed += 0.8;
      if (revealed <= total) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reducedMotion, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
