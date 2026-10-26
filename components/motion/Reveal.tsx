"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** ms — for a short stagger between siblings. */
  delay?: number;
};

/**
 * A short entrance (opacity + a few px of rise, ~0.7s) the first time an
 * element scrolls into view — finish, never a gate. Content is rendered
 * visible and only hidden by JS when it is still below the fold at mount,
 * so no-JS, an element already on screen, reduced motion or a missing
 * IntersectionObserver all simply show it. Never wrap prices or buttons in
 * it: commercial information stays visible regardless of animation.
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "done";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
